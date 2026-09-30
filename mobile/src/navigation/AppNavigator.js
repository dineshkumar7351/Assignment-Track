import React from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutDashboard, BookOpen, User, Shield } from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';
import WelcomeHomeScreen from '../screens/WelcomeHomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import StudentHomeScreen from '../screens/StudentHomeScreen';
import TeacherHomeScreen from '../screens/TeacherHomeScreen';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import AssignmentsScreen from '../screens/AssignmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function getTabBarStyle(insets, activeColor) {
  const bottomInset = insets.bottom || 0;
  return {
    backgroundColor: '#ffffff',
    borderTopColor: '#e2e8f0',
    borderTopWidth: 1,
    height: Platform.OS === 'android' ? 68 + bottomInset : 58 + bottomInset,
    paddingBottom: Math.max(bottomInset, 10),
    paddingTop: 8,
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
        tabBarStyle: getTabBarStyle(insets, '#4f46e5'),
        tabBarLabelStyle: {
          fontSize: 12,
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
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size || 22} />,
        }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{
          tabBarLabel: 'Assignments',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size || 22} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size || 22} />,
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
        tabBarStyle: getTabBarStyle(insets, '#059669'),
        tabBarLabelStyle: {
          fontSize: 12,
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
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size || 22} />,
        }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{
          tabBarLabel: 'Assignments',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size || 22} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size || 22} />,
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
        tabBarStyle: getTabBarStyle(insets, '#e11d48'),
        tabBarLabelStyle: {
          fontSize: 12,
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
          tabBarIcon: ({ color, size }) => <Shield color={color} size={size || 22} />,
        }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{
          tabBarLabel: 'Assignments',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size || 22} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size || 22} />,
        }}
      />
    </Tab.Navigator>
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
            <Stack.Screen name="AdminApp" component={AdminTabNavigator} />
          ) : user.role === 'teacher' ? (
            <Stack.Screen name="TeacherApp" component={TeacherTabNavigator} />
          ) : (
            <Stack.Screen name="StudentApp" component={StudentTabNavigator} />
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
