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
import { useResponsive } from '../utils/responsive';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isTablet, padding, containerStyle, ms } = useResponsive();

  const avatarSize = isTablet ? 84 : 68;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { padding: padding }]}>
        <View style={containerStyle}>
          {/* Profile Card */}
          <View style={[styles.profileCard, { padding: isTablet ? 32 : 24 }]}>
            <View style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 3 }]}>
              <Text style={[styles.avatarText, { fontSize: ms(28) }]}>{user?.fullName?.charAt(0) || 'U'}</Text>
            </View>
            <Text style={[styles.userName, { fontSize: ms(18) }]}>{user?.fullName}</Text>
            <Text style={[styles.userRoleBadge, { fontSize: ms(10) }]}>{user?.role?.toUpperCase()} ACCOUNT</Text>
          </View>

          {/* Details Card */}
          <View style={[styles.card, { padding: isTablet ? 24 : 18 }]}>
            <Text style={[styles.cardTitle, { fontSize: ms(14) }]}>Academic Details</Text>

            <View style={styles.row}>
              <Mail size={ms(18)} color="#64748b" />
              <View style={styles.rowContent}>
                <Text style={[styles.label, { fontSize: ms(11) }]}>Email Address</Text>
                <Text style={[styles.val, { fontSize: ms(13) }]}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Building2 size={ms(18)} color="#64748b" />
              <View style={styles.rowContent}>
                <Text style={[styles.label, { fontSize: ms(11) }]}>Department</Text>
                <Text style={[styles.val, { fontSize: ms(13) }]}>{user?.department || 'Academic Department'}</Text>
              </View>
            </View>

            {user?.studentId ? (
              <View style={styles.row}>
                <BadgeCheck size={ms(18)} color="#64748b" />
                <View style={styles.rowContent}>
                  <Text style={[styles.label, { fontSize: ms(11) }]}>Student ID</Text>
                  <Text style={[styles.val, { fontSize: ms(13) }]}>{user?.studentId}</Text>
                </View>
              </View>
            ) : null}

            {user?.employeeId ? (
              <View style={styles.row}>
                <BadgeCheck size={ms(18)} color="#64748b" />
                <View style={styles.rowContent}>
                  <Text style={[styles.label, { fontSize: ms(11) }]}>Faculty ID</Text>
                  <Text style={[styles.val, { fontSize: ms(13) }]}>{user?.employeeId}</Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.logoutBtn, { height: isTablet ? 54 : 48 }]}
            onPress={logout}
            activeOpacity={0.8}
          >
            <LogOut size={ms(18)} color="#ffffff" />
            <Text style={[styles.logoutText, { fontSize: ms(14) }]}>Sign Out from Account</Text>
          </TouchableOpacity>
        </View>
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
