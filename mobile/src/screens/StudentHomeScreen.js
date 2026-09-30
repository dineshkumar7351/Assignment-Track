import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
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
  Bell,
  Building2,
  BadgeCheck,
  Check,
  FileCheck,
  ChevronRight,
  User,
  Menu,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useResponsive } from '../utils/responsive';
import api from '../config/api';
import SideDrawer from '../components/SideDrawer';

export default function StudentHomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { isTablet, isSmallDevice, containerStyle, moderateScale, screenPadding } = useResponsive();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/dashboard/student');
      if (res.data?.success) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch student dashboard data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const {
    statistics = {},
    progress = {},
    upcomingAssignments = [],
    recentActivity = [],
  } = dashboardData || {};

  const totalTasks = statistics?.totalCoursework ?? 7;
  const pendingTasks = statistics?.pendingTasks ?? 3;
  const submittedTasks = statistics?.submitted ?? 3;
  const overdueTasks = statistics?.overdue ?? 1;
  const avgScore = statistics?.averageScore ?? '92%';
  const completionRate = statistics?.completionRate ?? '42.9%';

  const submittedWidth = totalTasks > 0 ? (submittedTasks / totalTasks) * 100 : 42.9;
  const pendingWidth = totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 42.9;
  const overdueWidth = totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 14.2;

  const demoAssignments = upcomingAssignments.length > 0 ? upcomingAssignments : [
    {
      _id: '1',
      title: 'RSA Cryptosystem & Key Generation Implementation',
      subject: { name: 'Computer Networks' },
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      maxPoints: 100,
      priority: 'high',
      status: 'pending',
    },
    {
      _id: '2',
      title: 'ER Diagram & Relational Schema Normalization (3NF)',
      subject: { name: 'Database Systems' },
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      maxPoints: 50,
      priority: 'medium',
      status: 'submitted',
    },
    {
      _id: '3',
      title: 'Process Scheduling Simulation in C (Round Robin)',
      subject: { name: 'Operating Systems' },
      dueDate: new Date(Date.now() + 86400000 * 8).toISOString(),
      maxPoints: 100,
      priority: 'high',
      status: 'pending',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Side Drawer Modal */}
      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute="Dashboard"
        navigation={navigation}
      />

      {/* Top Brand Bar with Hamburger Menu */}
      <View style={styles.topBrandBar}>
        <View style={styles.topBrandLeft}>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setDrawerOpen(true)}
            activeOpacity={0.7}
          >
            <Menu size={22} color="#4f46e5" />
          </TouchableOpacity>

          <View style={styles.topAppLogo}>
            <Sparkles size={16} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.topBrandTitle}>Smart Tracker</Text>
            <Text style={styles.topBrandSub}>STUDENT WORKSPACE</Text>
          </View>
        </View>

        <View style={styles.topBrandRight}>
          <TouchableOpacity
            style={styles.iconCircleBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Bell size={18} color="#4f46e5" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircleBtn}
            onPress={() => navigation.navigate('Analytics')}
          >
            <TrendingUp size={18} color="#059669" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <LogOut size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: screenPadding, paddingBottom: 40 },
        ]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.innerContainer, containerStyle]}>
          {/* 1. Large Student Welcome Hero Banner */}
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.titleWithBadge}>
                  <Text style={[styles.heroGreeting, { fontSize: moderateScale(18) }]}>
                    Welcome back, {user?.fullName || 'John Student'}! 👋
                  </Text>
                  <View style={styles.portalPill}>
                    <Text style={styles.portalPillText}>STUDENT PORTAL</Text>
                  </View>
                </View>

                <Text style={styles.heroEmailSub}>
                  {user?.email || 'john.student@college.edu'} • Live Academic Progression Hub
                </Text>
              </View>
            </View>

            <View style={styles.metaBadgesRow}>
              <View style={styles.metaBadge}>
                <Building2 size={13} color="#4f46e5" />
                <Text style={styles.metaBadgeText}>
                  Dept: <Text style={{ fontWeight: '800', color: '#1e1b4b' }}>{user?.department || 'Computer Science & Engineering'}</Text>
                </Text>
              </View>

              <View style={styles.metaBadge}>
                <BadgeCheck size={13} color="#059669" />
                <Text style={styles.metaBadgeText}>
                  ID: <Text style={{ fontWeight: '800', color: '#064e3b' }}>{user?.studentId || 'STU-2026-999'}</Text>
                </Text>
              </View>
            </View>
          </View>

          {loading ? (
            <View style={styles.centerLoading}>
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text style={styles.loadingText}>Syncing academic progression index...</Text>
            </View>
          ) : (
            <>
              {/* 2. 6 KPI Metric Grid */}
              <View style={styles.kpiGrid}>
                {/* 1. Total Coursework */}
                <View style={[styles.kpiCard, { borderColor: '#e2e8f0', backgroundColor: '#ffffff' }]}>
                  <View style={[styles.kpiIconWrapper, { backgroundColor: '#eef2ff' }]}>
                    <BookOpen size={16} color="#4f46e5" />
                  </View>
                  <Text style={styles.kpiLabel}>Total Coursework</Text>
                  <Text style={[styles.kpiValue, { fontSize: moderateScale(22) }]}>{totalTasks}</Text>
                </View>

                {/* 2. Pending Tasks */}
                <View style={[styles.kpiCard, { borderColor: '#e2e8f0', backgroundColor: '#ffffff' }]}>
                  <View style={[styles.kpiIconWrapper, { backgroundColor: '#fffbeb' }]}>
                    <Clock size={16} color="#d97706" />
                  </View>
                  <Text style={styles.kpiLabel}>Pending Tasks</Text>
                  <Text style={[styles.kpiValue, { color: '#d97706', fontSize: moderateScale(22) }]}>{pendingTasks}</Text>
                </View>

                {/* 3. Submitted */}
                <View style={[styles.kpiCard, { borderColor: '#e2e8f0', backgroundColor: '#ffffff' }]}>
                  <View style={[styles.kpiIconWrapper, { backgroundColor: '#ecfdf5' }]}>
                    <CheckCircle2 size={16} color="#059669" />
                  </View>
                  <Text style={styles.kpiLabel}>Submitted</Text>
                  <Text style={[styles.kpiValue, { color: '#059669', fontSize: moderateScale(22) }]}>{submittedTasks}</Text>
                </View>

                {/* 4. Overdue */}
                <View style={[styles.kpiCard, { borderColor: '#e2e8f0', backgroundColor: '#ffffff' }]}>
                  <View style={[styles.kpiIconWrapper, { backgroundColor: '#fff1f2' }]}>
                    <AlertCircle size={16} color="#e11d48" />
                  </View>
                  <Text style={styles.kpiLabel}>Overdue</Text>
                  <Text style={[styles.kpiValue, { color: '#e11d48', fontSize: moderateScale(22) }]}>{overdueTasks}</Text>
                </View>

                {/* 5. Average Score */}
                <View style={[styles.kpiCard, { borderColor: '#e2e8f0', backgroundColor: '#ffffff' }]}>
                  <View style={[styles.kpiIconWrapper, { backgroundColor: '#fdf4ff' }]}>
                    <TrendingUp size={16} color="#9333ea" />
                  </View>
                  <Text style={styles.kpiLabel}>Average Score</Text>
                  <Text style={[styles.kpiValue, { color: '#9333ea', fontSize: moderateScale(20) }]}>{avgScore}</Text>
                </View>

                {/* 6. Completion Rate */}
                <View style={[styles.kpiCard, { borderColor: '#e2e8f0', backgroundColor: '#ffffff' }]}>
                  <View style={[styles.kpiIconWrapper, { backgroundColor: '#f0f9ff' }]}>
                    <Percent size={16} color="#0284c7" />
                  </View>
                  <Text style={styles.kpiLabel}>Completion Rate</Text>
                  <Text style={[styles.kpiValue, { color: '#0284c7', fontSize: moderateScale(20) }]}>{completionRate}</Text>
                </View>
              </View>

              {/* 3. Multi-color Academic Coursework Progress Bar */}
              <View style={styles.progressCard}>
                <View style={styles.progressTopRow}>
                  <View>
                    <View style={styles.progressTitleRow}>
                      <Sparkles size={16} color="#4f46e5" />
                      <Text style={[styles.progressTitle, { fontSize: moderateScale(15) }]}>
                        Academic Coursework Progress
                      </Text>
                    </View>
                    <Text style={styles.progressSubtitle}>
                      Cumulative submission rate across all enrolled department subjects
                    </Text>
                  </View>
                  <Text style={[styles.progressPercentLarge, { fontSize: moderateScale(16) }]}>
                    {completionRate} <Text style={{ fontSize: 11, color: '#64748b' }}>Completed</Text>
                  </Text>
                </View>

                {/* Segmented Multi-Color Progress Bar */}
                <View style={styles.segmentedProgressBar}>
                  <View style={[styles.barSegment, { width: `${submittedWidth}%`, backgroundColor: '#059669' }]} />
                  <View style={[styles.barSegment, { width: `${pendingWidth}%`, backgroundColor: '#f59e0b' }]} />
                  <View style={[styles.barSegment, { width: `${overdueWidth}%`, backgroundColor: '#ef4444' }]} />
                </View>

                {/* Legend Row */}
                <View style={styles.legendRow}>
                  <View style={styles.legendItems}>
                    <View style={styles.legendItem}>
                      <View style={[styles.dot, { backgroundColor: '#059669' }]} />
                      <Text style={styles.legendText}>Submitted ({submittedTasks})</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.dot, { backgroundColor: '#f59e0b' }]} />
                      <Text style={styles.legendText}>Pending ({pendingTasks})</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
                      <Text style={styles.legendText}>Overdue ({overdueTasks})</Text>
                    </View>
                  </View>
                  <Text style={styles.totalAssignmentsText}>Total: {totalTasks} Assignments</Text>
                </View>
              </View>

              {/* 4. Quick Tools Hub (All 7 Features) */}
              <View style={styles.quickHubCard}>
                <Text style={styles.quickHubSectionTitle}>ACADEMIC PORTAL TOOLS</Text>
                <View style={styles.quickHubGrid}>
                  <TouchableOpacity style={styles.quickTile} onPress={() => navigation.navigate('Assignments')}>
                    <View style={[styles.quickTileIcon, { backgroundColor: '#eef2ff' }]}>
                      <BookOpen size={18} color="#4f46e5" />
                    </View>
                    <Text style={styles.quickTileText}>Assignments</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.quickTile} onPress={() => navigation.navigate('AiAssistant')}>
                    <View style={[styles.quickTileIcon, { backgroundColor: '#fdf4ff' }]}>
                      <Sparkles size={18} color="#9333ea" />
                    </View>
                    <Text style={styles.quickTileText}>AI Assistant</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.quickTile} onPress={() => navigation.navigate('Calendar')}>
                    <View style={[styles.quickTileIcon, { backgroundColor: '#ecfdf5' }]}>
                      <Calendar size={18} color="#059669" />
                    </View>
                    <Text style={styles.quickTileText}>Calendar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.quickTile} onPress={() => navigation.navigate('Analytics')}>
                    <View style={[styles.quickTileIcon, { backgroundColor: '#fffbeb' }]}>
                      <TrendingUp size={18} color="#d97706" />
                    </View>
                    <Text style={styles.quickTileText}>Analytics</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.quickTile} onPress={() => navigation.navigate('Notifications')}>
                    <View style={[styles.quickTileIcon, { backgroundColor: '#fff1f2' }]}>
                      <Bell size={18} color="#e11d48" />
                    </View>
                    <Text style={styles.quickTileText}>Notifications</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.quickTile} onPress={() => navigation.navigate('Profile')}>
                    <View style={[styles.quickTileIcon, { backgroundColor: '#f1f5f9' }]}>
                      <User size={18} color="#475569" />
                    </View>
                    <Text style={styles.quickTileText}>Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 5. Upcoming Assignments Section */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <Calendar size={18} color="#4f46e5" />
                    <Text style={[styles.sectionTitle, { fontSize: moderateScale(15) }]}>
                      Upcoming Assignments
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('Assignments')}>
                    <Text style={styles.seeAllText}>View All</Text>
                  </TouchableOpacity>
                </View>

                {demoAssignments.map((item, idx) => (
                  <View key={item._id || idx} style={styles.assignmentItem}>
                    <View style={styles.assignmentHeader}>
                      <View style={styles.subjectTag}>
                        <Text style={styles.subjectTagText}>{item.subject?.name || 'Computer Science'}</Text>
                      </View>
                      <View style={styles.dueBadge}>
                        <Clock size={11} color="#4f46e5" />
                        <Text style={styles.dueText}>
                          {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'Due Soon'}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.assignmentTitle, { fontSize: moderateScale(14) }]}>
                      {item.title}
                    </Text>

                    <View style={styles.assignmentFooter}>
                      <Text style={styles.pointsBadgeText}>{item.maxPoints || 100} Points</Text>
                      <View
                        style={[
                          styles.statusPill,
                          item.status === 'submitted' ? styles.statusSubmitted : styles.statusPending,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusPillText,
                            item.status === 'submitted' ? { color: '#059669' } : { color: '#d97706' },
                          ]}
                        >
                          {item.status === 'submitted' ? 'Submitted' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
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
  topBrandBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  topBrandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginRight: 4,
  },
  topAppLogo: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBrandTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  topBrandSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6366f1',
    letterSpacing: 0.5,
  },
  topBrandRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 16,
  },
  innerContainer: {
    width: '100%',
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  heroTopRow: {
    marginBottom: 12,
  },
  titleWithBadge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  heroGreeting: {
    fontWeight: '900',
    color: '#0f172a',
  },
  portalPill: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  portalPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4338ca',
    letterSpacing: 0.5,
  },
  heroEmailSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  metaBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metaBadgeText: {
    fontSize: 11,
    color: '#475569',
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
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  kpiCard: {
    width: '31%',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  kpiIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 2,
  },
  kpiValue: {
    fontWeight: '900',
    color: '#0f172a',
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  progressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressTitle: {
    fontWeight: '800',
    color: '#0f172a',
  },
  progressSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    maxWidth: '90%',
  },
  progressPercentLarge: {
    fontWeight: '900',
    color: '#4f46e5',
  },
  segmentedProgressBar: {
    height: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 10,
  },
  barSegment: {
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  legendItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
  totalAssignmentsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  quickHubCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  quickHubSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  quickHubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickTile: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  quickTileIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickTileText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
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
    fontWeight: '800',
    color: '#0f172a',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4f46e5',
  },
  assignmentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectTag: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subjectTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4f46e5',
  },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  assignmentTitle: {
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  assignmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPending: {
    backgroundColor: '#fffbeb',
  },
  statusSubmitted: {
    backgroundColor: '#ecfdf5',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
});
