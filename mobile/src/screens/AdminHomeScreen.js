import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShieldCheck,
  Users,
  BookMarked,
  ClipboardList,
  LogOut,
  Building2,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

export default function AdminHomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/admin');
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin dashboard data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const metrics = data?.metrics || {
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0,
    totalAssignments: 0,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* User Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeRow}>
            <View style={[styles.avatar, { backgroundColor: '#e11d48' }]}>
              <ShieldCheck color="#ffffff" size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeTitle}>Admin Portal</Text>
              <Text style={styles.welcomeSub}>{user?.email || 'Campus Administrator'}</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <LogOut size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color="#e11d48" />
            <Text style={styles.loadingText}>Loading campus metrics...</Text>
          </View>
        ) : (
          <>
            {/* KPI Metric Grid */}
            <View style={styles.metricGrid}>
              <View style={[styles.metricCard, { backgroundColor: '#eef2ff', borderColor: '#c7d2fe' }]}>
                <Users size={20} color="#4f46e5" />
                <Text style={styles.metricNum}>{metrics.totalStudents}</Text>
                <Text style={styles.metricLabel}>Students</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
                <Users size={20} color="#059669" />
                <Text style={[styles.metricNum, { color: '#059669' }]}>{metrics.totalTeachers}</Text>
                <Text style={styles.metricLabel}>Faculty</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: '#fdf4ff', borderColor: '#f5d0fe' }]}>
                <BookMarked size={20} color="#9333ea" />
                <Text style={[styles.metricNum, { color: '#9333ea' }]}>{metrics.totalSubjects}</Text>
                <Text style={styles.metricLabel}>Courses</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: '#fff1f2', borderColor: '#fecdd3' }]}>
                <ClipboardList size={20} color="#e11d48" />
                <Text style={[styles.metricNum, { color: '#e11d48' }]}>{metrics.totalAssignments}</Text>
                <Text style={styles.metricLabel}>Total Tasks</Text>
              </View>
            </View>

            {/* Admin Management Actions */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Institutional Overview</Text>
              <View style={styles.actionItem}>
                <Building2 size={20} color="#4f46e5" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.actionItemTitle}>Department & Academic System</Text>
                  <Text style={styles.actionItemSub}>All university systems active & operational</Text>
                </View>
              </View>
            </View>
          </>
        )}
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
  welcomeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  welcomeSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  logoutBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
  },
  centerLoading: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  metricNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  actionItemSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});
