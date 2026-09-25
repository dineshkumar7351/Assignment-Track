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
import { GraduationCap, User, Mail, Lock, Building2, BadgeCheck, UserPlus } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useResponsive } from '../utils/responsive';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const { isTablet, isSmallDevice, containerStyle, moderateScale } = useResponsive();

  const [role, setRole] = useState('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [studentId, setStudentId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      role,
      department,
      ...(role === 'student' ? { studentId: studentId.trim() } : { employeeId: employeeId.trim() }),
    };

    const res = await register(payload);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
    }
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
                    width: moderateScale(50),
                    height: moderateScale(50),
                    borderRadius: moderateScale(14),
                  },
                ]}
              >
                <GraduationCap color="#ffffff" size={moderateScale(26)} />
              </View>
              <Text style={[styles.appName, { fontSize: moderateScale(20) }]}>Create Account</Text>
              <Text style={[styles.tagline, { fontSize: moderateScale(12) }]}>Smart Assignment Tracker</Text>
            </View>

            {/* Form Card */}
            <View
              style={[
                styles.card,
                { padding: isSmallDevice ? 16 : isTablet ? 30 : 20 },
              ]}
            >
              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Role Switcher */}
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[styles.roleBtn, role === 'student' && styles.roleBtnActiveStudent]}
                  onPress={() => setRole('student')}
                >
                  <Text style={[styles.roleText, role === 'student' && styles.roleTextActive]}>
                    🎓 Student
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleBtn, role === 'teacher' && styles.roleBtnActiveTeacher]}
                  onPress={() => setRole('teacher')}
                >
                  <Text style={[styles.roleText, role === 'teacher' && styles.roleTextActive]}>
                    👨‍🏫 Teacher
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <User size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={role === 'student' ? 'e.g. Alex Johnson' : 'e.g. Dr. Robert Miller'}
                    placeholderTextColor="#94a3b8"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Academic Email</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={role === 'student' ? 'student@college.edu' : 'faculty@college.edu'}
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Department</Text>
                <View style={styles.inputWrapper}>
                  <Building2 size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={department}
                    onChangeText={setDepartment}
                    placeholder="Department Name"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>

              {role === 'student' ? (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Student ID</Text>
                  <View style={styles.inputWrapper}>
                    <BadgeCheck size={18} color="#64748b" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="STU-2026-001"
                      placeholderTextColor="#94a3b8"
                      value={studentId}
                      onChangeText={setStudentId}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Employee ID</Text>
                  <View style={styles.inputWrapper}>
                    <BadgeCheck size={18} color="#64748b" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="FAC-2026-001"
                      placeholderTextColor="#94a3b8"
                      value={employeeId}
                      onChangeText={setEmployeeId}
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Minimum 6 characters"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Re-enter password"
                    placeholderTextColor="#94a3b8"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <View style={styles.buttonInner}>
                    <UserPlus size={18} color="#ffffff" />
                    <Text style={styles.buttonText}>Register {role === 'student' ? 'Student' : 'Faculty'}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchAuth}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.switchAuthText}>
                  Already have an account? <Text style={styles.switchAuthLink}>Sign In</Text>
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
    paddingVertical: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  appName: {
    fontWeight: '800',
    color: '#0f172a',
  },
  tagline: {
    fontWeight: '600',
    color: '#6366f1',
    marginTop: 2,
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
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },
  roleBtnActiveStudent: {
    backgroundColor: '#4f46e5',
  },
  roleBtnActiveTeacher: {
    backgroundColor: '#059669',
  },
  roleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  roleTextActive: {
    color: '#ffffff',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
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
    height: 44,
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
  switchAuth: {
    marginTop: 16,
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

