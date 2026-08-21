import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { initialAudit, initialHole } from './src/data';
import { AuditEvent, StaffingHole } from './src/domain/models';
import { acceptCandidate, qualifiedCandidates } from './src/domain/workflow';
import { PaywallOffering } from './src/services/revenuecat';
import { revenueCat } from './src/services/revenuecatAdapter';

type Screen = 'dashboard' | 'incident' | 'paywall';
type PurchaseState = 'loading' | 'ready' | 'purchasing' | 'restoring' | 'active' | 'unconfigured' | 'error';
const c = { ink:'#10231F', muted:'#52645F', paper:'#F5F8F6', card:'#FFF', green:'#045844', mint:'#D9F3E9', amber:'#A65D00', amberBg:'#FFF1D6', red:'#A72E2E', redBg:'#FCE4E4', blue:'#185DA8', blueBg:'#E3EFFC', border:'#D7E1DC' };

function Button({ label, onPress, secondary=false, disabled=false }: { label:string; onPress:()=>void; secondary?:boolean; disabled?:boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{disabled}} disabled={disabled} onPress={onPress} style={({pressed})=>[s.button,secondary&&s.button2,disabled&&s.disabled,pressed&&!disabled&&s.pressed]}><Text style={[s.buttonText,secondary&&s.buttonText2]}>{label}</Text></Pressable>;
}

function Pill({ label, tone='green' }: { label:string; tone?:'green'|'amber'|'red'|'blue' }) {
  return <View accessibilityLabel={`Status: ${label}`} style={[s.pill,tone==='amber'&&s.pillAmber,tone==='red'&&s.pillRed,tone==='blue'&&s.pillBlue]}><Text style={[s.pillText,tone==='amber'&&s.amber,tone==='red'&&s.red,tone==='blue'&&s.blue]}>{label}</Text></View>;
}

export default function App() {
  const {width}=useWindowDimensions();
  const compact=width<700;
  const [screen,setScreen]=useState<Screen>('dashboard');
  const [hole,setHole]=useState<StaffingHole>(initialHole);
  const [audit,setAudit]=useState<AuditEvent[]>(initialAudit);
  const [entitled,setEntitled]=useState(false);
  const [offering,setOffering]=useState<PaywallOffering|null>(null);
  const [purchaseState,setPurchaseState]=useState<PurchaseState>('loading');
  const [purchaseMessage,setPurchaseMessage]=useState('Checking secure purchase access…');
  const candidates=useMemo(()=>qualifiedCandidates(hole),[hole]);
  const assigned=hole.candidates.find(x=>x.id===hole.assignedCandidateId);

  useEffect(()=>{
    const initializePurchases=async()=>{
      try {
        // RevenueCat creates an anonymous app user ID until production authentication supplies one.
        await revenueCat.configure();
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
  },[]);

  const begin=()=>{
    setHole(x=>({...x,status:'contacting',candidates:x.candidates.map(y=>({...y,status:y.barrier==='personal'?'declined':'negotiating'}))}));
    setAudit(x=>[...x,{id:'a3',at:'8:42 PM',actor:'ai',label:'Concurrent outreach started',detail:'Two voice conversations and one SMS conversation opened in an employer-approved wave.'},{id:'a4',at:'8:43 PM',actor:'worker',label:'Transportation barrier identified',detail:'Maya is available but needs a reliable ride.'}]);
    setScreen('incident');
  };

  const fill=()=>{
    const result=acceptCandidate(hole,'maya',hole.version,{incentiveCents:2000,transportation:'Got2Get2Work pickup + $20 ride credit',eta:'9:34 PM'});
    setHole(result.hole);
    if(result.ok){
      setAudit(x=>[...x,{id:'a5',at:'8:44 PM',actor:'ai',label:'Approved assistance offered',detail:'$20 is within the employer autonomous limit.'},{id:'a6',at:'8:45 PM',actor:'worker',label:'Shift accepted',detail:'Maya accepted; competing offers closed atomically.'},{id:'a7',at:'8:45 PM',actor:'system',label:'HoleFilled',detail:'Coverage confirmed with transportation and ETA.'}]);
      AccessibilityInfo.announceForAccessibility('HoleFilled. Maya is confirmed with an estimated arrival of 9:34 PM.');
    }
  };

  const reset=()=>{setHole(initialHole);setAudit(initialAudit);setScreen('dashboard');};
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
      <Pressable accessibilityRole="button" accessibilityLabel="Go to dashboard" onPress={()=>setScreen('dashboard')}><Text style={s.logo}>HoleFilled</Text>{!compact&&<Text style={s.tag}>Workforce response, resolved.</Text>}</Pressable>
      <View style={[s.headerRight,compact&&s.headerRightCompact]}><Pill label={compact?'Demo':'Demo environment'} tone="blue"/><Pressable accessibilityRole="button" onPress={()=>setScreen('paywall')}><Text style={s.link}>{entitled?'Pro active':'View Pro'}</Text></Pressable></View>
    </View>
    <ScrollView contentContainerStyle={[s.page,compact&&s.pageCompact]}>
      {screen==='dashboard'&&<>
        <View style={[s.hero,compact&&s.stack]}><View style={[s.grow,compact&&s.growCompact]}><Text style={s.eyebrow}>ATLANTIC DISTRIBUTION • NIGHT OPERATIONS</Text><Text accessibilityRole="header" style={[s.h1,compact&&s.h1Compact]}>One critical staffing hole needs attention.</Text><Text style={s.lead}>Three qualified coworkers are ready for a policy-controlled outreach wave.</Text></View><View style={[s.metric,compact&&s.metricCompact]}><Text style={s.metricLabel}>Coverage risk</Text><Text style={s.metricBig}>47 min</Text><Text style={s.metricHint}>before escalation</Text></View></View>
        <View style={s.card}><View style={[s.between,compact&&s.stack]}><View style={[s.grow,compact&&s.growCompact]}><View style={s.inline}><Pill label="Critical" tone="red"/><Text style={s.mono}>{hole.externalId}</Text></View><Text accessibilityRole="header" style={s.h2}>{hole.role}</Text><Text style={s.body}>{hole.worksite} · {hole.startsAt}–6:00 AM</Text></View><Pill label={`${candidates.length} qualified fillers`}/></View><View style={s.rule}/><View style={[s.grid,compact&&s.stack]}><Info k="Required" v="Forklift certification"/><Info k="Auto incentive" v="Up to $25"/><Info k="Ride support" v="Up to $40"/></View><View style={[s.actions,compact&&s.stack]}><Button label="Start HoleFilled outreach" onPress={begin}/><Button label="Review incident" onPress={()=>setScreen('incident')} secondary/></View></View>
      </>}

      {screen==='incident'&&<>
        {hole.status==='filled'?<View accessibilityRole="summary" style={s.success}><Text style={s.successKicker}>COVERAGE CONFIRMED</Text><Text accessibilityRole="header" style={s.successTitle}>HoleFilled.</Text><Text style={s.successLead}>{assigned?.name} accepted the {hole.role} shift and is expected at {hole.eta}.</Text><Text style={s.successDetail}>Transportation: {hole.transportation}</Text><Text style={s.successDetail}>Approved assistance: ${((hole.incentiveCents??0)/100).toFixed(0)}</Text><Button label="Run demo again" onPress={reset} secondary/></View>:
        <View style={s.card}><View style={s.between}><View><Text style={s.eyebrow}>LIVE INCIDENT</Text><Text accessibilityRole="header" style={s.h2}>{hole.role}</Text></View><Pill label={hole.status==='contacting'?'Contacting 3 fillers':'Ready'} tone="amber"/></View><Text style={s.body}>AI wording is persuasive and friendly. Eligibility, spending, and assignment remain deterministic.</Text></View>}
        <View style={s.guardrail} accessibilityLabel="Worker outreach safeguards"><Text style={s.guardrailTitle}>Human safeguards active</Text><Text style={s.small}>Only consented internal coworkers are contacted · Declining carries no penalty · Manager approval is required above $25 · A manager can take over at any time</Text></View>
        <Text accessibilityRole="header" style={s.section}>Concurrent conversations</Text><View style={s.cards}>{hole.candidates.map(x=><View key={x.id} style={[s.candidate,compact&&s.candidateCompact]}><View style={s.between}><Text style={s.candidateName}>{x.name}</Text><Pill label={x.status} tone={x.status==='declined'?'red':x.status==='accepted'?'green':'amber'}/></View><Text style={s.small}>{x.channel.toUpperCase()} · {x.distanceMiles} miles · Match {x.score}% · Consent verified</Text><View style={s.message}><Text style={s.messageLabel}>WORKER RESPONSE</Text><Text style={s.messageText}>“{x.message}”</Text></View>{x.barrier==='transportation'&&x.status!=='accepted'&&<Text style={s.solution}>Suggested: Got2Get2Work pickup + $20 ride credit</Text>}{x.barrier==='incentive'&&x.status!=='closed'&&<Text style={s.solution}>Within policy: up to $25 automatically</Text>}</View>)}</View>
        {hole.status!=='filled'&&<View style={s.actions}>{hole.status==='open'?<Button label="Begin concurrent outreach" onPress={begin}/>:<Button label="Offer Maya transportation and fill shift" onPress={fill}/>}</View>}
        <Text accessibilityRole="header" style={s.section}>Decision timeline</Text><View style={s.timeline}>{audit.map(x=><View key={x.id} style={s.timelineItem}><Text style={s.time}>{x.at}</Text><View style={s.grow}><Text style={s.timelineLabel}>{x.label} · {x.actor}</Text><Text style={s.small}>{x.detail}</Text></View></View>)}</View>
      </>}

      {screen==='paywall'&&<View style={s.paywall}><Text style={s.eyebrow}>REVENUECAT-POWERED ACCESS</Text><Text accessibilityRole="header" style={s.h1}>Turn every callout into a controlled response.</Text><Text style={s.lead}>HoleFilled Pro unlocks concurrent outreach, policy-controlled negotiation, transportation resolution, and audit history.</Text><View style={s.priceCard}><Text style={s.price}>{offering?.priceString??'$49.00'}<Text style={s.priceUnit}> / month</Text></Text><Text style={s.body}>{offering?.productTitle??'HoleFilled Pro'} · Subscription terms and trial eligibility are confirmed by the device store before purchase.</Text><View accessibilityRole="alert" style={s.purchaseStatus}><Text style={s.purchaseStatusText}>{purchaseMessage}</Text></View><Button label={entitled?'HoleFilled Pro is active':purchaseState==='purchasing'?'Opening secure purchase…':'Start subscription'} onPress={purchase} disabled={entitled||!offering||purchaseState==='purchasing'||purchaseState==='restoring'||purchaseState==='loading'}/><Button label={purchaseState==='restoring'?'Restoring purchases…':'Restore purchases'} onPress={restore} disabled={purchaseState==='purchasing'||purchaseState==='restoring'||purchaseState==='loading'} secondary/></View><Text style={s.small}>Web preview uses a clearly labeled demo entitlement. Native builds use platform-specific RevenueCat public SDK keys and store-configured products.</Text></View>}
      <Text style={s.footer}>Fictional demo data · No UKG, Got2Get2Work, Uber, Lyft, or employer partnership is claimed.</Text>
    </ScrollView>
  </SafeAreaView>;
}

const Info=({k,v}:{k:string;v:string})=><View><Text style={s.infoKey}>{k}</Text><Text style={s.infoValue}>{v}</Text></View>;
const s=StyleSheet.create({safe:{flex:1,backgroundColor:c.paper},header:{minHeight:76,paddingHorizontal:24,paddingVertical:14,backgroundColor:c.card,borderBottomWidth:1,borderBottomColor:c.border,flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:16},headerCompact:{paddingHorizontal:16,gap:6},headerRight:{flexDirection:'row',alignItems:'center',gap:14},headerRightCompact:{gap:2},logo:{fontSize:25,fontWeight:'900',color:c.ink,letterSpacing:-.8},tag:{fontSize:12,color:c.muted},link:{color:c.green,fontWeight:'800',padding:10},page:{width:'100%',maxWidth:1180,alignSelf:'center',padding:24,gap:20},pageCompact:{padding:16},hero:{flexDirection:'row',flexWrap:'wrap',gap:18,alignItems:'stretch'},stack:{flexDirection:'column',alignSelf:'stretch'},grow:{flex:1,minWidth:250},growCompact:{minWidth:0,alignSelf:'stretch'},eyebrow:{fontSize:12,lineHeight:18,letterSpacing:1.2,fontWeight:'800',color:c.green},h1:{fontSize:40,lineHeight:47,fontWeight:'900',letterSpacing:-1.4,color:c.ink,maxWidth:780,marginTop:8},h1Compact:{fontSize:32,lineHeight:38,letterSpacing:-.8},h2:{fontSize:25,lineHeight:32,fontWeight:'900',color:c.ink},lead:{fontSize:18,lineHeight:28,color:c.muted,maxWidth:760,marginTop:12},metric:{minWidth:210,backgroundColor:c.ink,borderRadius:20,padding:22,justifyContent:'center'},metricCompact:{minWidth:0,alignSelf:'stretch'},metricLabel:{color:'#BBD1C9',fontWeight:'700'},metricBig:{color:'#FFF',fontSize:38,fontWeight:'900',marginTop:6},metricHint:{color:'#D9E6E1'},card:{backgroundColor:c.card,borderRadius:20,borderWidth:1,borderColor:c.border,padding:22,gap:14},between:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',alignItems:'flex-start',gap:12},inline:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:10},mono:{fontSize:12,color:c.muted},body:{fontSize:16,lineHeight:24,color:c.muted},small:{fontSize:13,lineHeight:20,color:c.muted},rule:{height:1,backgroundColor:c.border},grid:{flexDirection:'row',flexWrap:'wrap',gap:28},infoKey:{fontSize:12,fontWeight:'700',color:c.muted},infoValue:{fontSize:15,fontWeight:'700',color:c.ink,marginTop:3},actions:{flexDirection:'row',flexWrap:'wrap',gap:12,marginTop:6},button:{minHeight:48,borderRadius:12,backgroundColor:c.green,paddingHorizontal:18,paddingVertical:13,alignItems:'center',justifyContent:'center'},button2:{backgroundColor:c.card,borderWidth:2,borderColor:c.green},buttonText:{color:'#FFF',fontWeight:'800',fontSize:15},buttonText2:{color:c.green},disabled:{opacity:.45},pressed:{opacity:.78},pill:{backgroundColor:c.mint,borderRadius:999,paddingHorizontal:10,paddingVertical:5,alignSelf:'flex-start'},pillAmber:{backgroundColor:c.amberBg},pillRed:{backgroundColor:c.redBg},pillBlue:{backgroundColor:c.blueBg},pillText:{color:c.green,fontSize:12,fontWeight:'800',textTransform:'capitalize'},amber:{color:c.amber},red:{color:c.red},blue:{color:c.blue},section:{fontSize:20,fontWeight:'900',color:c.ink,marginTop:8},guardrail:{backgroundColor:c.blueBg,borderWidth:1,borderColor:'#B9D6F3',borderRadius:14,padding:15,gap:4},guardrailTitle:{fontSize:14,fontWeight:'900',color:c.blue},cards:{flexDirection:'row',flexWrap:'wrap',gap:14},candidate:{flex:1,minWidth:260,backgroundColor:c.card,borderWidth:1,borderColor:c.border,borderRadius:16,padding:17,gap:11},candidateCompact:{minWidth:0,alignSelf:'stretch',flexBasis:'100%'},candidateName:{fontSize:18,fontWeight:'800',color:c.ink},message:{backgroundColor:c.paper,borderRadius:12,padding:12},messageLabel:{fontSize:11,fontWeight:'800',color:c.muted},messageText:{fontSize:14,lineHeight:21,color:c.ink,marginTop:4},solution:{color:c.green,fontWeight:'700',lineHeight:20},timeline:{backgroundColor:c.card,borderRadius:16,borderWidth:1,borderColor:c.border,padding:18},timelineItem:{flexDirection:'row',gap:16,paddingVertical:10,borderBottomWidth:1,borderBottomColor:c.border},time:{width:62,fontSize:12,fontWeight:'700',color:c.muted},timelineLabel:{fontWeight:'800',color:c.ink,marginBottom:3,textTransform:'capitalize'},success:{backgroundColor:c.green,borderRadius:24,padding:28,gap:12},successKicker:{color:'#BFE9DA',fontWeight:'800',letterSpacing:1.2},successTitle:{color:'#FFF',fontSize:54,lineHeight:60,fontWeight:'900',letterSpacing:-2},successLead:{color:'#E6F6F0',fontSize:19,lineHeight:29,maxWidth:760},successDetail:{color:'#FFF',fontWeight:'600'},paywall:{backgroundColor:c.card,borderRadius:24,borderWidth:1,borderColor:c.border,padding:28,gap:12},priceCard:{maxWidth:520,backgroundColor:c.paper,borderRadius:18,padding:22,gap:14,marginTop:12},price:{fontSize:40,fontWeight:'900',color:c.ink},priceUnit:{fontSize:16,fontWeight:'600',color:c.muted},purchaseStatus:{backgroundColor:c.card,borderWidth:1,borderColor:c.border,borderRadius:10,padding:12},purchaseStatusText:{fontSize:13,lineHeight:20,fontWeight:'700',color:c.ink},footer:{fontSize:11,lineHeight:17,color:c.muted,textAlign:'center',marginTop:20,marginBottom:10}});
