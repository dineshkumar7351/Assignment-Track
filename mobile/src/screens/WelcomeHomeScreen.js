import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Shield,
  ArrowRight,
  UserCheck,
  TrendingUp,
  BrainCircuit,
  LogIn,
  UserPlus,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useResponsive } from '../utils/responsive';

export default function WelcomeHomeScreen({ navigation }) {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const { isTablet, isSmallDevice, containerStyle, moderateScale } = useResponsive();

  const handleQuickDemo = async (email, pass) => {
    await login(email, pass);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.innerContainer, containerStyle]}>
          {/* Header Brand */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <GraduationCap color="#ffffff" size={moderateScale(32)} />
            </View>
            <Text style={[styles.appName, { fontSize: moderateScale(24) }]}>
              Smart Assignment Tracker
            </Text>
            <View style={styles.pillBadge}>
              <Sparkles size={12} color="#4f46e5" />
              <Text style={styles.pillText}>NEXT-GEN ACADEMIC PLATFORM</Text>
            </View>
            <Text style={[styles.heroSubtitle, { fontSize: moderateScale(14) }]}>
              Unified academic workflow with AI-powered submission evaluation, similarity detection, and real-time student-faculty sync.
            </Text>
          </View>

          {/* Core Feature Highlights */}
          <View style={styles.featuresSection}>
            <View style={[styles.featureCard, { backgroundColor: '#eef2ff', borderColor: '#c7d2fe' }]}>
              <View style={[styles.iconCircle, { backgroundColor: '#4f46e5' }]}>
                <BookOpen size={18} color="#ffffff" />
              </View>
              <View style={styles.featureTextCol}>
                <Text style={[styles.featureTitle, { color: '#312e81' }]}>Coursework & Tracking</Text>
                <Text style={styles.featureDesc}>
                  Stay on top of deadlines, view tasks, and submit lab reports directly from your mobile.
                </Text>
              </View>
            </View>

            <View style={[styles.featureCard, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
              <View style={[styles.iconCircle, { backgroundColor: '#059669' }]}>
                <BrainCircuit size={18} color="#ffffff" />
              </View>
              <View style={styles.featureTextCol}>
                <Text style={[styles.featureTitle, { color: '#064e3b' }]}>AI Evaluation & Similarity</Text>
                <Text style={styles.featureDesc}>
                  Automatic plagiarism checks and smart semantic rubric grading powered by AI.
                </Text>
              </View>
            </View>

            <View style={[styles.featureCard, { backgroundColor: '#fff1f2', borderColor: '#fecdd3' }]}>
              <View style={[styles.iconCircle, { backgroundColor: '#e11d48' }]}>
                <TrendingUp size={18} color="#ffffff" />
              </View>
              <View style={styles.featureTextCol}>
                <Text style={[styles.featureTitle, { color: '#881337' }]}>Real-time Analytics</Text>
                <Text style={styles.featureDesc}>
                  Instant performance metrics, class grade distributions, and pending task alerts.
                </Text>
              </View>
            </View>
          </View>

          {/* Primary Navigation Actions */}
          <View style={styles.authActionsCard}>
            <Text style={[styles.actionCardTitle, { fontSize: moderateScale(17) }]}>
              Get Started
            </Text>
            <Text style={styles.actionCardSub}>
              Access your college workspace or create a new student/faculty profile.
            </Text>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.85}
            >
              <View style={styles.btnContent}>
                <LogIn size={18} color="#ffffff" />
                <Text style={styles.primaryBtnText}>Sign In to Account</Text>
              </View>
              <ArrowRight size={18} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.85}
            >
              <View style={styles.btnContent}>
                <UserPlus size={18} color="#4f46e5" />
                <Text style={styles.secondaryBtnText}>Create New Account</Text>
              </View>
              <ArrowRight size={18} color="#4f46e5" />
            </TouchableOpacity>

            {/* Instant Demo Login Buttons */}
            <View style={styles.demoSection}>
              <View style={styles.demoHeader}>
                <Sparkles size={14} color="#d97706" />
                <Text style={styles.demoHeaderText}>OR 1-CLICK INSTANT DEMO EXPLORE</Text>
              </View>

              <View style={styles.demoRow}>
                <TouchableOpacity
                  style={[styles.demoPill, { backgroundColor: '#eef2ff', borderColor: '#c7d2fe' }]}
                  onPress={() => handleQuickDemo('john.student@college.edu', 'Password@123')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.demoEmoji}>🎓</Text>
                  <Text style={[styles.demoRoleText, { color: '#4338ca' }]}>Student</Text>
                  <Text style={styles.demoSubText}>John</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoPill, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}
                  onPress={() => handleQuickDemo('sarah.teacher@college.edu', 'Password@123')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.demoEmoji}>👨‍🏫</Text>
                  <Text style={[styles.demoRoleText, { color: '#047857' }]}>Teacher</Text>
                  <Text style={styles.demoSubText}>Dr. Sarah</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoPill, { backgroundColor: '#fff1f2', borderColor: '#fecdd3' }]}
                  onPress={() => handleQuickDemo('admin@college.edu', 'Admin@123456')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.demoEmoji}>🛡️</Text>
                  <Text style={[styles.demoRoleText, { color: '#be123c' }]}>Admin</Text>
                  <Text style={styles.demoSubText}>Campus</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  innerContainer: {
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 12,
  },
  appName: {
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    marginBottom: 8,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4338ca',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 2,
    paddingHorizontal: 8,
  },
  featuresSection: {
    gap: 10,
    marginBottom: 20,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  authActionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  actionCardTitle: {
    fontWeight: '800',
    color: '#0f172a',
  },
  actionCardSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 10,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 16,
  },
  secondaryBtnText: {
    color: '#4f46e5',
    fontSize: 15,
    fontWeight: '700',
  },
  demoSection: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 14,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 10,
  },
  demoHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  demoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  demoPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  demoEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  demoRoleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  demoSubText: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 1,
  },
});
