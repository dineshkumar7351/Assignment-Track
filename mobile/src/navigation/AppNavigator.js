import React from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Sparkles,
  User,
  Shield,
  TrendingUp,
  Bell,
} from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';
import WelcomeHomeScreen from '../screens/WelcomeHomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

import StudentHomeScreen from '../screens/StudentHomeScreen';
import TeacherHomeScreen from '../screens/TeacherHomeScreen';
import AdminHomeScreen from '../screens/AdminHomeScreen';

import AssignmentsScreen from '../screens/AssignmentsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import AiAssistantScreen from '../screens/AiAssistantScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function getTabBarStyle(insets) {
  const bottomInset = insets.bottom || 0;
  return {
    backgroundColor: '#ffffff',
    borderTopColor: '#e2e8f0',
    borderTopWidth: 1,
    height: Platform.OS === 'android' ? 66 + bottomInset : 56 + bottomInset,
    paddingBottom: Math.max(bottomInset, 8),
    paddingTop: 6,
    elevation: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  };
}

function StudentTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: getTabBarStyle(insets),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={StudentHomeScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size || 20} />,
        }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size || 20} />,
        }}
      />
      <Tab.Screen
        name="AiAssistant"
        component={AiAssistantScreen}
        options={{
          tabBarLabel: 'AI Tutor',
          tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size || 20} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size || 20} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size || 20} />,
        }}
      />
    </Tab.Navigator>
  );
}

function TeacherTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: getTabBarStyle(insets),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={TeacherHomeScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size || 20} />,
        }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{
          tabBarLabel: 'Manage',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size || 20} />,
        }}
      />
      <Tab.Screen
        name="AiAssistant"
        component={AiAssistantScreen}
        options={{
          tabBarLabel: 'AI Tool',
          tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size || 20} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size || 20} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size || 20} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AdminTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e11d48',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: getTabBarStyle(insets),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminHomeScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Shield color={color} size={size || 20} />,
        }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{
          tabBarLabel: 'Master',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size || 20} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size || 20} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size || 20} />,
        }}
      />
    </Tab.Navigator>
  );
}

function MainAppStackNavigator({ initialComponent }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={initialComponent} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          user.role === 'admin' ? (
            <Stack.Screen name="AdminApp">
              {() => <MainAppStackNavigator initialComponent={AdminTabNavigator} />}
            </Stack.Screen>
          ) : user.role === 'teacher' ? (
            <Stack.Screen name="TeacherApp">
              {() => <MainAppStackNavigator initialComponent={TeacherTabNavigator} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="StudentApp">
              {() => <MainAppStackNavigator initialComponent={StudentTabNavigator} />}
            </Stack.Screen>
          )
        ) : (
          <>
            <Stack.Screen name="WelcomeHome" component={WelcomeHomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});
