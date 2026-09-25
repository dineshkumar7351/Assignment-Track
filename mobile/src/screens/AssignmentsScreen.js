import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Clock, Calendar, CheckCircle2, ChevronRight } from 'lucide-react-native';
import api from '../config/api';
import { useResponsive } from '../utils/responsive';

export default function AssignmentsScreen({ navigation }) {
  const { isTablet, padding, containerStyle, ms } = useResponsive();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/assignments');
      if (res.data?.success) {
        setAssignments(res.data.data.assignments || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch assignments', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAssignments();
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { padding: isTablet ? 20 : 16 }]}>
      <View style={styles.cardHeader}>
        <View style={styles.subjectBadge}>
          <Text style={[styles.subjectText, { fontSize: ms(11) }]}>{item.subject?.name || item.course || 'Course'}</Text>
        </View>
        <View style={styles.dateBadge}>
          <Clock size={ms(12)} color="#64748b" />
          <Text style={[styles.dateText, { fontSize: ms(11) }]}>
            {new Date(item.dueDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <Text style={[styles.title, { fontSize: ms(15) }]}>{item.title}</Text>
      <Text style={[styles.description, { fontSize: ms(13) }]} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.pointsBadge}>
          <Text style={[styles.pointsText, { fontSize: ms(11) }]}>{item.maxPoints || 100} Points</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { fontSize: ms(11) }]}>{item.status || 'Active'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { paddingHorizontal: padding }]}>
        <View style={containerStyle}>
          <Text style={[styles.headerTitle, { fontSize: ms(18) }]}>Coursework & Tasks</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : (
        <View style={[{ flex: 1 }, containerStyle]}>
          <FlatList
            data={assignments}
            keyExtractor={(item, index) => item._id || String(index)}
            renderItem={renderItem}
            contentContainerStyle={[styles.listContent, { padding: padding }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <BookOpen size={ms(40)} color="#94a3b8" />
                <Text style={[styles.emptyTitle, { fontSize: ms(14) }]}>No assignments available</Text>
              </View>
            }
          />
        </View>
      )}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4f46e5',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  pointsBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 12,
  },
});
