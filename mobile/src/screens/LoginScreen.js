import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GraduationCap, Mail, Lock, LogIn, Sparkles } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useResponsive } from '../utils/responsive';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { isTablet, isSmallDevice, containerStyle, moderateScale } = useResponsive();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (loginEmail = email, loginPass = password) => {
    if (!loginEmail.trim() || !loginPass) {
      setError('Please provide both email and password');
      return;
    }

    setError('');
    setLoading(true);
    const res = await login(loginEmail.trim(), loginPass);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
    }
  };

  const handleDemoLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    handleLogin(demoEmail, demoPass);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: isSmallDevice ? 12 : isTablet ? 32 : 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.innerContainer, containerStyle]}>
            {/* Header */}
            <View style={styles.header}>
              <View
                style={[
                  styles.logoIcon,
                  {
                    width: moderateScale(56),
                    height: moderateScale(56),
                    borderRadius: moderateScale(16),
                  },
                ]}
              >
                <GraduationCap color="#ffffff" size={moderateScale(30)} />
              </View>
              <Text style={[styles.appName, { fontSize: moderateScale(22) }]}>
                Smart Assignment Tracker
              </Text>
              <Text style={[styles.tagline, { fontSize: moderateScale(12) }]}>
                Mobile Academic Management
              </Text>
            </View>

            {/* Form Card */}
            <View
              style={[
                styles.card,
                { padding: isSmallDevice ? 16 : isTablet ? 32 : 22 },
              ]}
            >
              <Text style={[styles.cardTitle, { fontSize: moderateScale(19) }]}>Sign In</Text>
              <Text style={[styles.cardSubtitle, { fontSize: moderateScale(13) }]}>
                Access your student, faculty, or admin portal
              </Text>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="alex@college.edu"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError('');
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError('');
                    }}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={() => handleLogin()}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <View style={styles.buttonInner}>
                    <LogIn size={18} color="#ffffff" />
                    <Text style={styles.buttonText}>Sign In</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Quick 1-Click Demo Login */}
              <View style={styles.demoSection}>
                <View style={styles.demoBadge}>
                  <Sparkles size={14} color="#f59e0b" />
                  <Text style={styles.demoBadgeText}>1-CLICK INSTANT DEMO LOGIN</Text>
                </View>

                <View style={styles.demoButtonsRow}>
                  <TouchableOpacity
                    style={[styles.demoBtn, { borderColor: '#c7d2fe', backgroundColor: '#eef2ff' }]}
                    onPress={() => handleDemoLogin('john.student@college.edu', 'Password@123')}
                  >
                    <Text style={styles.demoEmoji}>🎓</Text>
                    <Text style={[styles.demoRole, { color: '#4338ca' }]}>Student</Text>
                    <Text style={styles.demoName}>John</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.demoBtn, { borderColor: '#a7f3d0', backgroundColor: '#ecfdf5' }]}
                    onPress={() => handleDemoLogin('sarah.teacher@college.edu', 'Password@123')}
                  >
                    <Text style={styles.demoEmoji}>👨‍🏫</Text>
                    <Text style={[styles.demoRole, { color: '#047857' }]}>Teacher</Text>
                    <Text style={styles.demoName}>Dr. Sarah</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.demoBtn, { borderColor: '#fecdd3', backgroundColor: '#fff1f2' }]}
                    onPress={() => handleDemoLogin('admin@college.edu', 'Admin@123456')}
                  >
                    <Text style={styles.demoEmoji}>🛡️</Text>
                    <Text style={[styles.demoRole, { color: '#be123c' }]}>Admin</Text>
                    <Text style={styles.demoName}>Campus</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.switchAuth}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.switchAuthText}>
                  Don't have an account? <Text style={styles.switchAuthLink}>Register</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingVertical: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  appName: {
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  tagline: {
    fontWeight: '600',
    color: '#6366f1',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: '700',
    color: '#0f172a',
  },
  cardSubtitle: {
    color: '#64748b',
    marginTop: 4,
    marginBottom: 18,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 46,
    fontSize: 14,
    color: '#0f172a',
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  demoSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 10,
  },
  demoBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  demoEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  demoRole: {
    fontSize: 11,
    fontWeight: '700',
  },
  demoName: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 1,
  },
  switchAuth: {
    marginTop: 18,
    alignItems: 'center',
  },
  switchAuthText: {
    fontSize: 13,
    color: '#64748b',
  },
  switchAuthLink: {
    color: '#4f46e5',
    fontWeight: '700',
  },
});

