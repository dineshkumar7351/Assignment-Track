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
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent,
  Sparkles,
  Calendar,
  LogOut,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

export default function StudentHomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/student');
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch student dashboard data', err);
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
    submittedCount: 0,
    pendingCount: 0,
    completionPercentage: 0,
    averageGrade: 'N/A',
  };

  const upcomingDeadlines = data?.upcomingDeadlines || [];

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
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.fullName?.charAt(0) || 'S'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeTitle}>Welcome back, {user?.fullName?.split(' ')[0]}!</Text>
              <Text style={styles.welcomeSub}>{user?.department || 'Student Workspace'}</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <LogOut size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text style={styles.loadingText}>Loading your coursework stats...</Text>
          </View>
        ) : (
          <>
            {/* KPI Metric Grid */}
            <View style={styles.metricGrid}>
              <View style={[styles.metricCard, { backgroundColor: '#eef2ff', borderColor: '#c7d2fe' }]}>
                <BookOpen size={20} color="#4f46e5" />
                <Text style={styles.metricNum}>{metrics.totalAssignments}</Text>
                <Text style={styles.metricLabel}>Total Tasks</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
                <CheckCircle2 size={20} color="#059669" />
                <Text style={[styles.metricNum, { color: '#059669' }]}>{metrics.submittedCount}</Text>
                <Text style={styles.metricLabel}>Submitted</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
                <Clock size={20} color="#d97706" />
                <Text style={[styles.metricNum, { color: '#d97706' }]}>{metrics.pendingCount}</Text>
                <Text style={styles.metricLabel}>Pending</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: '#fdf4ff', borderColor: '#f5d0fe' }]}>
                <Percent size={20} color="#9333ea" />
                <Text style={[styles.metricNum, { color: '#9333ea' }]}>{metrics.completionPercentage}%</Text>
                <Text style={styles.metricLabel}>Completion</Text>
              </View>
            </View>

            {/* Upcoming Deadlines Section */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Calendar size={18} color="#4f46e5" />
                  <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Assignments')}>
                  <Text style={styles.seeAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              {upcomingDeadlines.length === 0 ? (
                <View style={styles.emptyState}>
                  <Sparkles size={32} color="#94a3b8" />
                  <Text style={styles.emptyTitle}>No Pending Deadlines</Text>
                  <Text style={styles.emptySubtitle}>You are all caught up on your assignments!</Text>
                </View>
              ) : (
                upcomingDeadlines.map((item, idx) => (
                  <View key={item._id || idx} style={styles.deadlineItem}>
                    <View style={styles.deadlineLeft}>
                      <Text style={styles.deadlineTitle}>{item.title}</Text>
                      <Text style={styles.deadlineSubject}>{item.subject?.name || item.course || 'Course'}</Text>
                    </View>
                    <View style={styles.deadlineBadge}>
                      <Clock size={12} color="#4f46e5" />
                      <Text style={styles.deadlineDue}>
                        {new Date(item.dueDate).toLocaleDateString()}
                      </Text>
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
    backgroundColor: '#4f46e5',
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
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4f46e5',
  },
  deadlineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  deadlineLeft: {
    flex: 1,
    marginRight: 10,
  },
  deadlineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  deadlineSubject: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  deadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deadlineDue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4f46e5',
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
  emptySubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
});
