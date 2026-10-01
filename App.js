import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Alert,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const API_BASE_URL = Platform.select({
  web: 'http://localhost:5000',
  android: 'http://10.0.2.2:5000',
  default: 'http://10.20.18.83:5000',
});

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'School of Management & Business',
  'Department of Mathematics & Computing',
];

const INITIAL_ASSIGNMENTS = [
  {
    id: '1',
    title: 'RSA Cryptosystem & Modular Inverse Lab',
    subject: 'Network Security',
    code: 'CS-401',
    instructor: 'Dr. Evelyn Vance',
    dueText: 'Tomorrow at 11:59 PM',
    dueDate: 'Oct 02, 2026',
    hoursLeft: 26,
    urgent: true,
    points: 100,
    status: 'pending', // 'pending' | 'submitted' | 'graded'
    category: 'Lab Report',
    similarity: '0% (Clean)',
    accentColor: '#ef4444',
    description: 'Implement RSA keygen, extended Euclidean modular inverse, encryption & decryption in Python or C++.',
    submission: null,
  },
  {
    id: '2',
    title: 'Hospital Patient Schema Normalization (3NF/BCNF)',
    subject: 'Database Systems',
    code: 'CS-302',
    instructor: 'Prof. Marcus Brody',
    dueText: 'Oct 04, 2026 at 5:00 PM',
    dueDate: 'Oct 04, 2026',
    hoursLeft: 72,
    urgent: false,
    points: 50,
    status: 'submitted',
    category: 'Problem Set',
    similarity: '3% (Clean)',
    accentColor: '#3b82f6',
    description: 'Decompose unnormalized hospital patient records into Boyce-Codd Normal Form with functional dependency proofs.',
    submission: {
      url: 'https://github.com/alex-johnson/db-normalization',
      note: 'Normalized schema up to BCNF with DDL scripts.',
      submittedAt: 'Sep 29, 2026',
      studentName: 'Alex Johnson',
    },
  },
  {
    id: '3',
    title: 'Self-Balancing AVL Trees & Rotation Proofs',
    subject: 'Data Structures & Algorithms',
    code: 'CS-201',
    instructor: 'Dr. Sarah Lin',
    dueText: 'Oct 08, 2026 at 11:59 PM',
    dueDate: 'Oct 08, 2026',
    hoursLeft: 168,
    urgent: false,
    points: 100,
    earnedPoints: 96,
    status: 'graded',
    gradeLetter: 'A',
    feedback: 'Outstanding tree rotation benchmark analysis and clean recursive balance factor tracking.',
    category: 'Programming Lab',
    similarity: '1% (Clean)',
    accentColor: '#10b981',
    description: 'Benchmark AVL tree insertion/deletion vs standard Binary Search Trees with asymptotic height proofs.',
    submission: {
      url: 'https://github.com/alex-johnson/avl-benchmarks',
      note: 'Added benchmark plot comparisons.',
      submittedAt: 'Sep 24, 2026',
      studentName: 'Alex Johnson',
    },
  },
  {
    id: '4',
    title: 'CPU Scheduling & Preemptive Round Robin',
    subject: 'Operating Systems',
    code: 'CS-301',
    instructor: 'Prof. David Chen',
    dueText: 'Oct 12, 2026 at 11:59 PM',
    dueDate: 'Oct 12, 2026',
    hoursLeft: 264,
    urgent: false,
    points: 75,
    status: 'pending',
    category: 'Project Milestone',
    similarity: '0% (Clean)',
    accentColor: '#8b5cf6',
    description: 'Simulate preemptive Priority and Round Robin scheduling algorithms, calculating average turnaround and waiting times.',
    submission: null,
  },
];

const SCHEDULE_DATA = [
  { day: 'Mon', date: '28', events: [{ time: '09:00 AM', course: 'CS-201', room: 'Hall B-12', title: 'Data Structures Lecture' }, { time: '02:00 PM', course: 'CS-201 Lab', room: 'Lab 4', title: 'Tree Rotations Practicum' }] },
  { day: 'Tue', date: '29', events: [{ time: '11:00 AM', course: 'CS-302', room: 'Hall A-04', title: 'Database Systems Theory' }] },
  { day: 'Wed', date: '30', events: [{ time: '10:00 AM', course: 'CS-401', room: 'Hall C-08', title: 'Network Security Principles' }, { time: '03:00 PM', course: 'CS-301', room: 'Lab 2', title: 'OS Scheduling Lab' }] },
  { day: 'Thu', date: '01', events: [{ time: '09:30 AM', course: 'CS-302', room: 'Hall A-04', title: 'SQL & BCNF Review' }, { time: '01:30 PM', course: 'CS-401 Lab', room: 'Lab 1', title: 'RSA Cryptography Lab' }] },
  { day: 'Fri', date: '02', events: [{ time: '11:00 AM', course: 'CS-201', room: 'Hall B-12', title: 'Graph Algorithms' }, { time: '11:59 PM', course: 'DEADLINE', room: 'Online Portal', title: 'RSA Lab Submission Due' }] },
  { day: 'Sat', date: '03', events: [{ time: '10:00 AM', course: 'Study Pod', room: 'Library Pod 3', title: 'OS Milestone Prep' }] },
  { day: 'Sun', date: '04', events: [{ time: '05:00 PM', course: 'DEADLINE', room: 'Online Portal', title: 'Database 3NF Assignment Due' }] },
];

const NOTIFICATIONS = [
  { id: '1', title: 'Grade Published for AVL Lab', desc: 'Dr. Sarah Lin graded your AVL Lab: 96/100 (A).', time: '2 hours ago', icon: '📝', unread: true },
  { id: '2', title: 'Urgent: RSA Lab Deadline', desc: 'Network Security lab report is due tomorrow at 11:59 PM.', time: '4 hours ago', icon: '⏰', unread: true },
  { id: '3', title: 'Database Schema Submitted', desc: 'Submission received for Hospital Patient Schema Normalization.', time: '2 days ago', icon: '✅', unread: false },
  { id: '4', title: 'New Course Material Added', desc: 'Prof. David Chen uploaded CPU Scheduling simulation slides.', time: '3 days ago', icon: '📚', unread: false },
];

export default function App() {
  // Navigation State: 'landing' | 'dashboard' | 'tasks' | 'ai' | 'calendar' | 'analytics' | 'notifications' | 'profile' | 'auth'
  const [activeTab, setActiveTab] = useState('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Active User Profile
  const [currentUser, setCurrentUser] = useState({
    id: 'STU-2026-042',
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    role: 'student', // 'student' | 'teacher' | 'admin'
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    studentId: 'STU-2026-042',
    gpa: '3.88',
    avatarInitials: 'AJ',
  });

  // Auth Form State
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'
  const [authRole, setAuthRole] = useState('student'); // 'student' | 'teacher'
  const [authFullName, setAuthFullName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authDept, setAuthDept] = useState(DEPARTMENTS[0]);
  const [authStudentId, setAuthStudentId] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Assignments & Filter State
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [taskFilter, setTaskFilter] = useState('all'); // 'all' | 'pending' | 'submitted' | 'graded'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDueText, setNewDueText] = useState('Due Oct 15, 2026');
  const [newPoints, setNewPoints] = useState('100');

  // Teacher Grading Modal
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [gradingPoints, setGradingPoints] = useState('95');
  const [gradingFeedback, setGradingFeedback] = useState('');

  // Calendar State
  const [selectedDay, setSelectedDay] = useState('Thu');

  // AI Study Tutor
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your Academic Assistant. Ask me to break down mathematical proofs, explain database normalization, or check code logic for your upcoming coursework.',
      timestamp: '10:00 AM',
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiThinking, setAiThinking] = useState(false);

  // Backend Health
  const [serverOnline, setServerOnline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Time-aware greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' });
      const data = await res.json();
      setServerOnline(data.success === true);
    } catch {
      setServerOnline(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await checkHealth();
    setRefreshing(false);
  };

  // Human-crafted Design Tokens
  const theme = {
    bg: isDarkMode ? '#090d16' : '#f8fafc',
    surface: isDarkMode ? '#111827' : '#ffffff',
    surfaceSubtle: isDarkMode ? '#172033' : '#f1f5f9',
    surfaceHover: isDarkMode ? '#1e293b' : '#e2e8f0',
    border: isDarkMode ? '#1f293d' : '#e2e8f0',
    borderLight: isDarkMode ? '#28354f' : '#cbd5e1',
    text: isDarkMode ? '#f8fafc' : '#0f172a',
    textSecondary: isDarkMode ? '#94a3b8' : '#64748b',
    textMuted: isDarkMode ? '#64748b' : '#94a3b8',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    primarySoft: isDarkMode ? 'rgba(99, 102, 241, 0.16)' : '#eef2ff',
    primaryText: isDarkMode ? '#818cf8' : '#4f46e5',
    success: '#10b981',
    successSoft: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
    warning: '#f59e0b',
    warningSoft: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb',
    danger: '#ef4444',
    dangerSoft: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
  };

  // Auth Handler
  const handleAuthSubmit = () => {
    if (authMode === 'register') {
      if (!authFullName.trim() || !authEmail.trim() || !authPassword) {
        Alert.alert('Incomplete Form', 'Please enter your Full Name, Academic Email, and Password.');
        return;
      }
      if (authPassword !== authConfirmPassword) {
        Alert.alert('Password Mismatch', 'The entered passwords do not match.');
        return;
      }
      setAuthLoading(true);
      setTimeout(() => {
        setAuthLoading(false);
        const initials = authFullName
          .trim()
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        setCurrentUser({
          id: authStudentId.trim() || 'STU-2026-088',
          name: authFullName.trim(),
          email: authEmail.trim(),
          role: authRole,
          department: authDept,
          semester: authRole === 'teacher' ? 'Faculty Lead' : '6th Semester',
          studentId: authStudentId.trim() || (authRole === 'teacher' ? 'FAC-2026-101' : 'STU-2026-088'),
          gpa: '3.90',
          avatarInitials: initials || 'ST',
        });
        setActiveTab('dashboard');
      }, 500);
    } else {
      if (!authEmail.trim() || !authPassword) {
        Alert.alert('Required Fields', 'Please provide your academic email and password.');
        return;
      }
      setAuthLoading(true);
      setTimeout(() => {
        setAuthLoading(false);
        setCurrentUser({
          id: authRole === 'teacher' ? 'FAC-2026-101' : 'STU-2026-042',
          name: authRole === 'teacher' ? 'Dr. Evelyn Vance' : 'Alex Johnson',
          email: authEmail.trim(),
          role: authRole,
          department: 'Computer Science & Engineering',
          semester: authRole === 'teacher' ? 'Faculty Lead' : '6th Semester',
          studentId: authRole === 'teacher' ? 'FAC-2026-101' : 'STU-2026-042',
          gpa: '3.88',
          avatarInitials: authRole === 'teacher' ? 'EV' : 'AJ',
        });
        setActiveTab('dashboard');
      }, 500);
    }
  };

  // Quick Demo Login
  const quickDemoLogin = (role) => {
    if (role === 'student') {
      setCurrentUser({
        id: 'STU-2026-042',
        name: 'Alex Johnson',
        email: 'alex.johnson@university.edu',
        role: 'student',
        department: 'Computer Science & Engineering',
        semester: '6th Semester',
        studentId: 'STU-2026-042',
        gpa: '3.88',
        avatarInitials: 'AJ',
      });
    } else {
      setCurrentUser({
        id: 'FAC-2026-101',
        name: 'Dr. Evelyn Vance',
        email: 'e.vance@university.edu',
        role: 'teacher',
        department: 'Computer Science & Engineering',
        semester: 'Faculty Chair',
        studentId: 'FAC-2026-101',
        gpa: '4.0',
        avatarInitials: 'EV',
      });
    }
    setActiveTab('dashboard');
  };

  // Submit Homework Handler
  const handleConfirmSubmission = () => {
    if (!submissionLink.trim()) {
      Alert.alert('Link Required', 'Please enter your repository link or Google Drive URL.');
      return;
    }
    setAssignments((prev) =>
      prev.map((item) =>
        item.id === selectedTask.id
          ? {
              ...item,
              status: 'submitted',
              submission: {
                url: submissionLink.trim(),
                note: submissionNote.trim() || 'No additional notes provided.',
                submittedAt: 'Just now',
                studentName: currentUser.name,
              },
            }
          : item
      )
    );
    setSubmitModalOpen(false);
    Alert.alert('Submitted Successfully', `"${selectedTask.title}" has been recorded.`);
  };

  // Teacher Save Grade Handler
  const handleSaveGrade = () => {
    const pts = parseInt(gradingPoints) || 90;
    setAssignments((prev) =>
      prev.map((item) =>
        item.id === selectedTask.id
          ? {
              ...item,
              status: 'graded',
              earnedPoints: pts,
              gradeLetter: pts >= 90 ? 'A' : pts >= 80 ? 'B' : 'C',
              feedback: gradingFeedback.trim() || 'Satisfactory work on all required components.',
            }
          : item
      )
    );
    setGradeModalOpen(false);
    Alert.alert('Grade Published', `Grade recorded for "${selectedTask.title}".`);
  };

  // Create Custom Assignment Handler
  const handleCreateAssignment = () => {
    if (!newTitle.trim() || !newSubject.trim()) {
      Alert.alert('Missing Details', 'Please enter an assignment title and subject name.');
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      subject: newSubject.trim(),
      code: newCode.trim() || 'CS-GEN',
      instructor: currentUser.name,
      dueText: newDueText.trim() || 'Due in 2 weeks',
      dueDate: 'Upcoming',
      hoursLeft: 120,
      urgent: false,
      points: parseInt(newPoints) || 100,
      status: 'pending',
      category: 'Course Assignment',
      similarity: '0% (Clean)',
      accentColor: '#3b82f6',
      description: 'Scheduled coursework assignment item.',
      submission: null,
    };
    setAssignments((prev) => [newTask, ...prev]);
    setCreateModalOpen(false);
    setNewTitle('');
    setNewSubject('');
    setNewCode('');
    Alert.alert('Created', 'New assignment published to student portal.');
  };

  // AI Assistant Chat Handler
  const handleSendAi = (customText) => {
    const textToSend = customText || aiInput;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    if (!customText) setAiInput('');
    setAiThinking(true);

    setTimeout(() => {
      let replyText = `Here is a structured academic breakdown for "${userMessage.text}":\n\n1. Concept Overview: Define key variables and specify your system boundary.\n2. Methodology: Formulate the mathematical constraints.\n3. Validation: Verify against edge test cases before submitting your lab.`;

      const lower = userMessage.text.toLowerCase();
      if (lower.includes('rsa')) {
        replyText = `🔑 RSA Cryptography Key Steps:\n\n1. Key Generation:\n   • Select primes p and q (distinct & large).\n   • Modulus: n = p × q\n   • Totient: φ(n) = (p - 1)(q - 1)\n   • Public exponent e: 1 < e < φ(n) and gcd(e, φ(n)) = 1\n   • Private exponent d: d ≡ e⁻¹ (mod φ(n))\n\n2. Encryption: C = Mᵉ mod n\n3. Decryption: M = Cᵈ mod n`;
      } else if (lower.includes('3nf') || lower.includes('bcnf') || lower.includes('normalization')) {
        replyText = `📊 Normalization Summary (1NF to BCNF):\n\n• 1NF: Atomic values only; eliminate repeating groups.\n• 2NF: Must be in 1NF + no partial dependency on a composite primary key.\n• 3NF: Must be in 2NF + no transitive dependencies.\n• BCNF: For every functional dependency X → Y, X must be a superkey.`;
      } else if (lower.includes('avl') || lower.includes('tree') || lower.includes('bst')) {
        replyText = `🌲 AVL Tree Self-Balancing Rules:\n\n• Balance Factor (BF) = Height(LeftSubtree) - Height(RightSubtree)\n• Node is balanced if BF ∈ {-1, 0, +1}.\n• Rotations on violation:\n   1. Left-Left (LL) ➔ Single Right Rotation\n   2. Right-Right (RR) ➔ Single Left Rotation\n   3. Left-Right (LR) ➔ Left Rotation on child, then Right on node\n   4. Right-Left (RL) ➔ Right Rotation on child, then Left on node`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setAiThinking(false);
    }, 600);
  };

  // Filtered Coursework
  const filteredAssignments = assignments.filter((a) => {
    const matchesFilter = taskFilter === 'all' || a.status === taskFilter;
    const matchesQuery =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const pendingCount = assignments.filter((a) => a.status === 'pending').length;
  const completedCount = assignments.filter((a) => a.status === 'submitted' || a.status === 'graded').length;
  const totalCount = assignments.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* ================= TOP UNIVERSAL APP HEADER ================= */}
        <View style={[styles.headerContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={styles.headerLeft}
            onPress={() => setActiveTab('landing')}
            activeOpacity={0.8}
          >
            <View style={[styles.brandLogoBox, { backgroundColor: theme.primary }]}>
              <Text style={styles.brandLogoText}>AT</Text>
            </View>
            <View>
              <Text style={[styles.brandTitle, { color: theme.text }]}>AssignTrack</Text>
              <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>University Academic Suite</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            {/* Quick Role Switcher Pill */}
            <TouchableOpacity
              style={[styles.roleQuickPill, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
              onPress={() => {
                const newRole = currentUser.role === 'student' ? 'teacher' : 'student';
                quickDemoLogin(newRole);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.roleQuickPillText, { color: theme.primaryText }]}>
                {currentUser.role === 'student' ? '🎓 Student' : '👨‍🏫 Faculty'}
              </Text>
            </TouchableOpacity>

            {/* Dark / Light Toggle */}
            <TouchableOpacity
              style={[styles.headerIconBtn, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
              onPress={() => setIsDarkMode(!isDarkMode)}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 13 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>

            {/* Backend Sync Indicator */}
            <TouchableOpacity
              style={[styles.syncBadge, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
              onPress={checkHealth}
              activeOpacity={0.7}
            >
              <View style={[styles.syncDot, { backgroundColor: serverOnline ? theme.success : theme.danger }]} />
              <Text style={[styles.syncText, { color: theme.textSecondary }]}>
                {serverOnline ? 'Synced' : 'Offline'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= SECONDARY TOP NAV CHIPS (FOR ALL PAGES) ================= */}
        <View style={[styles.subNavBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 6 }}>
            {[
              { id: 'landing', label: 'Home Page', icon: '🌐' },
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'tasks', label: 'Coursework', icon: '📚' },
              { id: 'ai', label: 'AI Assistant', icon: '✨' },
              { id: 'calendar', label: 'Calendar', icon: '📅' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'notifications', label: 'Alerts (2)', icon: '🔔' },
              { id: 'auth', label: 'Sign In / Register', icon: '🔑' },
            ].map((nav) => {
              const isCurrent = activeTab === nav.id;
              return (
                <TouchableOpacity
                  key={nav.id}
                  style={[
                    styles.subNavItem,
                    { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    isCurrent && { backgroundColor: theme.primary, borderColor: theme.primary },
                  ]}
                  onPress={() => setActiveTab(nav.id)}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 11 }}>{nav.icon}</Text>
                  <Text
                    style={[
                      styles.subNavText,
                      { color: isCurrent ? '#ffffff' : theme.textSecondary, fontWeight: isCurrent ? '700' : '500' },
                    ]}
                  >
                    {nav.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ================= MAIN SCROLL CONTENT ================= */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        >
          {/* ========================================================================= */}
          {/* PAGE 1: PUBLIC LANDING PAGE                                               */}
          {/* ========================================================================= */}
          {activeTab === 'landing' && (
            <View style={styles.viewContainer}>
              {/* Hero Banner */}
              <View style={[styles.landingHeroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={[styles.landingBadgePill, { backgroundColor: theme.primarySoft }]}>
                  <Text style={[styles.landingBadgeText, { color: theme.primaryText }]}>UNIVERSITY PLATFORM 2026</Text>
                </View>

                <Text style={[styles.landingHeroTitle, { color: theme.text }]}>
                  Smart Assignment Tracking for Modern Universities
                </Text>
                <Text style={[styles.landingHeroSubtitle, { color: theme.textSecondary }]}>
                  Automate lab submissions, real-time similarity checks, academic AI assistance, and GPA analytics in one unified platform.
                </Text>

                {/* Direct Action Buttons */}
                <View style={styles.landingActionsRow}>
                  <TouchableOpacity
                    style={[styles.landingPrimaryBtn, { backgroundColor: theme.primary }]}
                    onPress={() => {
                      quickDemoLogin('student');
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.landingPrimaryBtnText}>Enter Student Portal ➔</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.landingSecondaryBtn, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
                    onPress={() => {
                      quickDemoLogin('teacher');
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.landingSecondaryBtnText, { color: theme.text }]}>Faculty Portal</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Live Platform Stats */}
              <View style={styles.landingStatsGrid}>
                <View style={[styles.landingStatCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Text style={[styles.landingStatNumber, { color: theme.primaryText }]}>99.4%</Text>
                  <Text style={[styles.landingStatLabel, { color: theme.textSecondary }]}>On-Time Submission</Text>
                </View>
                <View style={[styles.landingStatCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Text style={[styles.landingStatNumber, { color: theme.success }]}>12k+</Text>
                  <Text style={[styles.landingStatLabel, { color: theme.textSecondary }]}>Active Students</Text>
                </View>
                <View style={[styles.landingStatCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Text style={[styles.landingStatNumber, { color: theme.danger }]}>0%</Text>
                  <Text style={[styles.landingStatLabel, { color: theme.textSecondary }]}>Plagiarism Tolerated</Text>
                </View>
              </View>

              {/* Feature Highlights Grid */}
              <Text style={[styles.sectionHeadingText, { color: theme.text, marginTop: 14 }]}>Core Platform Capabilities</Text>

              {[
                { title: 'Automated Deadlines & Reminders', desc: 'Syncs coursework with dynamic countdowns and instant notification alerts.', icon: '⏰', actionTab: 'tasks' },
                { title: 'Academic AI Study Tutor', desc: 'Interactive concept breakdowns for cryptography, database normalization, and algorithms.', icon: '💡', actionTab: 'ai' },
                { title: 'Plagiarism & Similarity Engine', desc: 'Integrated similarity score inspection for all student programming and lab submissions.', icon: '🛡️', actionTab: 'tasks' },
                { title: 'Timetable & Class Schedule', desc: 'Real-time lecture halls, lab sessions, and submission calendar.', icon: '📅', actionTab: 'calendar' },
              ].map((feat, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.featureCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => setActiveTab(feat.actionTab)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.featureIconBubble, { backgroundColor: theme.primarySoft }]}>
                    <Text style={{ fontSize: 18 }}>{feat.icon}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.featureCardTitle, { color: theme.text }]}>{feat.title}</Text>
                    <Text style={[styles.featureCardDesc, { color: theme.textSecondary }]}>{feat.desc}</Text>
                  </View>
                  <Text style={{ color: theme.primaryText, fontWeight: '700' }}>➔</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ========================================================================= */}
          {/* PAGE 2: DASHBOARD (ADAPTIVE STUDENT & TEACHER)                            */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <View style={styles.viewContainer}>
              {/* User Greeting & Status Card */}
              <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.heroTop}>
                  <View style={[styles.avatarCircle, { backgroundColor: theme.primarySoft }]}>
                    <Text style={[styles.avatarText, { color: theme.primaryText }]}>{currentUser.avatarInitials}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.greetingSub, { color: theme.textSecondary }]}>{greeting},</Text>
                    <Text style={[styles.greetingName, { color: theme.text }]}>{currentUser.name}</Text>
                    <Text style={[styles.greetingRole, { color: theme.textSecondary }]}>
                      {currentUser.role === 'teacher' ? 'Faculty Instructor' : 'Computer Science Student'} • {currentUser.studentId}
                    </Text>
                  </View>
                  {currentUser.role === 'student' && (
                    <View style={[styles.gpaPill, { backgroundColor: theme.primarySoft, borderColor: theme.borderLight }]}>
                      <Text style={[styles.gpaPillLabel, { color: theme.textSecondary }]}>GPA</Text>
                      <Text style={[styles.gpaPillValue, { color: theme.primaryText }]}>{currentUser.gpa}</Text>
                    </View>
                  )}
                </View>

                {/* Academic Metrics Row */}
                {currentUser.role === 'student' ? (
                  <>
                    <View style={styles.progressSection}>
                      <View style={styles.progressHeaderRow}>
                        <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>Weekly Coursework Progress</Text>
                        <Text style={[styles.progressValText, { color: theme.text }]}>
                          {completedCount} of {totalCount} Done ({completionPercentage}%)
                        </Text>
                      </View>
                      <View style={[styles.progressBarTrack, { backgroundColor: theme.surfaceSubtle }]}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${completionPercentage}%`,
                              backgroundColor: completionPercentage > 75 ? theme.success : theme.primary,
                            },
                          ]}
                        />
                      </View>
                    </View>

                    <View style={styles.metricsGrid}>
                      <View style={[styles.metricTile, { backgroundColor: theme.surfaceSubtle }]}>
                        <Text style={[styles.metricNumber, { color: theme.text }]}>{pendingCount}</Text>
                        <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Pending</Text>
                      </View>
                      <View style={[styles.metricTile, { backgroundColor: theme.surfaceSubtle }]}>
                        <Text style={[styles.metricNumber, { color: theme.success }]}>{completedCount}</Text>
                        <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Completed</Text>
                      </View>
                      <View style={[styles.metricTile, { backgroundColor: theme.surfaceSubtle }]}>
                        <Text style={[styles.metricNumber, { color: theme.danger }]}>1</Text>
                        <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Due &lt; 28h</Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={styles.metricsGrid}>
                    <View style={[styles.metricTile, { backgroundColor: theme.surfaceSubtle }]}>
                      <Text style={[styles.metricNumber, { color: theme.text }]}>4</Text>
                      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Active Courses</Text>
                    </View>
                    <View style={[styles.metricTile, { backgroundColor: theme.surfaceSubtle }]}>
                      <Text style={[styles.metricNumber, { color: theme.warning }]}>3</Text>
                      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>To Grade</Text>
                    </View>
                    <View style={[styles.metricTile, { backgroundColor: theme.surfaceSubtle }]}>
                      <Text style={[styles.metricNumber, { color: theme.success }]}>94%</Text>
                      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Avg Score</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Priority Coursework / Action Items */}
              <View style={styles.sectionHeadingRow}>
                <Text style={[styles.sectionHeadingText, { color: theme.text }]}>
                  {currentUser.role === 'teacher' ? 'Course Submissions & Grading' : 'Active Coursework'}
                </Text>
                <TouchableOpacity onPress={() => setActiveTab('tasks')} activeOpacity={0.7}>
                  <Text style={[styles.sectionActionLink, { color: theme.primaryText }]}>View All ({assignments.length})</Text>
                </TouchableOpacity>
              </View>

              {assignments.slice(0, 3).map((item) => (
                <View
                  key={item.id}
                  style={[styles.taskItemCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={styles.taskCardHeader}>
                    <View style={[styles.courseTagPill, { backgroundColor: theme.surfaceSubtle }]}>
                      <Text style={[styles.courseTagCode, { color: theme.primaryText }]}>{item.code}</Text>
                      <Text style={[styles.courseTagName, { color: theme.textSecondary }]}> • {item.subject}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        item.status === 'graded'
                          ? { backgroundColor: theme.successSoft }
                          : item.urgent
                          ? { backgroundColor: theme.dangerSoft }
                          : { backgroundColor: theme.primarySoft },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          item.status === 'graded'
                            ? { color: theme.success }
                            : item.urgent
                            ? { color: theme.danger }
                            : { color: theme.primaryText },
                        ]}
                      >
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.taskTitleText, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.taskDescText, { color: theme.textSecondary }]} numberOfLines={2}>
                    {item.description}
                  </Text>

                  <View style={[styles.taskCardFooter, { borderTopColor: theme.border }]}>
                    <Text style={[styles.instructorNoteText, { color: theme.textSecondary }]}>
                      ⏰ {item.dueText}
                    </Text>

                    {currentUser.role === 'teacher' ? (
                      <TouchableOpacity
                        style={[styles.primaryCardBtn, { backgroundColor: theme.primary }]}
                        onPress={() => {
                          setSelectedTask(item);
                          setGradingPoints(item.earnedPoints ? item.earnedPoints.toString() : '95');
                          setGradingFeedback(item.feedback || '');
                          setGradeModalOpen(true);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '700' }}>Grade Submission</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.primaryCardBtn,
                          item.status === 'submitted' ? { backgroundColor: theme.surfaceSubtle } : { backgroundColor: theme.primary },
                        ]}
                        onPress={() => {
                          setSelectedTask(item);
                          setSubmissionLink(item.submission ? item.submission.url : '');
                          setSubmissionNote(item.submission ? item.submission.note : '');
                          setSubmitModalOpen(true);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.primaryCardBtnText,
                            item.status === 'submitted' ? { color: theme.text } : { color: '#ffffff' },
                          ]}
                        >
                          {item.status === 'graded' ? 'View Grade' : item.status === 'submitted' ? 'Resubmit' : 'Submit Lab'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ========================================================================= */}
          {/* PAGE 3: COURSEWORK & DELIVERABLES                                         */}
          {/* ========================================================================= */}
          {activeTab === 'tasks' && (
            <View style={styles.viewContainer}>
              <View style={styles.tasksHeaderRow}>
                <View>
                  <Text style={[styles.viewTitle, { color: theme.text }]}>Coursework Hub</Text>
                  <Text style={[styles.viewSubtitle, { color: theme.textSecondary }]}>
                    All academic assignments, problem sets, and lab deliverables.
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.addCustomBtn, { backgroundColor: theme.primary }]}
                  onPress={() => setCreateModalOpen(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addCustomBtnText}>+ New Task</Text>
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={{ color: theme.textSecondary, marginRight: 6 }}>🔍</Text>
                <TextInput
                  style={[styles.searchInput, { color: theme.text }]}
                  placeholder="Search coursework, subjects, or codes..."
                  placeholderTextColor={theme.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* Filter Pills */}
              <View style={styles.filterPillsRow}>
                {[
                  { id: 'all', label: `All (${assignments.length})` },
                  { id: 'pending', label: `Pending (${assignments.filter((a) => a.status === 'pending').length})` },
                  { id: 'submitted', label: `Submitted (${assignments.filter((a) => a.status === 'submitted').length})` },
                  { id: 'graded', label: `Graded (${assignments.filter((a) => a.status === 'graded').length})` },
                ].map((f) => (
                  <TouchableOpacity
                    key={f.id}
                    style={[
                      styles.filterPill,
                      { backgroundColor: theme.surface, borderColor: theme.border },
                      taskFilter === f.id && { backgroundColor: theme.primary, borderColor: theme.primary },
                    ]}
                    onPress={() => setTaskFilter(f.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.filterPillText, { color: taskFilter === f.id ? '#ffffff' : theme.textSecondary }]}>
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {filteredAssignments.map((item) => (
                <View
                  key={item.id}
                  style={[styles.taskItemCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={styles.taskCardHeader}>
                    <View style={[styles.courseTagPill, { backgroundColor: theme.surfaceSubtle }]}>
                      <Text style={[styles.courseTagCode, { color: theme.primaryText }]}>{item.code}</Text>
                      <Text style={[styles.courseTagName, { color: theme.textSecondary }]}> • {item.subject}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <View style={[styles.statusBadge, { backgroundColor: theme.surfaceSubtle }]}>
                        <Text style={[styles.statusBadgeText, { color: theme.textSecondary }]}>
                          🛡️ {item.similarity}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          item.status === 'graded'
                            ? { backgroundColor: theme.successSoft }
                            : item.status === 'submitted'
                            ? { backgroundColor: theme.primarySoft }
                            : { backgroundColor: theme.dangerSoft },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            item.status === 'graded'
                              ? { color: theme.success }
                              : item.status === 'submitted'
                              ? { color: theme.primaryText }
                              : { color: theme.danger },
                          ]}
                        >
                          {item.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={[styles.taskTitleText, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.taskDescText, { color: theme.textSecondary }]}>{item.description}</Text>

                  {item.status === 'graded' && (
                    <View style={[styles.gradeFeedbackCard, { backgroundColor: theme.successSoft, borderColor: 'rgba(16, 185, 129, 0.2)' }]}>
                      <Text style={[styles.gradeBadgeText, { color: theme.success }]}>
                        Grade: {item.earnedPoints} / {item.points} pts ({item.gradeLetter})
                      </Text>
                      <Text style={[styles.gradeFeedbackBody, { color: theme.text }]}>"{item.feedback}"</Text>
                    </View>
                  )}

                  <View style={[styles.taskCardFooter, { borderTopColor: theme.border }]}>
                    <View>
                      <Text style={[styles.deadlineLabelSmall, { color: theme.textSecondary }]}>Due Date</Text>
                      <Text style={[styles.deadlineDateVal, { color: theme.text }]}>{item.dueText}</Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.primaryCardBtn, { backgroundColor: theme.primary }]}
                      onPress={() => {
                        setSelectedTask(item);
                        setSubmissionLink(item.submission ? item.submission.url : '');
                        setSubmissionNote(item.submission ? item.submission.note : '');
                        setSubmitModalOpen(true);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '700' }}>
                        {item.status === 'graded' ? 'View Details' : item.status === 'submitted' ? 'Resubmit' : 'Submit Lab'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ========================================================================= */}
          {/* PAGE 4: ACADEMIC AI STUDY TUTOR                                           */}
          {/* ========================================================================= */}
          {activeTab === 'ai' && (
            <View style={styles.viewContainer}>
              <View style={[styles.aiHeroBanner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={[styles.aiHeroIconBubble, { backgroundColor: theme.primarySoft }]}>
                  <Text style={{ fontSize: 22 }}>🎓</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.aiHeroTitle, { color: theme.text }]}>Academic Study Assistant</Text>
                  <Text style={[styles.aiHeroSubtitle, { color: theme.textSecondary }]}>
                    Instant explanations for algorithms, schema normalization, and proofs.
                  </Text>
                </View>
              </View>

              {/* Study Prompt Suggestions */}
              <Text style={[styles.suggestedPromptsHeader, { color: theme.textSecondary }]}>Suggested Study Queries</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptChipsScroll}>
                {[
                  'Explain RSA key generation step-by-step',
                  'How to normalize schemas to 3NF & BCNF?',
                  'Analyze AVL tree rotation complexity',
                  'Explain Round Robin CPU turnaround time',
                ].map((prompt, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.promptSuggestionChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    onPress={() => handleSendAi(prompt)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.promptSuggestionChipText, { color: theme.primaryText }]}>💡 {prompt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Chat Thread */}
              <View style={[styles.chatBoxWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <ScrollView style={styles.chatScrollView} showsVerticalScrollIndicator={false}>
                  {chatMessages.map((msg) => (
                    <View
                      key={msg.id}
                      style={[
                        styles.chatBubbleContainer,
                        msg.sender === 'user' ? styles.userBubbleAlign : styles.aiBubbleAlign,
                      ]}
                    >
                      <View
                        style={[
                          styles.chatBubble,
                          msg.sender === 'user'
                            ? [styles.userBubble, { backgroundColor: theme.primary }]
                            : [styles.aiBubble, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }],
                        ]}
                      >
                        <Text style={[styles.chatMessageText, msg.sender === 'user' ? { color: '#ffffff' } : { color: theme.text }]}>
                          {msg.text}
                        </Text>
                        <Text style={[styles.chatTimestamp, { color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : theme.textMuted }]}>
                          {msg.timestamp}
                        </Text>
                      </View>
                    </View>
                  ))}

                  {aiThinking && (
                    <View style={[styles.chatBubbleContainer, styles.aiBubbleAlign]}>
                      <View style={[styles.chatBubble, styles.aiBubble, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border, flexDirection: 'row', alignItems: 'center' }]}>
                        <ActivityIndicator size="small" color={theme.primary} />
                        <Text style={[styles.thinkingText, { color: theme.textSecondary }]}>
                          Reviewing academic principles...
                        </Text>
                      </View>
                    </View>
                  )}
                </ScrollView>

                {/* Input Bar */}
                <View style={[styles.chatInputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                  <TextInput
                    style={[styles.chatInputText, { color: theme.text, backgroundColor: theme.surfaceSubtle }]}
                    placeholder="Ask about formulas, proofs, or lab concepts..."
                    placeholderTextColor={theme.textMuted}
                    value={aiInput}
                    onChangeText={setAiInput}
                    onSubmitEditing={() => handleSendAi()}
                  />
                  <TouchableOpacity
                    style={[styles.chatSendBtn, { backgroundColor: theme.primary }]}
                    onPress={() => handleSendAi()}
                    activeOpacity={0.8}
                  >
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>➔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* ========================================================================= */}
          {/* PAGE 5: CALENDAR & TIMETABLE                                              */}
          {/* ========================================================================= */}
          {activeTab === 'calendar' && (
            <View style={styles.viewContainer}>
              <Text style={[styles.viewTitle, { color: theme.text }]}>Academic Timetable</Text>
              <Text style={[styles.viewSubtitle, { color: theme.textSecondary }]}>
                Lecture halls, lab practicals, and submission deadlines.
              </Text>

              {/* Day Selector */}
              <View style={styles.daysSelectorRow}>
                {SCHEDULE_DATA.map((d) => (
                  <TouchableOpacity
                    key={d.day}
                    style={[
                      styles.daySelectorChip,
                      { backgroundColor: theme.surface, borderColor: theme.border },
                      selectedDay === d.day && { backgroundColor: theme.primary, borderColor: theme.primary },
                    ]}
                    onPress={() => setSelectedDay(d.day)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.daySelectorName, { color: selectedDay === d.day ? 'rgba(255,255,255,0.8)' : theme.textSecondary }]}>
                      {d.day}
                    </Text>
                    <Text style={[styles.daySelectorDate, { color: selectedDay === d.day ? '#ffffff' : theme.text }]}>
                      {d.date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Day Schedule Card */}
              <View style={[styles.scheduleDayCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.scheduleDayHeader, { color: theme.text }]}>Schedule for {selectedDay} (October)</Text>
                {SCHEDULE_DATA.find((d) => d.day === selectedDay)?.events.map((ev, i) => (
                  <View key={i} style={[styles.scheduleEventRow, i > 0 && { borderTopWidth: 1, borderTopColor: theme.border }]}>
                    <View style={styles.scheduleEventTimeCol}>
                      <Text style={[styles.scheduleEventTime, { color: theme.primaryText }]}>{ev.time}</Text>
                    </View>
                    <View style={styles.scheduleEventDetailsCol}>
                      <Text style={[styles.scheduleEventTitle, { color: theme.text }]}>{ev.title}</Text>
                      <View style={styles.scheduleMetaRow}>
                        <Text style={[styles.scheduleCourseBadge, { color: theme.textSecondary }]}>{ev.course}</Text>
                        <Text style={[styles.scheduleLocationBadge, { color: theme.textSecondary }]}>📍 {ev.room}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ========================================================================= */}
          {/* PAGE 6: ANALYTICS & GPA METRICS                                           */}
          {/* ========================================================================= */}
          {activeTab === 'analytics' && (
            <View style={styles.viewContainer}>
              <Text style={[styles.viewTitle, { color: theme.text }]}>Academic Analytics</Text>
              <Text style={[styles.viewSubtitle, { color: theme.textSecondary }]}>
                Grade trajectory, on-time submission rate, and velocity metrics.
              </Text>

              {/* Top Analytics Cards */}
              <View style={styles.landingStatsGrid}>
                <View style={[styles.landingStatCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Text style={[styles.landingStatNumber, { color: theme.primaryText }]}>3.88</Text>
                  <Text style={[styles.landingStatLabel, { color: theme.textSecondary }]}>Cumulative GPA</Text>
                </View>
                <View style={[styles.landingStatCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Text style={[styles.landingStatNumber, { color: theme.success }]}>96%</Text>
                  <Text style={[styles.landingStatLabel, { color: theme.textSecondary }]}>On-Time Rate</Text>
                </View>
                <View style={[styles.landingStatCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Text style={[styles.landingStatNumber, { color: theme.accentPurple || '#8b5cf6' }]}>4 / 4</Text>
                  <Text style={[styles.landingStatLabel, { color: theme.textSecondary }]}>Active Courses</Text>
                </View>
              </View>

              {/* Subject Performance Breakdown */}
              <View style={[styles.scheduleDayCard, { backgroundColor: theme.surface, borderColor: theme.border, marginTop: 12 }]}>
                <Text style={[styles.scheduleDayHeader, { color: theme.text }]}>Course Performance Breakdown</Text>
                {[
                  { course: 'CS-201: Data Structures & Algorithms', score: '96%', grade: 'A', status: 'Graded' },
                  { course: 'CS-401: Network Security', score: 'Pending Submission', grade: '--', status: 'Due Tomorrow' },
                  { course: 'CS-302: Database Management', score: 'Submitted (Reviewing)', grade: '--', status: 'Submitted' },
                  { course: 'CS-301: Operating Systems', score: 'Milestone Active', grade: '--', status: 'In Progress' },
                ].map((c, i) => (
                  <View key={i} style={[styles.scheduleEventRow, i > 0 && { borderTopWidth: 1, borderTopColor: theme.border }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.scheduleEventTitle, { color: theme.text }]}>{c.course}</Text>
                      <Text style={[styles.scheduleLocationBadge, { color: theme.textSecondary }]}>{c.score}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: theme.primarySoft }]}>
                      <Text style={[styles.statusBadgeText, { color: theme.primaryText }]}>{c.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ========================================================================= */}
          {/* PAGE 7: NOTIFICATIONS & ALERTS                                            */}
          {/* ========================================================================= */}
          {activeTab === 'notifications' && (
            <View style={styles.viewContainer}>
              <Text style={[styles.viewTitle, { color: theme.text }]}>Academic Notifications</Text>
              <Text style={[styles.viewSubtitle, { color: theme.textSecondary }]}>
                System alerts, grading updates, and deadline reminders.
              </Text>

              {NOTIFICATIONS.map((n) => (
                <View
                  key={n.id}
                  style={[
                    styles.featureCard,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                    n.unread && { borderColor: theme.primary },
                  ]}
                >
                  <View style={[styles.featureIconBubble, { backgroundColor: theme.primarySoft }]}>
                    <Text style={{ fontSize: 16 }}>{n.icon}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.featureCardTitle, { color: theme.text }]}>{n.title}</Text>
                    <Text style={[styles.featureCardDesc, { color: theme.textSecondary }]}>{n.desc}</Text>
                    <Text style={[styles.chatTimestamp, { color: theme.textMuted, alignSelf: 'flex-start', marginTop: 3 }]}>
                      {n.time}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ========================================================================= */}
          {/* PAGE 8: AUTHENTICATION (SIGN IN / REGISTER)                               */}
          {/* ========================================================================= */}
          {activeTab === 'auth' && (
            <View style={styles.viewContainer}>
              {/* Segmented Auth Selector */}
              <View style={[styles.authSegmentWrapper, { backgroundColor: theme.surfaceSubtle }]}>
                <TouchableOpacity
                  style={[styles.authSegmentButton, authMode === 'register' && [styles.authSegmentButtonActive, { backgroundColor: theme.surface }]]}
                  onPress={() => setAuthMode('register')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.authSegmentLabel, { color: authMode === 'register' ? theme.primaryText : theme.textSecondary }]}>
                    Create Account
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.authSegmentButton, authMode === 'login' && [styles.authSegmentButtonActive, { backgroundColor: theme.surface }]]}
                  onPress={() => setAuthMode('login')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.authSegmentLabel, { color: authMode === 'login' ? theme.primaryText : theme.textSecondary }]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Role Toggle Selector */}
              <View style={[styles.rolePillsRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <TouchableOpacity
                  style={[styles.rolePillOption, authRole === 'student' && { backgroundColor: theme.primarySoft }]}
                  onPress={() => setAuthRole('student')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.rolePillLabel, { color: authRole === 'student' ? theme.primaryText : theme.textSecondary }]}>
                    🎓 Student Portal
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.rolePillOption, authRole === 'teacher' && { backgroundColor: theme.primarySoft }]}
                  onPress={() => setAuthRole('teacher')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.rolePillLabel, { color: authRole === 'teacher' ? theme.primaryText : theme.textSecondary }]}>
                    👨‍🏫 Faculty Portal
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Form Card */}
              <View style={[styles.authCardBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                {authMode === 'register' && (
                  <View style={styles.formFieldBlock}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>FULL NAME</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                      <TextInput
                        style={[styles.textInputStyle, { color: theme.text }]}
                        placeholder="e.g. Alex Johnson"
                        placeholderTextColor={theme.textMuted}
                        value={authFullName}
                        onChangeText={setAuthFullName}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.formFieldBlock}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>ACADEMIC EMAIL</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                    <TextInput
                      style={[styles.textInputStyle, { color: theme.text }]}
                      placeholder="student@university.edu"
                      placeholderTextColor={theme.textMuted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={authEmail}
                      onChangeText={setAuthEmail}
                    />
                  </View>
                </View>

                {authMode === 'register' && (
                  <>
                    <View style={styles.formFieldBlock}>
                      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>DEPARTMENT</Text>
                      <TouchableOpacity
                        style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
                        onPress={() => setDeptModalOpen(true)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.textInputStyle, { color: theme.text }]} numberOfLines={1}>
                          {authDept}
                        </Text>
                        <Text style={{ color: theme.textSecondary, fontSize: 12 }}>▼</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.formFieldBlock}>
                      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                        {authRole === 'student' ? 'STUDENT ID' : 'EMPLOYEE ID'}
                      </Text>
                      <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                        <TextInput
                          style={[styles.textInputStyle, { color: theme.text }]}
                          placeholder={authRole === 'student' ? 'e.g. STU-2026-042' : 'e.g. FAC-2026-101'}
                          placeholderTextColor={theme.textMuted}
                          value={authStudentId}
                          onChangeText={setAuthStudentId}
                        />
                      </View>
                    </View>
                  </>
                )}

                <View style={styles.formFieldBlock}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>PASSWORD</Text>
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Text style={[styles.showPassText, { color: theme.primaryText }]}>
                        {showPassword ? 'Hide' : 'Show'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                    <TextInput
                      style={[styles.textInputStyle, { color: theme.text }]}
                      placeholder="Minimum 6 characters"
                      placeholderTextColor={theme.textMuted}
                      secureTextEntry={!showPassword}
                      value={authPassword}
                      onChangeText={setAuthPassword}
                    />
                  </View>
                </View>

                {authMode === 'register' && (
                  <View style={styles.formFieldBlock}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>CONFIRM PASSWORD</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                      <TextInput
                        style={[styles.textInputStyle, { color: theme.text }]}
                        placeholder="Re-enter password"
                        placeholderTextColor={theme.textMuted}
                        secureTextEntry={!showPassword}
                        value={authConfirmPassword}
                        onChangeText={setAuthConfirmPassword}
                      />
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.primaryAuthButton, { backgroundColor: theme.primary }]}
                  onPress={handleAuthSubmit}
                  disabled={authLoading}
                  activeOpacity={0.8}
                >
                  {authLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.primaryAuthButtonText}>
                      {authMode === 'register' ? 'Create Account ➔' : 'Sign In to Portal ➔'}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Quick Demo Shortcuts */}
                <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.border }}>
                  <Text style={[styles.deadlineLabelSmall, { color: theme.textSecondary, marginBottom: 8, textAlign: 'center' }]}>
                    QUICK DEMO PREVIEW LOGINS
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      style={[styles.quickDemoBtn, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
                      onPress={() => quickDemoLogin('student')}
                    >
                      <Text style={[styles.quickDemoBtnText, { color: theme.text }]}>Alex (Student)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.quickDemoBtn, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
                      onPress={() => quickDemoLogin('teacher')}
                    >
                      <Text style={[styles.quickDemoBtnText, { color: theme.text }]}>Dr. Vance (Faculty)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* ================= MODAL: SUBMIT ASSIGNMENT ================= */}
        <Modal visible={submitModalOpen} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheetBox, { backgroundColor: theme.surface }]}>
              <View style={[styles.modalHandle, { backgroundColor: theme.border }]} />
              <Text style={[styles.modalSheetHeading, { color: theme.text }]}>Coursework Submission</Text>
              <Text style={[styles.modalCourseCode, { color: theme.primaryText }]}>
                {selectedTask?.code} • {selectedTask?.subject}
              </Text>
              <Text style={[styles.modalTaskTitle, { color: theme.text }]}>{selectedTask?.title}</Text>

              <Text style={[styles.modalInputLabel, { color: theme.textSecondary }]}>
                REPOSITORY URL / GOOGLE DRIVE LINK
              </Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border, marginBottom: 12 }]}>
                <TextInput
                  style={[styles.textInputStyle, { color: theme.text }]}
                  placeholder="https://github.com/my-account/lab-solution"
                  placeholderTextColor={theme.textMuted}
                  value={submissionLink}
                  onChangeText={setSubmissionLink}
                  autoCapitalize="none"
                />
              </View>

              <Text style={[styles.modalInputLabel, { color: theme.textSecondary }]}>SUBMISSION NOTES</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border, height: 75, alignItems: 'flex-start' }]}>
                <TextInput
                  style={[styles.textInputStyle, { color: theme.text, height: 65, textAlignVertical: 'top' }]}
                  placeholder="Optional dependencies, execution steps..."
                  placeholderTextColor={theme.textMuted}
                  multiline
                  value={submissionNote}
                  onChangeText={setSubmissionNote}
                />
              </View>

              <View style={styles.modalActionButtonsRow}>
                <TouchableOpacity
                  style={[styles.modalCancelBtn, { backgroundColor: theme.surfaceSubtle }]}
                  onPress={() => setSubmitModalOpen(false)}
                >
                  <Text style={[styles.modalCancelBtnText, { color: theme.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalConfirmBtn, { backgroundColor: theme.primary }]}
                  onPress={handleConfirmSubmission}
                >
                  <Text style={styles.modalConfirmBtnText}>Confirm Submission</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ================= MODAL: TEACHER GRADE SUBMISSION ================= */}
        <Modal visible={gradeModalOpen} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheetBox, { backgroundColor: theme.surface }]}>
              <View style={[styles.modalHandle, { backgroundColor: theme.border }]} />
              <Text style={[styles.modalSheetHeading, { color: theme.text }]}>Faculty Evaluation & Grading</Text>
              <Text style={[styles.modalCourseCode, { color: theme.primaryText }]}>
                {selectedTask?.code} • {selectedTask?.title}
              </Text>

              <Text style={[styles.modalInputLabel, { color: theme.textSecondary, marginTop: 10 }]}>
                ASSIGNED POINTS (OUT OF {selectedTask?.points})
              </Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border, marginBottom: 12 }]}>
                <TextInput
                  style={[styles.textInputStyle, { color: theme.text }]}
                  placeholder="e.g. 96"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  value={gradingPoints}
                  onChangeText={setGradingPoints}
                />
              </View>

              <Text style={[styles.modalInputLabel, { color: theme.textSecondary }]}>INSTRUCTOR FEEDBACK</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border, height: 75, alignItems: 'flex-start' }]}>
                <TextInput
                  style={[styles.textInputStyle, { color: theme.text, height: 65, textAlignVertical: 'top' }]}
                  placeholder="Feedback notes for student..."
                  placeholderTextColor={theme.textMuted}
                  multiline
                  value={gradingFeedback}
                  onChangeText={setGradingFeedback}
                />
              </View>

              <View style={styles.modalActionButtonsRow}>
                <TouchableOpacity
                  style={[styles.modalCancelBtn, { backgroundColor: theme.surfaceSubtle }]}
                  onPress={() => setGradeModalOpen(false)}
                >
                  <Text style={[styles.modalCancelBtnText, { color: theme.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalConfirmBtn, { backgroundColor: theme.success }]}
                  onPress={handleSaveGrade}
                >
                  <Text style={styles.modalConfirmBtnText}>Publish Grade</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ================= MODAL: ADD CUSTOM ASSIGNMENT ================= */}
        <Modal visible={createModalOpen} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheetBox, { backgroundColor: theme.surface }]}>
              <View style={[styles.modalHandle, { backgroundColor: theme.border }]} />
              <Text style={[styles.modalSheetHeading, { color: theme.text }]}>Publish Course Assignment</Text>

              <Text style={[styles.modalInputLabel, { color: theme.textSecondary }]}>ASSIGNMENT TITLE</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border, marginBottom: 10 }]}>
                <TextInput
                  style={[styles.textInputStyle, { color: theme.text }]}
                  placeholder="e.g. Raft Distributed Consensus Lab"
                  placeholderTextColor={theme.textMuted}
                  value={newTitle}
                  onChangeText={setNewTitle}
                />
              </View>

              <Text style={[styles.modalInputLabel, { color: theme.textSecondary }]}>COURSE SUBJECT & CODE</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                <View style={[styles.inputWrapper, { flex: 2, backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                  <TextInput
                    style={[styles.textInputStyle, { color: theme.text }]}
                    placeholder="Distributed Systems"
                    placeholderTextColor={theme.textMuted}
                    value={newSubject}
                    onChangeText={setNewSubject}
                  />
                </View>
                <View style={[styles.inputWrapper, { flex: 1, backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                  <TextInput
                    style={[styles.textInputStyle, { color: theme.text }]}
                    placeholder="CS-450"
                    placeholderTextColor={theme.textMuted}
                    value={newCode}
                    onChangeText={setNewCode}
                  />
                </View>
              </View>

              <View style={styles.modalActionButtonsRow}>
                <TouchableOpacity
                  style={[styles.modalCancelBtn, { backgroundColor: theme.surfaceSubtle }]}
                  onPress={() => setCreateModalOpen(false)}
                >
                  <Text style={[styles.modalCancelBtnText, { color: theme.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalConfirmBtn, { backgroundColor: theme.primary }]}
                  onPress={handleCreateAssignment}
                >
                  <Text style={styles.modalConfirmBtnText}>Save Assignment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ================= MODAL: DEPARTMENT PICKER ================= */}
        <Modal visible={deptModalOpen} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheetBox, { backgroundColor: theme.surface, maxHeight: 420 }]}>
              <Text style={[styles.modalSheetHeading, { color: theme.text, marginBottom: 12 }]}>
                Select University Department
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {DEPARTMENTS.map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    style={[styles.deptPickerRow, { borderBottomColor: theme.border }]}
                    onPress={() => {
                      setAuthDept(dept);
                      setDeptModalOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.deptPickerRowText, { color: theme.text }]}>{dept}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { backgroundColor: theme.surfaceSubtle, marginTop: 12 }]}
                onPress={() => setDeptModalOpen(false)}
              >
                <Text style={[styles.modalCancelBtnText, { color: theme.text }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ================= BOTTOM BAR (5 PRIMARY WORKSPACES) ================= */}
        <View style={[styles.bottomNavContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          {[
            { id: 'landing', label: 'Home', icon: '🏠' },
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'tasks', label: 'Coursework', icon: '📚' },
            { id: 'ai', label: 'AI Tutor', icon: '✨' },
            { id: 'calendar', label: 'Schedule', icon: '📅' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.navTabBtn}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.navTabIcon, isActive && { transform: [{ scale: 1.1 }] }]}>{tab.icon}</Text>
                <Text
                  style={[
                    styles.navTabLabel,
                    { color: isActive ? theme.primaryText : theme.textSecondary, fontWeight: isActive ? '700' : '500' },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleQuickPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  roleQuickPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  headerIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  syncText: {
    fontSize: 10,
    fontWeight: '600',
  },
  subNavBar: {
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  subNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  subNavText: {
    fontSize: 11,
  },
  scrollContent: {
    paddingBottom: 85,
  },
  viewContainer: {
    padding: 14,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  landingHeroCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  landingBadgePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  landingBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  landingHeroTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 24,
    marginBottom: 6,
  },
  landingHeroSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  landingActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  landingPrimaryBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  landingPrimaryBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  landingSecondaryBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  landingSecondaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  landingStatsGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  landingStatCard: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  landingStatNumber: {
    fontSize: 16,
    fontWeight: '900',
  },
  landingStatLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  featureIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCardTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  featureCardDesc: {
    fontSize: 11,
    marginTop: 1,
  },
  heroCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
  },
  greetingSub: {
    fontSize: 11,
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  greetingRole: {
    fontSize: 10,
    marginTop: 1,
  },
  gpaPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  gpaPillLabel: {
    fontSize: 8,
    fontWeight: '700',
  },
  gpaPillValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressValText: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  metricTile: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionHeadingText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionActionLink: {
    fontSize: 11,
    fontWeight: '700',
  },
  taskItemCard: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  taskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  courseTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  courseTagCode: {
    fontSize: 10,
    fontWeight: '800',
  },
  courseTagName: {
    fontSize: 10,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  taskTitleText: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  taskDescText: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10,
  },
  taskCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  instructorNoteText: {
    fontSize: 10,
    fontWeight: '600',
  },
  primaryCardBtn: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 7,
  },
  primaryCardBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  tasksHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  viewTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  viewSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  addCustomBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
  },
  addCustomBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 11,
    padding: 0,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  gradeFeedbackCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
  gradeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  gradeFeedbackBody: {
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 2,
  },
  deadlineLabelSmall: {
    fontSize: 8,
    fontWeight: '600',
  },
  deadlineDateVal: {
    fontSize: 10,
    fontWeight: '700',
  },
  aiHeroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  aiHeroIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiHeroTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  aiHeroSubtitle: {
    fontSize: 10,
    marginTop: 1,
  },
  suggestedPromptsHeader: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  promptChipsScroll: {
    marginBottom: 10,
  },
  promptSuggestionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 6,
  },
  promptSuggestionChipText: {
    fontSize: 10,
    fontWeight: '600',
  },
  chatBoxWrapper: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  chatScrollView: {
    height: 300,
    padding: 10,
  },
  chatBubbleContainer: {
    marginBottom: 8,
  },
  userBubbleAlign: {
    alignItems: 'flex-end',
  },
  aiBubbleAlign: {
    alignItems: 'flex-start',
  },
  chatBubble: {
    padding: 10,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userBubble: {
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    borderWidth: 1,
    borderBottomLeftRadius: 2,
  },
  chatMessageText: {
    fontSize: 11,
    lineHeight: 16,
  },
  chatTimestamp: {
    fontSize: 8,
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  thinkingText: {
    fontSize: 10,
    marginLeft: 6,
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 6,
    borderTopWidth: 1,
    gap: 6,
  },
  chatInputText: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 11,
  },
  chatSendBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  daySelectorChip: {
    width: 40,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  daySelectorName: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 1,
  },
  daySelectorDate: {
    fontSize: 12,
    fontWeight: '800',
  },
  scheduleDayCard: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  scheduleDayHeader: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  scheduleEventRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
  },
  scheduleEventTimeCol: {
    width: 75,
  },
  scheduleEventTime: {
    fontSize: 10,
    fontWeight: '700',
  },
  scheduleEventDetailsCol: {
    flex: 1,
  },
  scheduleEventTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  scheduleMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 1,
  },
  scheduleCourseBadge: {
    fontSize: 9,
    fontWeight: '600',
  },
  scheduleLocationBadge: {
    fontSize: 9,
  },
  authSegmentWrapper: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    marginBottom: 10,
  },
  authSegmentButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  authSegmentButtonActive: {
    elevation: 1,
  },
  authSegmentLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  rolePillsRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    padding: 3,
    marginBottom: 10,
  },
  rolePillOption: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  rolePillLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  authCardBox: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  formFieldBlock: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  showPassText: {
    fontSize: 9,
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 11,
    padding: 0,
  },
  primaryAuthButton: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryAuthButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  quickDemoBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickDemoBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheetBox: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    paddingBottom: Platform.OS === 'ios' ? 34 : 18,
  },
  modalHandle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalSheetHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 3,
  },
  modalCourseCode: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  modalTaskTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalInputLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  modalActionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalConfirmBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  deptPickerRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  deptPickerRowText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 6,
    paddingBottom: Platform.OS === 'ios' ? 22 : 6,
  },
  navTabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTabIcon: {
    fontSize: 14,
  },
  navTabLabel: {
    fontSize: 9,
    marginTop: 2,
  },
});
