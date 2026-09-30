import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Bell,
  TrendingUp,
  Sparkles,
  User,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.78, 320);

export default function SideDrawer({ visible, onClose, activeRoute = 'Dashboard', navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', route: 'Dashboard', icon: LayoutDashboard },
    { name: 'Assignments', route: 'Assignments', icon: BookOpen },
    { name: 'Calendar', route: 'Calendar', icon: Calendar },
    { name: 'Notifications', route: 'Notifications', icon: Bell },
    { name: 'Analytics', route: 'Analytics', icon: TrendingUp },
    { name: 'AI Assistant', route: 'AiAssistant', icon: Sparkles },
    { name: 'Profile', route: 'Profile', icon: User },
  ];

  const handleNavigate = (route) => {
    onClose();
    if (navigation && route) {
      navigation.navigate(route);
    }
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.drawerContainer,
            {
              width: DRAWER_WIDTH,
              paddingTop: Math.max(insets.top, 16),
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          {/* 1. Header with Logo & Brand */}
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <GraduationCap size={22} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.brandName}>Smart Tracker</Text>
                <Text style={styles.portalTag}>
                  {user?.role?.toUpperCase() || 'STUDENT'} PORTAL
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* 2. User Info Profile Card */}
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.fullName?.charAt(0) || 'J'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.fullName || 'John Student'}
              </Text>
              <Text style={styles.userRoleText} numberOfLines={1}>
                {user?.role === 'teacher' ? 'Faculty' : user?.role === 'admin' ? 'Admin' : 'Student'} • {user?.department?.split(' ')[0] || 'CSE'}
              </Text>
            </View>
          </View>

          {/* 3. Navigation Items List */}
          <ScrollView
            style={styles.navScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.navScrollContent}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.route;

              return (
                <TouchableOpacity
                  key={item.route}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  onPress={() => handleNavigate(item.route)}
                  activeOpacity={0.7}
                >
                  <Icon
                    size={20}
                    color={isActive ? '#ffffff' : '#64748b'}
                    style={styles.navIcon}
                  />
                  <Text style={[styles.navItemText, isActive && styles.navItemTextActive]}>
                    {item.name}
                  </Text>
                  {isActive ? (
                    <View style={styles.activeDot} />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* 4. Footer Section */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <LogOut size={18} color="#ef4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Smart Assignment Tracker v1.0</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  drawerContainer: {
    height: '100%',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginTop: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  portalTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6366f1',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginVertical: 14,
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4f46e5',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  userRoleText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  navScrollView: {
    flex: 1,
  },
  navScrollContent: {
    gap: 6,
    paddingVertical: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  navItemActive: {
    backgroundColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  navIcon: {
    marginRight: 12,
  },
  navItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    flex: 1,
  },
  navItemTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
    gap: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ef4444',
  },
  versionText: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
