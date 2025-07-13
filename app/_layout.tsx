import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useFrameworkReady();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        // Handle initial navigation based on session
        if (session) {
          router.replace('/(tabs)');
        } else {
          router.replace('/welcome');
        }
      } catch (error) {
        console.error('Error getting session:', error);
        router.replace('/welcome');
      } finally {
        setLoading(false);
        await SplashScreen.hideAsync();
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (event === 'SIGNED_IN' && session) {
        router.replace('/(tabs)');
      } else if (event === 'SIGNED_OUT' || !session) {
        router.replace('/welcome');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null; // Splash screen is shown while loading
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} initialRouteName={session ? "(tabs)" : "welcome"}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}