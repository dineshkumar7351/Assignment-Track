import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Mail,
  Building2,
  BadgeCheck,
  Shield,
  LogOut,
  Sparkles,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.fullName?.charAt(0) || 'U'}</Text>
          </View>
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userRoleBadge}>{user?.role?.toUpperCase()} ACCOUNT</Text>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Academic Details</Text>

          <View style={styles.row}>
            <Mail size={18} color="#64748b" />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.val}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Building2 size={18} color="#64748b" />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Department</Text>
              <Text style={styles.val}>{user?.department || 'Academic Department'}</Text>
            </View>
          </View>

          {user?.studentId ? (
            <View style={styles.row}>
              <BadgeCheck size={18} color="#64748b" />
              <View style={styles.rowContent}>
                <Text style={styles.label}>Student ID</Text>
                <Text style={styles.val}>{user?.studentId}</Text>
              </View>
            </View>
          ) : null}

          {user?.employeeId ? (
            <View style={styles.row}>
              <BadgeCheck size={18} color="#64748b" />
              <View style={styles.rowContent}>
                <Text style={styles.label}>Faculty ID</Text>
                <Text style={styles.val}>{user?.employeeId}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <LogOut size={18} color="#ffffff" />
          <Text style={styles.logoutText}>Sign Out from Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  userRoleBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4f46e5',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowContent: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  val: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e11d48',
    height: 48,
    borderRadius: 14,
    gap: 8,
    marginTop: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
