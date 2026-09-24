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
  FileText,
  CheckSquare,
  Users,
  SearchCheck,
  Plus,
  LogOut,
  Clock,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

export default function TeacherHomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/teacher');
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch teacher dashboard data', err);
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
    totalAssignments: 0,
    activeAssignments: 0,
    totalSubmissions: 0,
    pendingGrading: 0,
  };

  const assignments = data?.recentAssignments || [];

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
            <View style={[styles.avatar, { backgroundColor: '#059669' }]}>
              <Text style={styles.avatarText}>{user?.fullName?.charAt(0) || 'T'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeTitle}>Dr. {user?.fullName?.split(' ')[0]}</Text>
              <Text style={styles.welcomeSub}>{user?.department || 'Faculty Workspace'}</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <LogOut size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Loading faculty dashboard...</Text>
          </View>
        ) : (
          <>
            {/* KPI Metric Grid */}
            <View style={styles.metricGrid}>
              <View style={[styles.metricCard, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
                <FileText size={20} color="#059669" />
                <Text style={styles.metricNum}>{metrics.totalAssignments}</Text>
                <Text style={styles.metricLabel}>Assignments</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: '#eef2ff', borderColor: '#c7d2fe' }]}>
                <CheckSquare size={20} color="#4f46e5" />
                <Text style={[styles.metricNum, { color: '#4f46e5' }]}>{metrics.totalSubmissions}</Text>
                <Text style={styles.metricLabel}>Submissions</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
                <Clock size={20} color="#d97706" />
                <Text style={[styles.metricNum, { color: '#d97706' }]}>{metrics.pendingGrading}</Text>
                <Text style={styles.metricLabel}>To Grade</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: '#fdf2f8', borderColor: '#fbcfe8' }]}>
                <SearchCheck size={20} color="#db2777" />
                <Text style={[styles.metricNum, { color: '#db2777' }]}>100%</Text>
                <Text style={styles.metricLabel}>AI Check</Text>
              </View>
            </View>

            {/* Assignments List */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Course Assignments</Text>
              </View>

              {assignments.length === 0 ? (
                <View style={styles.emptyState}>
                  <FileText size={32} color="#94a3b8" />
                  <Text style={styles.emptyTitle}>No assignments created</Text>
                </View>
              ) : (
                assignments.map((item, idx) => (
                  <View key={item._id || idx} style={styles.assignmentItem}>
                    <View style={styles.assignmentLeft}>
                      <Text style={styles.assignmentTitle}>{item.title}</Text>
                      <Text style={styles.assignmentSubject}>{item.subject?.name || item.course || 'Subject'}</Text>
                    </View>
                    <View style={styles.submissionsBadge}>
                      <Text style={styles.submissionsBadgeText}>{item.submissionsCount || 0} Submissions</Text>
                    </View>
                  </View>
                ))
              )}
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
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  assignmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  assignmentLeft: {
    flex: 1,
    marginRight: 10,
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  assignmentSubject: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  submissionsBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  submissionsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 8,
  },
});
