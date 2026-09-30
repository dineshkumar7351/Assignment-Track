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
  Bell,
  CheckCheck,
  Clock,
  BookOpen,
  Award,
  AlertTriangle,
  Sparkles,
  Menu,
} from 'lucide-react-native';
import api from '../config/api';
import { useResponsive } from '../utils/responsive';
import SideDrawer from '../components/SideDrawer';

export default function NotificationsScreen({ navigation }) {
  const { containerStyle, moderateScale, screenPadding } = useResponsive();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications?limit=50');
      if (res.data?.success) {
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark notifications read', err);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute="Notifications"
        navigation={navigation}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setDrawerOpen(true)}
            activeOpacity={0.7}
          >
            <Menu size={22} color="#4f46e5" />
          </TouchableOpacity>
          <Bell size={20} color="#4f46e5" />
          <Text style={[styles.headerTitle, { fontSize: moderateScale(18) }]}>Notifications</Text>
          {unreadCount > 0 ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCountText}>{unreadCount}</Text>
            </View>
          ) : null}
        </View>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markReadBtn}>
            <CheckCheck size={16} color="#4f46e5" />
            <Text style={styles.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        ) : null}
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
              fetchNotifications();
            }}
          />
        }
      >
        <View style={[styles.innerContainer, containerStyle]}>
          {loading ? (
            <View style={styles.centerLoading}>
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text style={styles.loadingText}>Loading notifications...</Text>
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.emptyCard}>
              <Bell size={38} color="#94a3b8" />
              <Text style={styles.emptyTitle}>All Caught Up!</Text>
              <Text style={styles.emptySub}>You have no new alerts or assignment notifications.</Text>
            </View>
          ) : (
            notifications.map((item, idx) => (
              <View
                key={item._id || idx}
                style={[
                  styles.notificationCard,
                  !item.isRead && styles.unreadCardBorder,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.typeBadge}>
                    <BookOpen size={13} color="#4f46e5" />
                    <Text style={styles.typeText}>{item.type?.toUpperCase() || 'ANNOUNCEMENT'}</Text>
                  </View>
                  <View style={styles.timeBadge}>
                    <Clock size={11} color="#64748b" />
                    <Text style={styles.timeText}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.itemTitle, { fontSize: moderateScale(14) }]}>{item.title}</Text>
                <Text style={styles.itemMessage}>{item.message}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  unreadBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadCountText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4f46e5',
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
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 20,
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
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  unreadCardBorder: {
    borderColor: '#c7d2fe',
    backgroundColor: '#fbfcfe',
    borderLeftWidth: 4,
    borderLeftColor: '#4f46e5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eef2ff',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4f46e5',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timeText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  itemTitle: {
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  itemMessage: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
  },
});
