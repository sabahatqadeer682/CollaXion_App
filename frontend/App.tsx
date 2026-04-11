import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar } from 'react-native';

import SplashScreen from './screens/SplashScreen';
import SplashScreen2 from './screens/SplashScreen2';

import EnterCode from './screens/studentscreens/EnterCode';
import RolesScreen from './screens/studentscreens/RolesScreen';
import StudentDashboardNavigator from './screens/studentscreens/StudentDashboardNavigator';
import StudentLogin from './screens/studentscreens/StudentLogin';
import StudentRegister from './screens/studentscreens/StudentRegister';

// Industry screens
import IndustryDashboard from './screens/industryscreens/IndustryDashboard';
import IndustryLogin from './screens/industryscreens/IndustryLogin';
import { PostOpportunityScreen }    from './screens/industryscreens/PostOpportunityScreen';
import { StudentApplicationsScreen } from './screens/industryscreens/StudentApplicationsScreen';
import { InvitationsScreen }         from './screens/industryscreens/InvitationsScreen';
import { EventCreationScreen }       from './screens/industryscreens/EventCreationScreen';
import { AIRecommendScreen }         from './screens/industryscreens/AIRecommendScreen';

import { UserProvider } from "./screens/studentscreens/UserContext";

export type RootStackParamList = {
  // ── Splash & Onboarding ──────────────────────────
  Splash:        undefined;
  SplashScreen2: undefined;
  RolesScreen:   undefined;

  // ── Student Flow ─────────────────────────────────
  StudentLogin:              undefined;
  EnterCode:                 { email: string };
  StudentRegister:           undefined;
  StudentDashboardNavigator: undefined;

  // ── Industry Flow ────────────────────────────────
  IndustryLogin:      undefined;
  /**
   * IndustryDashboard contains a Drawer navigator + MouDetail stack internally.
   * PostOpportunity, StudentApplications, Invitations, EventCreation, and AIRecommend
   * are also registered as Drawer screens inside it, but are listed here as well for
   * global deep-link / push-notification access from outside the drawer context.
   */
  IndustryDashboard:      undefined;
  PostOpportunity:        undefined;
  StudentApplications:    undefined;
  Invitations:            undefined;
  EventCreation:          undefined;
  AIRecommend:            undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#050D1A" barStyle="light-content" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}>

          {/* ── Splash ── */}
          <Stack.Screen name="Splash"        component={SplashScreen} />
          <Stack.Screen name="SplashScreen2" component={SplashScreen2} />

          {/* ── Shared ── */}
          <Stack.Screen name="RolesScreen" component={RolesScreen} />

          {/* ── Student Flow ── */}
          <Stack.Screen name="StudentLogin"              component={StudentLogin}              options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="EnterCode"                 component={EnterCode}                options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="StudentRegister"           component={StudentRegister}           options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="StudentDashboardNavigator" component={StudentDashboardNavigator} options={{ animation: "fade" }} />

          {/* ── Industry Flow ── */}
          <Stack.Screen name="IndustryLogin"     component={IndustryLogin}     options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="IndustryDashboard" component={IndustryDashboard} options={{ animation: "fade" }} />

          {/*
           * Global stack entries for industry feature screens.
           * These allow navigation from push notifications, deep links,
           * or any context outside the drawer navigator.
           * The drawer also registers these screens internally.
           */}
          <Stack.Screen
            name="PostOpportunity"
            component={PostOpportunityScreen}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="StudentApplications"
            component={StudentApplicationsScreen}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="Invitations"
            component={InvitationsScreen}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="EventCreation"
            component={EventCreationScreen}
            options={{ animation: "slide_from_right" }}
          />
          {/*
           * AI Recommend — Gemini-powered student ranking screen.
           * Accessible from the Dashboard's "AI Recommend" quick action
           * and from the AIChatbot drawer entry (mapped to "AIChatbot" → navigate("AIRecommend")).
           * Also registered globally here for deep links.
           */}
          <Stack.Screen
            name="AIRecommend"
            component={AIRecommendScreen}
            options={{ animation: "slide_from_right" }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}