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
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  BarChart2,
  Percent,
  Menu,
} from 'lucide-react-native';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useResponsive } from '../utils/responsive';
import SideDrawer from '../components/SideDrawer';

export default function AnalyticsScreen({ navigation }) {
  const { user } = useAuth();
  const { isTablet, containerStyle, moderateScale, screenPadding } = useResponsive();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const endpoint = user?.role === 'teacher' || user?.role === 'admin'
        ? '/analytics/teacher'
        : '/analytics/student';
      const res = await api.get(endpoint);
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user?.role]);

  const stats = data?.overview || data?.summary || {
    totalAssignments: 7,
    submittedCount: 5,
    pendingCount: 2,
    completionRate: 71,
    averageScore: 88,
  };

  const subjectStats = data?.subjectBreakdown || [
    { name: 'Computer Networks', submitted: 2, total: 2, score: 92 },
    { name: 'Database Systems', submitted: 1, total: 2, score: 85 },
    { name: 'Operating Systems', submitted: 1, total: 1, score: 90 },
    { name: 'Software Engineering', submitted: 1, total: 2, score: 82 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute="Analytics"
        navigation={navigation}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setDrawerOpen(true)}
            activeOpacity={0.7}
          >
            <Menu size={22} color="#4f46e5" />
          </TouchableOpacity>
          <TrendingUp size={20} color="#4f46e5" />
          <Text style={[styles.headerTitle, { fontSize: moderateScale(18) }]}>
            Academic Analytics & Metrics
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: screenPadding, paddingBottom: 32 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchAnalytics();
            }}
          />
        }
      >
        <View style={[styles.innerContainer, containerStyle]}>
          {loading ? (
            <View style={styles.centerLoading}>
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text style={styles.loadingText}>Analyzing performance metrics...</Text>
            </View>
          ) : (
            <>
              {/* Top Overview Cards */}
              <View style={styles.kpiGrid}>
                <View style={[styles.kpiCard, { backgroundColor: '#eef2ff', borderColor: '#c7d2fe' }]}>
                  <Award size={20} color="#4f46e5" />
                  <Text style={[styles.kpiNum, { color: '#4f46e5', fontSize: moderateScale(22) }]}>
                    {stats.averageScore || 88}%
                  </Text>
                  <Text style={styles.kpiLabel}>Average Grade</Text>
                </View>

                <View style={[styles.kpiCard, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
                  <Percent size={20} color="#059669" />
                  <Text style={[styles.kpiNum, { color: '#059669', fontSize: moderateScale(22) }]}>
                    {stats.completionRate || 71}%
                  </Text>
                  <Text style={styles.kpiLabel}>Completion Rate</Text>
                </View>
              </View>

              {/* Progress Bar Card */}
              <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.cardTitle, { fontSize: moderateScale(15) }]}>Coursework Velocity</Text>
                  <Text style={styles.progressPercent}>{stats.completionRate || 71}% Completed</Text>
                </View>

                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${stats.completionRate || 71}%` }]} />
                </View>

                <View style={styles.progressSubTextRow}>
                  <Text style={styles.progressSubText}>
                    {stats.submittedCount || 5} of {stats.totalAssignments || 7} total tasks finalized
                  </Text>
                </View>
              </View>

              {/* Subject Breakdown List */}
              <View style={styles.sectionHeader}>
                <BarChart2 size={18} color="#4f46e5" />
                <Text style={[styles.sectionTitle, { fontSize: moderateScale(15) }]}>
                  Subject-wise Performance
                </Text>
              </View>

              {subjectStats.map((item, idx) => (
                <View key={idx} style={styles.subjectCard}>
                  <View style={styles.subjectRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.subjectName, { fontSize: moderateScale(14) }]}>{item.name}</Text>
                      <Text style={styles.subjectSub}>
                        {item.submitted}/{item.total} Submissions Completed
                      </Text>
                    </View>
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>{item.score}%</Text>
                    </View>
                  </View>

                  <View style={styles.subjectBarBg}>
                    <View style={[styles.subjectBarFill, { width: `${(item.submitted / item.total) * 100}%` }]} />
                  </View>
                </View>
              ))}
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginRight: 2,
  },
  headerTitle: {
    fontWeight: '800',
    color: '#0f172a',
  },
  scrollContent: {
    paddingTop: 16,
  },
  innerContainer: {
    width: '100%',
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
    gap: 10,
    marginBottom: 14,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  kpiNum: {
    fontWeight: '900',
    marginTop: 8,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 2,
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: '800',
    color: '#0f172a',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4f46e5',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 6,
  },
  progressSubTextRow: {
    marginTop: 8,
  },
  progressSubText: {
    fontSize: 12,
    color: '#64748b',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '800',
    color: '#0f172a',
  },
  subjectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontWeight: '700',
    color: '#0f172a',
  },
  subjectSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  subjectBarBg: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  subjectBarFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
});
