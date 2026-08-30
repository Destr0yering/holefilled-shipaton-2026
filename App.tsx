import { StatusBar } from 'expo-status-bar';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { demoScenarios } from './src/data';
import { AuditEvent, DemoScenario, StaffingHole } from './src/domain/models';
import { acceptCandidate, confirmedCandidates, qualifiedCandidates } from './src/domain/workflow';
import { PaywallOffering } from './src/services/revenuecat';
import { revenueCat } from './src/services/revenuecatAdapter';
import { auth } from './src/services/auth';

type Screen = 'beta' | 'dashboard' | 'incident' | 'paywall' | 'auth';
type PurchaseState = 'loading' | 'ready' | 'purchasing' | 'restoring' | 'active' | 'unconfigured' | 'error';
const c = { ink:'#10231F', muted:'#52645F', paper:'#F5F8F6', card:'#FFF', green:'#045844', mint:'#D9F3E9', amber:'#8A4B00', amberBg:'#FFF1D6', red:'#A72E2E', redBg:'#FCE4E4', blue:'#185DA8', blueBg:'#E3EFFC', border:'#D7E1DC' };

function Button({ label, onPress, secondary=false, disabled=false }: { label:string; onPress:()=>void; secondary?:boolean; disabled?:boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{disabled}} disabled={disabled} onPress={onPress} style={({pressed})=>[s.button,secondary&&s.button2,disabled&&s.disabled,pressed&&!disabled&&s.pressed]}><Text style={[s.buttonText,secondary&&s.buttonText2]}>{label}</Text></Pressable>;
}

function Pill({ label, tone='green' }: { label:string; tone?:'green'|'amber'|'red'|'blue' }) {
  return <View accessibilityLabel={`Status: ${label}`} style={[s.pill,tone==='amber'&&s.pillAmber,tone==='red'&&s.pillRed,tone==='blue'&&s.pillBlue]}><Text style={[s.pillText,tone==='amber'&&s.amber,tone==='red'&&s.red,tone==='blue'&&s.blue]}>{label}</Text></View>;
}

const sectorMark=(sector:DemoScenario['sector'])=>({Distribution:'D',Hospitality:'H','Food service':'F',Healthcare:'+', 'Public sector':'P'}[sector]);

export default function App() {
  usePreventScreenCapture('holefilled-closed-beta');
  const {width}=useWindowDimensions();
  const compact=width<700;
  const betaPurchasesEnabled=process.env.EXPO_PUBLIC_ENABLE_BETA_PURCHASES==='true';
  const [screen,setScreen]=useState<Screen>('beta');
  const [betaAcknowledged,setBetaAcknowledged]=useState(false);
  const [scenario,setScenario]=useState<DemoScenario>(demoScenarios[0]);
  const [hole,setHole]=useState<StaffingHole>(demoScenarios[0].hole);
  const [audit,setAudit]=useState<AuditEvent[]>(demoScenarios[0].audit);
  const [entitled,setEntitled]=useState(false);
  const [offering,setOffering]=useState<PaywallOffering|null>(null);
  const [purchaseState,setPurchaseState]=useState<PurchaseState>('loading');
  const [purchaseMessage,setPurchaseMessage]=useState('Checking secure purchase access…');
  const [userId,setUserId]=useState<string|null>(null);
  const [email,setEmail]=useState('');
  const [authMessage,setAuthMessage]=useState(auth.configured?'Sign in to link purchases to your HoleFilled account.':'Authentication is not configured in this demo build.');
  const [authBusy,setAuthBusy]=useState(false);
  const [selectedCandidateId,setSelectedCandidateId]=useState(demoScenarios[0].winnerCandidateId);
  const candidates=useMemo(()=>qualifiedCandidates(hole),[hole]);
  const confirmations=useMemo(()=>confirmedCandidates(hole),[hole]);
  const recommended=confirmations[0];
  const assigned=hole.candidates.find(x=>x.id===hole.assignedCandidateId);

  useEffect(()=>{
    let active=true;
    void auth.session().then(session=>{if(active)setUserId(session?.user.id??null);});
    return auth.onChange(session=>{if(active)setUserId(session?.user.id??null);});
  },[]);

  useEffect(()=>{
    if(!betaPurchasesEnabled){setPurchaseState('unconfigured');setPurchaseMessage('Purchases are unavailable in this beta build.');return;}
    const initializePurchases=async()=>{
      try {
        await revenueCat.configure(userId??undefined);
        if(userId) await revenueCat.login(userId);
        const [entitlement,nextOffering]=await Promise.all([revenueCat.getEntitlement(),revenueCat.getOffering()]);
        setEntitled(entitlement.active);
        setOffering(nextOffering);
        if(entitlement.active){setPurchaseState('active');setPurchaseMessage('HoleFilled Pro is active on this account.');}
        else if(!entitlement.configured||!nextOffering){setPurchaseState('unconfigured');setPurchaseMessage('A store product must be configured before purchases can begin.');}
        else {setPurchaseState('ready');setPurchaseMessage('Purchase securely through your device store.');}
      } catch {
        setPurchaseState('error');
        setPurchaseMessage('Purchase access could not be loaded. Try again when you are online.');
      }
    };
    void initializePurchases();
  },[betaPurchasesEnabled,userId]);

  const sendMagicLink=async()=>{try{setAuthBusy(true);await auth.sendMagicLink(email.trim());setAuthMessage('Check your email for a secure HoleFilled sign-in link.');}catch{setAuthMessage('We could not send a sign-in link. Check the address and Supabase Auth settings.');}finally{setAuthBusy(false);}};
  const signOut=async()=>{await auth.signOut();setScreen('dashboard');};

  const begin=()=>{
    const confirmationCount=hole.candidates.filter(candidate=>(candidate.responseOutcome??(candidate.barrier==='personal'?'declined':'confirmed'))==='confirmed').length;
    setHole(x=>({...x,status:'contacting',candidates:x.candidates.map(y=>({...y,status:y.responseOutcome??(y.barrier==='personal'?'declined':'confirmed')}))}));
    setSelectedCandidateId(scenario.winnerCandidateId);
    const winner=scenario.hole.candidates.find(candidate=>candidate.id===scenario.winnerCandidateId);
    setAudit(x=>[...x,{id:`${scenario.id}-a3`,at:'Now',actor:'ai',label:'Concurrent outreach started',detail:`${hole.candidates.length} voice/SMS conversations opened in one employer-approved wave.`},{id:`${scenario.id}-a4`,at:'Now',actor:'worker',label:'Multiple fillers confirmed',detail:`${confirmationCount} qualified coworkers responded yes with different timing, transportation, and incentive constraints. ${winner?.name??'One coworker'} is the recommended fit.`}]);
    setScreen('incident');
  };

  const fill=()=>{
    const result=acceptCandidate(hole,selectedCandidateId,hole.version,{incentiveCents:scenario.incentiveCents,transportation:scenario.transportation,eta:scenario.eta});
    setHole(result.hole);
    if(result.ok){
      const winner=result.hole.candidates.find(candidate=>candidate.id===selectedCandidateId);
      setAudit(x=>[...x,{id:`${scenario.id}-a5`,at:'Now',actor:'ai',label:'Approved assistance offered',detail:`The assistance is within ${scenario.organizationLabel}'s configured policy.`},{id:`${scenario.id}-a6`,at:'Now',actor:'worker',label:'Shift accepted',detail:`${winner?.name??'The selected coworker'} accepted; the remaining coworkers were thanked and released.`},{id:`${scenario.id}-a7`,at:'Now',actor:'system',label:'HoleFilled',detail:'Coverage confirmed with transportation and ETA.'}]);
      AccessibilityInfo.announceForAccessibility(`HoleFilled. ${winner?.name??'The replacement worker'} is confirmed with an estimated arrival of ${scenario.eta}.`);
    }
  };

  const selectScenario=(next:DemoScenario)=>{setScenario(next);setHole(next.hole);setAudit(next.audit);setSelectedCandidateId(next.winnerCandidateId);setScreen('dashboard');};
  const reset=()=>{setHole(scenario.hole);setAudit(scenario.audit);setSelectedCandidateId(scenario.winnerCandidateId);setScreen('dashboard');};
  const purchase=async()=>{
    try{
      setPurchaseState('purchasing');setPurchaseMessage('Waiting for the secure store confirmation…');
      const next=await revenueCat.purchase();setEntitled(next.active);
      setPurchaseState(next.active?'active':'ready');setPurchaseMessage(next.active?'HoleFilled Pro is active on this account.':'The purchase finished without activating Pro.');
    }catch(error){
      const cancelled=Boolean(error&&typeof error==='object'&&'userCancelled' in error&&(error as {userCancelled?:boolean}).userCancelled);
      setPurchaseState(cancelled?'ready':'error');
      setPurchaseMessage(cancelled?'Purchase cancelled. Nothing was charged.':'The purchase could not be completed. Try again or restore an existing purchase.');
    }
  };
  const restore=async()=>{
    try{
      setPurchaseState('restoring');setPurchaseMessage('Restoring purchases from your device store…');
      const next=await revenueCat.restore();setEntitled(next.active);
      setPurchaseState(next.active?'active':'ready');setPurchaseMessage(next.active?'HoleFilled Pro was restored.':'No active HoleFilled Pro purchase was found.');
    }catch{setPurchaseState('error');setPurchaseMessage('Purchases could not be restored. Check your connection and try again.');}
  };

  return <SafeAreaView style={s.safe}><StatusBar style="dark" />
    <View style={[s.header,compact&&s.headerCompact]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Go to dashboard" onPress={()=>setScreen(betaAcknowledged?'dashboard':'beta')} style={s.brand}><View style={s.brandMark}><Text style={s.brandMarkText}>H</Text></View><View><Text style={s.logo}>HoleFilled</Text>{!compact&&<Text style={s.tag}>Workforce response, resolved.</Text>}</View></Pressable>
      <View style={[s.headerRight,compact&&s.headerRightCompact]}><Pill label={userId?'Account linked':compact?'Demo':'Demo environment'} tone="blue"/>{auth.configured&&<Pressable accessibilityRole="button" onPress={()=>setScreen(betaAcknowledged?'auth':'beta')}><Text style={s.link}>{userId?'Account':'Sign in'}</Text></Pressable>}{betaPurchasesEnabled&&<Pressable accessibilityRole="button" onPress={()=>setScreen(betaAcknowledged?'paywall':'beta')}><Text style={s.link}>{entitled?'Pro active':'View Pro'}</Text></Pressable>}</View>
    </View>
    <ScrollView contentContainerStyle={[s.page,compact&&s.pageCompact]}>
      {screen==='beta'&&<View style={s.betaCard}>
        <Text style={s.eyebrow}>CLOSED BETA ACKNOWLEDGMENT</Text>
        <Text accessibilityRole="header" style={[s.h1,s.betaTitle]}>Welcome to the HoleFilled demo.</Text>
        <Text style={s.lead}>This pre-release experience demonstrates a fictional workforce-response workflow. It does not contact workers, make staffing decisions, or connect to employer systems.</Text>
        <View style={s.betaNotice}><Text style={s.betaNoticeTitle}>Before you enter</Text><Text style={s.small}>Do not enter real employee, customer, payment, health, or other sensitive personal information. This is not an emergency service or a live staffing solution.</Text><Text style={s.small}>Native beta builds block screenshots, screen recording, and recent-app previews to protect beta materials. This cannot prevent someone photographing a device screen.</Text></View>
        <Pressable accessibilityRole="checkbox" accessibilityLabel="Acknowledge beta confidentiality and data limits" accessibilityState={{checked:betaAcknowledged}} onPress={()=>setBetaAcknowledged(value=>!value)} style={s.checkboxRow}>
          <View style={[s.checkbox,betaAcknowledged&&s.checkboxChecked]}><Text style={s.checkboxMark}>{betaAcknowledged?'✓':''}</Text></View>
          <Text style={s.checkboxText}>I understand this is a pre-release demo using fictional data. I will not share screenshots, recordings, or access links publicly; I will report issues through the provided feedback channel; and I will not enter real employee, customer, payment, health, or sensitive personal information.</Text>
        </Pressable>
        <View style={s.actions}><Button label="Beta terms" onPress={()=>void Linking.openURL('https://destr0yering.github.io/holefilled-shipaton-2026/beta-terms.html')} secondary/><Button label="Privacy policy" onPress={()=>void Linking.openURL('https://destr0yering.github.io/holefilled-shipaton-2026/privacy.html')} secondary/><Button label="Support" onPress={()=>void Linking.openURL('https://destr0yering.github.io/holefilled-shipaton-2026/support.html')} secondary/></View>
        <Button label="Enter beta demo" onPress={()=>setScreen('dashboard')} disabled={!betaAcknowledged}/>
        <Text style={s.betaFinePrint}>This acknowledgement is not an NDA, pilot agreement, employment agreement, or customer contract.</Text>
      </View>}
      {screen==='dashboard'&&<>
        <View style={s.commandLabel}><View><Text style={s.eyebrow}>HOLEFILLED COMMAND CENTER</Text><Text accessibilityRole="header" style={s.commandTitle}>Coverage operations</Text></View><View style={s.liveStatus}><View style={s.liveDot}/><Text style={s.liveText}>Systems ready</Text></View></View>
        <View style={s.scenarioPanel}><View style={s.between}><View><Text accessibilityRole="header" style={s.scenarioTitle}>Choose an employer use case</Text><Text style={s.small}>Five sectors. One governed response workflow.</Text></View><Pill label="Fictional demo portfolio" tone="blue"/></View><View style={s.scenarioTabs}>{demoScenarios.map(item=><Pressable key={item.id} accessibilityRole="button" accessibilityState={{selected:item.id===scenario.id}} onPress={()=>selectScenario(item)} style={[s.scenarioTab,item.id===scenario.id&&s.scenarioTabActive]}><View style={[s.sectorMark,item.id===scenario.id&&s.sectorMarkActive]}><Text style={[s.sectorMarkText,item.id===scenario.id&&s.scenarioTabTextActive]}>{sectorMark(item.sector)}</Text></View><View style={s.grow}><Text style={[s.scenarioTabText,item.id===scenario.id&&s.scenarioTabTextActive]}>{item.hole.role.split(' — ')[0]}</Text><Text style={[s.scenarioSector,item.id===scenario.id&&s.scenarioSectorActive]}>{item.sector}</Text></View></Pressable>)}</View></View>
        <View style={[s.hero,compact&&s.stack]}><View style={[s.heroCopy,compact&&s.growCompact]}><Text style={s.heroEyebrow}>{scenario.organizationLabel.toUpperCase()} • {scenario.operationsLabel.toUpperCase()}</Text><Text accessibilityRole="header" style={[s.h1,compact&&s.h1Compact]}>{scenario.headline}</Text><Text style={s.heroLead}>Eight qualified coworkers are ready for one policy-controlled, near-simultaneous outreach wave.</Text><View style={s.heroSignals}><View style={s.heroSignal}><Text style={s.heroSignalValue}>8</Text><Text style={s.heroSignalLabel}>outreach targets</Text></View><View style={s.heroSignal}><Text style={s.heroSignalValue}>4–5</Text><Text style={s.heroSignalLabel}>simulated yeses</Text></View><View style={s.heroSignal}><Text style={s.heroSignalValue}>1</Text><Text style={s.heroSignalLabel}>recommended fit</Text></View></View></View><View style={[s.metric,compact&&s.metricCompact]}><View style={s.metricTop}><Text style={s.metricLabel}>Coverage risk</Text><Pill label="Critical" tone="red"/></View><Text style={s.metricBig}>{scenario.escalationMinutes}<Text style={s.metricUnit}> min</Text></Text><Text style={s.metricHint}>before escalation</Text><View style={s.riskTrack}><View style={[s.riskFill,{width:`${Math.min(88,Math.max(35,100-scenario.escalationMinutes/1.2))}%`}]} /></View></View></View>
        <View style={s.card}><View style={[s.between,compact&&s.stack]}><View style={[s.grow,compact&&s.growCompact]}><View style={s.inline}><View style={s.incidentIcon}><Text style={s.incidentIconText}>{sectorMark(scenario.sector)}</Text></View><View><Text style={s.cardKicker}>ACTIVE COVERAGE INCIDENT</Text><Text style={s.mono}>{hole.externalId}</Text></View></View><Text accessibilityRole="header" style={s.h2}>{hole.role}</Text><Text style={s.body}>{hole.worksite}</Text><Text style={s.shiftTime}>{hole.startsAt}–{hole.endsAt}</Text></View><View style={s.candidateSummary}><Text style={s.candidateSummaryBig}>{candidates.length}</Text><Text style={s.candidateSummaryLabel}>qualified fillers</Text><Text style={s.candidateSummaryHint}>ready for outreach</Text></View></View><View style={s.rule}/><View style={[s.grid,compact&&s.stack]}><Info k="Required" v={scenario.requiredLabel}/><Info k="Autonomous offer" v={`Up to $${(hole.policy.autonomousLimitCents/100).toFixed(0)}`}/><Info k="Transport support" v={`Up to $${(hole.policy.rideCreditLimitCents/100).toFixed(0)}`}/></View><View style={[s.actions,compact&&s.stack]}><Button label="Start near-simultaneous outreach" onPress={begin}/><Button label="Review incident details" onPress={()=>setScreen('incident')} secondary/></View></View>
      </>}

      {screen==='incident'&&<>
        {hole.status==='filled'?<View accessibilityRole="summary" style={s.success}><View style={s.successMark}><Text style={s.successMarkText}>✓</Text></View><Text style={s.successKicker}>COVERAGE CONFIRMED</Text><Text accessibilityRole="header" style={s.successTitle}>HoleFilled.</Text><Text style={s.successLead}>{assigned?.name} accepted the {hole.role} shift and is expected at {hole.eta}.</Text><View style={s.successFacts}><View style={s.successFact}><Text style={s.successFactLabel}>TRANSPORTATION</Text><Text style={s.successDetail}>{hole.transportation}</Text></View><View style={s.successFact}><Text style={s.successFactLabel}>APPROVED ASSISTANCE</Text><Text style={s.successDetail}>${((hole.incentiveCents??0)/100).toFixed(0)}</Text></View><View style={s.successFact}><Text style={s.successFactLabel}>ARRIVAL</Text><Text style={s.successDetail}>{hole.eta}</Text></View></View><Button label="Run another scenario" onPress={reset} secondary/></View>:
        <View style={s.card}><View style={s.between}><View><Text style={s.eyebrow}>LIVE INCIDENT</Text><Text accessibilityRole="header" style={s.h2}>{hole.role}</Text></View><Pill label={hole.status==='contacting'?`${confirmations.length} confirmed fillers`:'Ready'} tone="amber"/></View><Text style={s.body}>AI wording is persuasive and friendly. Eligibility, ranking, spending, manager selection, and final assignment remain deterministic.</Text></View>}
        <View style={s.guardrail} accessibilityLabel="Worker outreach safeguards"><Text style={s.guardrailTitle}>Human safeguards active</Text><Text style={s.small}>Only consented internal coworkers are contacted · Declining carries no penalty · Manager approval is required above ${(hole.policy.autonomousLimitCents/100).toFixed(0)} · A manager can take over at any time</Text></View>
        {hole.status==='contacting'&&<><Text accessibilityRole="header" style={s.section}>Manager selection · confirmed fillers</Text><Text style={s.small}>Recommended by fewest restraints, then distance and qualification match. The employer makes the final selection.</Text><View style={s.shortlist}>{confirmations.map((x,index)=><Pressable key={x.id} accessibilityRole="button" accessibilityLabel={`${selectedCandidateId===x.id?'Selected: ':'Select '}${x.name}, ${x.restraintScore} constraint points`} onPress={()=>setSelectedCandidateId(x.id)} style={[s.shortlistItem,selectedCandidateId===x.id&&s.shortlistSelected]}><View style={s.grow}><Text style={s.candidateName}>{x.name}</Text><Text style={s.small}>{x.restraintScore} constraint points · {x.distanceMiles} miles · Match {x.score}%</Text></View>{index===0&&<Pill label="Recommended fit" tone="green"/>}</Pressable>)}</View></>}
        <Text accessibilityRole="header" style={s.section}>Concurrent conversations</Text><View style={s.cards}>{hole.candidates.map(x=><View key={x.id} style={[s.candidate,compact&&s.candidateCompact]}><View style={s.between}><Text style={s.candidateName}>{x.name}</Text><Pill label={x.status} tone={x.status==='declined'||x.status==='no-response'?'red':x.status==='confirmed'||x.status==='accepted'?'green':'amber'}/></View><Text style={s.small}>{x.channel.toUpperCase()} · response at {x.responseDelaySeconds??0}s · {x.distanceMiles} miles · Match {x.score}%</Text><View style={s.message}><Text style={s.messageLabel}>SIMULATED WORKER RESPONSE</Text><Text style={s.messageText}>“{x.message}”</Text></View>{x.barrier==='transportation'&&x.status!=='accepted'&&<Text style={s.solution}>Suggested: {scenario.transportation}</Text>}{x.barrier==='incentive'&&x.status!=='closed'&&<Text style={s.solution}>Within policy: up to ${(hole.policy.autonomousLimitCents/100).toFixed(0)} automatically</Text>}</View>)}</View>
        {hole.status!=='filled'&&<View style={s.actions}>{hole.status==='open'?<Button label="Begin concurrent outreach" onPress={begin}/>:<Button label={`Confirm ${hole.candidates.find(x=>x.id===selectedCandidateId)?.name??'selected filler'} and mark HoleFilled`} onPress={fill}/>}</View>}
        <Text accessibilityRole="header" style={s.section}>Decision timeline</Text><View style={s.timeline}>{audit.map(x=><View key={x.id} style={s.timelineItem}><Text style={s.time}>{x.at}</Text><View style={s.grow}><Text style={s.timelineLabel}>{x.label} · {x.actor}</Text><Text style={s.small}>{x.detail}</Text></View></View>)}</View>
      </>}

      {screen==='paywall'&&<View style={s.paywall}><Text style={s.eyebrow}>REVENUECAT-POWERED MANAGER ACCESS</Text><Text accessibilityRole="header" style={[s.h1,s.paywallTitle]}>Turn every callout into a controlled response.</Text><Text style={s.lead}>HoleFilled Pro is an optional individual manager subscription for concurrent outreach, policy-controlled negotiation, transportation resolution, and audit history.</Text><View style={s.priceCard}><Text style={s.price}>{offering?.priceString??'$49.00'}<Text style={s.priceUnit}> / month</Text></Text><Text style={s.body}>{offering?.productTitle??'HoleFilled Pro'} · Subscription terms and trial eligibility are confirmed by the device store before purchase.</Text><View accessibilityRole="alert" style={s.purchaseStatus}><Text style={s.purchaseStatusText}>{purchaseMessage}</Text></View><Button label={entitled?'HoleFilled Pro is active':purchaseState==='purchasing'?'Opening secure purchase…':'Start manager subscription'} onPress={purchase} disabled={entitled||!offering||purchaseState==='purchasing'||purchaseState==='restoring'||purchaseState==='loading'}/><Button label={purchaseState==='restoring'?'Restoring purchases…':'Restore purchases'} onPress={restore} disabled={purchaseState==='purchasing'||purchaseState==='restoring'||purchaseState==='loading'} secondary/></View><Text style={s.small}>Employer licenses are provisioned through the organization’s contract, not this screen. Web preview uses a demo entitlement; native builds use store-configured RevenueCat products.</Text></View>}
      {screen==='auth'&&<View style={s.paywall}><Text style={s.eyebrow}>ACCOUNT ACCESS</Text><Text accessibilityRole="header" style={[s.h1,s.paywallTitle]}>Link your work account.</Text>{userId?<><Text style={s.body}>This account is linked to RevenueCat and tenant access.</Text><Button label="Sign out" onPress={signOut} secondary/></>:<><TextInput accessibilityLabel="Work email" autoCapitalize="none" keyboardType="email-address" placeholder="manager@company.com" placeholderTextColor={c.muted} value={email} onChangeText={setEmail} style={s.input}/><View accessibilityRole="alert" style={s.purchaseStatus}><Text style={s.purchaseStatusText}>{authMessage}</Text></View><Button label={authBusy?'Sending sign-in link…':'Email me a sign-in link'} onPress={sendMagicLink} disabled={!auth.configured||!email.includes('@')||authBusy}/></>}</View>}
      <Text style={s.footer}>Fictional demo data · No UKG, Got2Get2Work, Uber, Lyft, or employer partnership is claimed.</Text>
    </ScrollView>
  </SafeAreaView>;
}

const Info=({k,v}:{k:string;v:string})=><View><Text style={s.infoKey}>{k}</Text><Text style={s.infoValue}>{v}</Text></View>;
const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:'#F2F6F4'},
  header:{minHeight:78,paddingHorizontal:28,paddingVertical:13,backgroundColor:c.card,borderBottomWidth:1,borderBottomColor:c.border,flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:16},
  headerCompact:{paddingHorizontal:16,gap:6},brand:{flexDirection:'row',alignItems:'center',gap:11},brandMark:{width:38,height:38,borderRadius:12,backgroundColor:c.green,alignItems:'center',justifyContent:'center'},brandMarkText:{color:'#FFF',fontSize:20,fontWeight:'900'},
  headerRight:{flexDirection:'row',alignItems:'center',gap:14},headerRightCompact:{gap:2},logo:{fontSize:23,fontWeight:'900',color:c.ink,letterSpacing:-.7},tag:{fontSize:11,color:c.muted,marginTop:-1},link:{color:c.green,fontWeight:'800',padding:10},
  page:{width:'100%',maxWidth:1180,alignSelf:'center',padding:28,gap:20},pageCompact:{padding:16},
  commandLabel:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end',gap:12},commandTitle:{fontSize:26,fontWeight:'900',color:c.ink,letterSpacing:-.6},liveStatus:{flexDirection:'row',alignItems:'center',gap:7,backgroundColor:c.card,borderWidth:1,borderColor:c.border,paddingHorizontal:12,paddingVertical:8,borderRadius:999},liveDot:{width:8,height:8,borderRadius:4,backgroundColor:'#18A779'},liveText:{fontSize:12,fontWeight:'800',color:c.ink},
  scenarioPanel:{gap:14,backgroundColor:'rgba(255,255,255,.72)',borderWidth:1,borderColor:c.border,borderRadius:18,padding:18},scenarioTitle:{fontSize:17,fontWeight:'900',color:c.ink},scenarioTabs:{flexDirection:'row',flexWrap:'wrap',gap:9},scenarioTab:{flex:1,minHeight:66,minWidth:175,paddingHorizontal:11,paddingVertical:10,borderRadius:14,borderWidth:1,borderColor:c.border,backgroundColor:c.card,flexDirection:'row',alignItems:'center',gap:10},scenarioTabActive:{backgroundColor:c.ink,borderColor:c.ink},sectorMark:{width:34,height:34,borderRadius:10,backgroundColor:c.paper,alignItems:'center',justifyContent:'center'},sectorMarkActive:{backgroundColor:'#267A66'},sectorMarkText:{fontSize:15,fontWeight:'900',color:c.green},scenarioTabText:{fontSize:13,fontWeight:'900',color:c.ink},scenarioTabTextActive:{color:'#FFF'},scenarioSector:{fontSize:10,color:c.muted,marginTop:2},scenarioSectorActive:{color:'#C7DDD6'},
  hero:{flexDirection:'row',flexWrap:'wrap',gap:14,alignItems:'stretch'},heroCopy:{flex:1,minWidth:360,backgroundColor:c.green,borderRadius:24,padding:28,justifyContent:'center'},heroEyebrow:{fontSize:11,lineHeight:18,letterSpacing:1.25,fontWeight:'900',color:'#BCE4D8'},heroLead:{fontSize:17,lineHeight:26,color:'#DDF2EB',maxWidth:760,marginTop:11},heroSignals:{flexDirection:'row',flexWrap:'wrap',gap:10,marginTop:22},heroSignal:{backgroundColor:'rgba(255,255,255,.1)',borderWidth:1,borderColor:'rgba(255,255,255,.16)',borderRadius:12,paddingHorizontal:13,paddingVertical:9,minWidth:92},heroSignalValue:{color:'#FFF',fontSize:20,fontWeight:'900'},heroSignalLabel:{color:'#CFE8E0',fontSize:10,fontWeight:'700',textTransform:'uppercase',letterSpacing:.5},
  stack:{flexDirection:'column',alignSelf:'stretch'},grow:{flex:1,minWidth:250},growCompact:{minWidth:0,alignSelf:'stretch'},eyebrow:{fontSize:11,lineHeight:18,letterSpacing:1.2,fontWeight:'900',color:c.green},h1:{fontSize:39,lineHeight:45,fontWeight:'900',letterSpacing:-1.35,color:'#FFF',maxWidth:760,marginTop:7},h1Compact:{fontSize:31,lineHeight:37,letterSpacing:-.8},h2:{fontSize:25,lineHeight:32,fontWeight:'900',color:c.ink},lead:{fontSize:18,lineHeight:28,color:c.muted,maxWidth:760,marginTop:12},
  metric:{width:240,backgroundColor:c.ink,borderRadius:24,padding:22,justifyContent:'center'},metricCompact:{width:'auto',minWidth:0,alignSelf:'stretch'},metricTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8},metricLabel:{color:'#BBD1C9',fontWeight:'800',fontSize:12},metricBig:{color:'#FFF',fontSize:52,lineHeight:58,fontWeight:'900',marginTop:13,letterSpacing:-1.5},metricUnit:{fontSize:19,fontWeight:'700',color:'#C5D8D2'},metricHint:{color:'#D9E6E1'},riskTrack:{height:6,backgroundColor:'#29423B',borderRadius:99,overflow:'hidden',marginTop:18},riskFill:{height:6,backgroundColor:'#FFB650',borderRadius:99},
  card:{backgroundColor:c.card,borderRadius:22,borderWidth:1,borderColor:c.border,padding:24,gap:17,shadowColor:'#10231F',shadowOffset:{width:0,height:8},shadowOpacity:.05,shadowRadius:18,elevation:2},between:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',alignItems:'flex-start',gap:12},inline:{flexDirection:'row',alignItems:'center',gap:11,marginBottom:10},incidentIcon:{width:43,height:43,borderRadius:13,backgroundColor:c.mint,alignItems:'center',justifyContent:'center'},incidentIconText:{color:c.green,fontSize:18,fontWeight:'900'},cardKicker:{fontSize:10,fontWeight:'900',letterSpacing:1,color:c.green},candidateSummary:{minWidth:150,backgroundColor:c.paper,borderRadius:16,padding:16,alignItems:'center'},candidateSummaryBig:{fontSize:32,fontWeight:'900',color:c.green},candidateSummaryLabel:{fontSize:13,fontWeight:'900',color:c.ink},candidateSummaryHint:{fontSize:10,color:c.muted,marginTop:2},mono:{fontSize:11,color:c.muted,marginTop:2},body:{fontSize:16,lineHeight:24,color:c.muted},shiftTime:{fontSize:13,lineHeight:20,color:c.ink,fontWeight:'700',marginTop:2},small:{fontSize:13,lineHeight:20,color:c.muted},rule:{height:1,backgroundColor:c.border},grid:{flexDirection:'row',flexWrap:'wrap',gap:34},infoKey:{fontSize:10,fontWeight:'800',letterSpacing:.5,textTransform:'uppercase',color:c.muted},infoValue:{fontSize:15,fontWeight:'800',color:c.ink,marginTop:4},
  actions:{flexDirection:'row',flexWrap:'wrap',gap:12,marginTop:3},button:{minHeight:50,borderRadius:13,backgroundColor:c.green,paddingHorizontal:19,paddingVertical:13,alignItems:'center',justifyContent:'center'},button2:{backgroundColor:c.card,borderWidth:2,borderColor:c.green},buttonText:{color:'#FFF',fontWeight:'900',fontSize:14},buttonText2:{color:c.green},disabled:{opacity:.45},pressed:{opacity:.78},
  pill:{backgroundColor:c.mint,borderRadius:999,paddingHorizontal:10,paddingVertical:5,alignSelf:'flex-start'},pillAmber:{backgroundColor:c.amberBg},pillRed:{backgroundColor:c.redBg},pillBlue:{backgroundColor:c.blueBg},pillText:{color:c.green,fontSize:11,fontWeight:'900',textTransform:'capitalize'},amber:{color:c.amber},red:{color:c.red},blue:{color:c.blue},
  section:{fontSize:20,fontWeight:'900',color:c.ink,marginTop:8},guardrail:{backgroundColor:c.blueBg,borderWidth:1,borderColor:'#B9D6F3',borderRadius:14,padding:15,gap:4},guardrailTitle:{fontSize:14,fontWeight:'900',color:c.blue},cards:{flexDirection:'row',flexWrap:'wrap',gap:14},candidate:{flex:1,minWidth:260,backgroundColor:c.card,borderWidth:1,borderColor:c.border,borderRadius:18,padding:18,gap:11,shadowColor:c.ink,shadowOffset:{width:0,height:4},shadowOpacity:.035,shadowRadius:10,elevation:1},candidateCompact:{minWidth:0,alignSelf:'stretch',flexBasis:'100%'},candidateName:{fontSize:18,fontWeight:'900',color:c.ink},message:{backgroundColor:c.paper,borderRadius:12,padding:13},messageLabel:{fontSize:10,fontWeight:'900',letterSpacing:.5,color:c.muted},messageText:{fontSize:14,lineHeight:21,color:c.ink,marginTop:4},solution:{color:c.green,fontWeight:'800',lineHeight:20},timeline:{backgroundColor:c.card,borderRadius:18,borderWidth:1,borderColor:c.border,padding:18},timelineItem:{flexDirection:'row',gap:16,paddingVertical:10,borderBottomWidth:1,borderBottomColor:c.border},time:{width:62,fontSize:11,fontWeight:'800',color:c.muted},timelineLabel:{fontWeight:'900',color:c.ink,marginBottom:3,textTransform:'capitalize'},
  shortlist:{gap:10},shortlistItem:{minHeight:68,flexDirection:'row',alignItems:'center',gap:12,backgroundColor:c.card,borderWidth:2,borderColor:c.border,borderRadius:14,padding:14},shortlistSelected:{borderColor:c.green,backgroundColor:'#F0FAF6'},
  success:{backgroundColor:c.green,borderRadius:26,padding:30,gap:12,alignItems:'flex-start'},successMark:{width:52,height:52,borderRadius:26,backgroundColor:'#FFF',alignItems:'center',justifyContent:'center'},successMarkText:{fontSize:28,fontWeight:'900',color:c.green},successKicker:{color:'#BFE9DA',fontWeight:'900',letterSpacing:1.2},successTitle:{color:'#FFF',fontSize:56,lineHeight:61,fontWeight:'900',letterSpacing:-2},successLead:{color:'#E6F6F0',fontSize:19,lineHeight:29,maxWidth:760},successFacts:{flexDirection:'row',flexWrap:'wrap',gap:10,marginVertical:6},successFact:{minWidth:180,backgroundColor:'rgba(255,255,255,.1)',borderRadius:12,padding:13},successFactLabel:{fontSize:9,fontWeight:'900',letterSpacing:.7,color:'#BFE9DA',marginBottom:4},successDetail:{color:'#FFF',fontWeight:'800'},
  betaCard:{backgroundColor:c.card,borderRadius:24,borderWidth:1,borderColor:c.border,padding:28,gap:16,maxWidth:850,alignSelf:'center'},betaTitle:{color:c.ink,maxWidth:650},betaNotice:{backgroundColor:c.blueBg,borderWidth:1,borderColor:'#B9D6F3',borderRadius:14,padding:16,gap:4},betaNoticeTitle:{fontSize:14,fontWeight:'900',color:c.blue},checkboxRow:{flexDirection:'row',alignItems:'flex-start',gap:12,padding:14,borderWidth:1,borderColor:c.border,borderRadius:14,backgroundColor:c.paper},checkbox:{width:25,height:25,borderRadius:7,borderWidth:2,borderColor:c.green,alignItems:'center',justifyContent:'center',marginTop:1,flexShrink:0},checkboxChecked:{backgroundColor:c.green},checkboxMark:{color:'#FFF',fontSize:17,fontWeight:'900',lineHeight:20},checkboxText:{flex:1,fontSize:14,lineHeight:21,color:c.ink,fontWeight:'600'},betaFinePrint:{fontSize:11,lineHeight:17,color:c.muted},paywall:{backgroundColor:c.card,borderRadius:24,borderWidth:1,borderColor:c.border,padding:28,gap:12},paywallTitle:{color:c.ink},priceCard:{maxWidth:520,backgroundColor:c.paper,borderRadius:18,padding:22,gap:14,marginTop:12},price:{fontSize:40,fontWeight:'900',color:c.ink},priceUnit:{fontSize:16,fontWeight:'600',color:c.muted},purchaseStatus:{backgroundColor:c.card,borderWidth:1,borderColor:c.border,borderRadius:10,padding:12},purchaseStatusText:{fontSize:13,lineHeight:20,fontWeight:'700',color:c.ink},input:{minHeight:52,maxWidth:520,borderWidth:1,borderColor:c.border,borderRadius:12,paddingHorizontal:14,fontSize:16,color:c.ink,backgroundColor:'#FFF'},footer:{fontSize:11,lineHeight:17,color:c.muted,textAlign:'center',marginTop:20,marginBottom:10}
});
