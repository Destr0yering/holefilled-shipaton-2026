import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const redirectTo = process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL;
export const authConfigured = Boolean(url && anonKey);
const client: SupabaseClient | null = authConfigured ? createClient(url!, anonKey!, { auth: { storage: Platform.OS === 'web' ? undefined : AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: Platform.OS === 'web' } }) : null;

export const auth = {
  configured: authConfigured,
  async session(): Promise<Session | null> { if (!client) return null; const { data, error } = await client.auth.getSession(); if (error) throw error; return data.session; },
  onChange(callback: (session: Session | null) => void) { if (!client) return () => {}; const { data } = client.auth.onAuthStateChange((_event, session) => callback(session)); return () => data.subscription.unsubscribe(); },
  async sendMagicLink(email: string) { if (!client) throw new Error('Supabase authentication is not configured.'); const { error } = await client.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: redirectTo } }); if (error) throw error; },
  async signOut() { if (!client) return; const { error } = await client.auth.signOut(); if (error) throw error; },
};
