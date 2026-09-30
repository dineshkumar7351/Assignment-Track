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
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react-native';
import api from '../config/api';
import { useResponsive } from '../utils/responsive';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarScreen({ navigation }) {
  const { isTablet, containerStyle, moderateScale, screenPadding } = useResponsive();
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCalendar = async () => {
    try {
      const res = await api.get(`/calendar/events?month=${currentMonth}&year=${currentYear}`);
      if (res.data?.success) {
        const eventsData = res.data.data?.eventsByDate || res.data.data || {};
        const flatList = [];
        if (typeof eventsData === 'object' && !Array.isArray(eventsData)) {
          Object.keys(eventsData).forEach((dateKey) => {
            eventsData[dateKey].forEach((ev) => flatList.push({ ...ev, dateKey }));
          });
        } else if (Array.isArray(eventsData)) {
          flatList.push(...eventsData);
        }
        setEvents(flatList);
      }
    } catch (err) {
      console.error('Failed to load calendar events', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <CalendarIcon size={22} color="#4f46e5" />
          <Text style={[styles.headerTitle, { fontSize: moderateScale(18) }]}>Academic Calendar</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: screenPadding, paddingBottom: 32 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCalendar(); }} />}
      >
        <View style={[styles.innerContainer, containerStyle]}>
          {/* Month Controller Card */}
          <View style={styles.monthCard}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.monthArrow}>
              <ChevronLeft size={20} color="#0f172a" />
            </TouchableOpacity>

            <View style={styles.monthTitleWrapper}>
              <Text style={[styles.monthText, { fontSize: moderateScale(16) }]}>
                {MONTH_NAMES[currentMonth - 1]} {currentYear}
              </Text>
              <Text style={styles.monthSubtitle}>Assignments & Schedule</Text>
            </View>

            <TouchableOpacity onPress={handleNextMonth} style={styles.monthArrow}>
              <ChevronRight size={20} color="#0f172a" />
            </TouchableOpacity>
          </View>

          {/* Events List */}
          <View style={styles.sectionHeader}>
            <Clock size={16} color="#4f46e5" />
            <Text style={[styles.sectionTitle, { fontSize: moderateScale(15) }]}>Scheduled Deadlines</Text>
          </View>

          {loading ? (
            <View style={styles.centerLoading}>
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text style={styles.loadingText}>Loading calendar schedule...</Text>
            </View>
          ) : events.length === 0 ? (
            <View style={styles.emptyCard}>
              <Sparkles size={36} color="#94a3b8" />
              <Text style={styles.emptyTitle}>No Deadlines for this month</Text>
              <Text style={styles.emptySub}>All assignments are caught up or scheduled for other months.</Text>
            </View>
          ) : (
            events.map((item, idx) => (
              <View key={item._id || idx} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <View style={styles.badgeRow}>
                    <View style={styles.subjectBadge}>
                      <Text style={styles.subjectText}>{item.subject?.name || item.course || 'Course'}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{item.status || 'Active'}</Text>
                    </View>
                  </View>
                  <View style={styles.dateBadge}>
                    <Clock size={12} color="#4f46e5" />
                    <Text style={styles.dateText}>
                      {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'Due Soon'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.eventTitle, { fontSize: moderateScale(15) }]}>{item.title}</Text>
                {item.description ? (
                  <Text style={styles.eventDesc} numberOfLines={2}>{item.description}</Text>
                ) : null}

                <View style={styles.eventFooter}>
                  <Text style={styles.pointsText}>{item.maxPoints || 100} Maximum Points</Text>
                </View>
              </View>
            ))
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
  monthCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  monthArrow: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  monthTitleWrapper: {
    alignItems: 'center',
  },
  monthText: {
    fontWeight: '800',
    color: '#0f172a',
  },
  monthSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
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
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  subjectBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subjectText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4f46e5',
  },
  statusBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4f46e5',
  },
  eventTitle: {
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  eventDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  eventFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
});
