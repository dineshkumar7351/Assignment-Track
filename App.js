import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
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
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle, Line, Polyline } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const API_BASE_URL = Platform.select({
  web: 'http://localhost:5000',
  android: 'http://10.0.2.2:5000',
  default: 'http://localhost:5000',
});

// Primary Brand Theme Colors
const THEME = {
  light: {
    bg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    sidebarBg: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    primary: '#104f37',
    primaryDark: '#0a1f18',
    primaryLight: '#e6f4ee',
    emerald: '#10b981',
    emeraldMint: '#52b788',
    emeraldBg: '#ecfdf5',
    emeraldBorder: '#a7f3d0',
    badgeBg: '#f1f5f9',
    badgeText: '#475569',
    inputBg: '#f8fafc',
    inputBorder: '#cbd5e1',
    tabBarBg: '#ffffff',
    tabBarBorder: '#e2e8f0',
    tabActive: '#104f37',
    tabInactive: '#94a3b8',
    danger: '#e11d48',
    dangerBg: '#fff1f2',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  dark: {
    bg: '#090d16',
    cardBg: '#131b2e',
    cardBorder: '#1e293b',
    sidebarBg: '#0f172a',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    primary: '#104f37',
    primaryDark: '#071510',
    primaryLight: '#0f291e',
    emerald: '#34d399',
    emeraldMint: '#52b788',
    emeraldBg: '#064e3b',
    emeraldBorder: '#059669',
    badgeBg: '#1e293b',
    badgeText: '#cbd5e1',
    inputBg: '#0f172a',
    inputBorder: '#334155',
    tabBarBg: '#0f172a',
    tabBarBorder: '#1e293b',
    tabActive: '#34d399',
    tabInactive: '#64748b',
    danger: '#f43f5e',
    dangerBg: '#4c0519',
    warning: '#fbbf24',
    info: '#60a5fa',
  },
};

// ==========================================
// PURE NATIVE SVG ICONS (MATCHING FIGMA/WEB)
// ==========================================
function GridIcon({ size = 20, color = '#64748b' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="3" width="7" height="7" rx="1.5" />
      <Rect x="14" y="3" width="7" height="7" rx="1.5" />
      <Rect x="14" y="14" width="7" height="7" rx="1.5" />
      <Rect x="3" y="14" width="7" height="7" rx="1.5" />
    </Svg>
  );
}

function TasksIcon({ size = 20, color = '#64748b' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="9 11 12 14 22 4" />
      <Path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </Svg>
  );
}

function CalendarIcon({ size = 20, color = '#64748b' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  );
}

function AnalyticsIcon({ size = 20, color = '#64748b' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="18" y1="20" x2="18" y2="10" />
      <Line x1="12" y1="20" x2="12" y2="4" />
      <Line x1="6" y1="20" x2="6" y2="14" />
    </Svg>
  );
}

function TeamIcon({ size = 20, color = '#64748b' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

function SettingsIcon({ size = 20, color = '#64748b' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Svg>
  );
}

function HelpIcon({ size = 20, color = '#64748b' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <Line x1="12" y1="17" x2="12.01" y2="17" />
    </Svg>
  );
}

function LogoutIcon({ size = 20, color = '#e11d48' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <Polyline points="16 17 21 12 16 7" />
      <Line x1="21" y1="12" x2="9" y2="12" />
    </Svg>
  );
}

function MenuIcon({ size = 22, color = '#0f172a' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="3" y1="12" x2="21" y2="12" />
      <Line x1="3" y1="6" x2="21" y2="6" />
      <Line x1="3" y1="18" x2="21" y2="18" />
    </Svg>
  );
}

function CloseIcon({ size = 20, color = '#94a3b8' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  );
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const INITIAL_ASSIGNMENTS = [
  {
    id: '1',
    title: 'RSA Cryptosystem & Modular Inverse Lab',
    subject: 'Network Security',
    code: 'CS-401',
    instructor: 'Dr. Sarah Connor',
    dueText: 'Tomorrow at 11:59 PM',
    dueDate: 'Nov 26, 2026',
    hoursLeft: 24,
    urgent: true,
    points: 100,
    status: 'pending',
    category: 'Lab Report',
    similarity: '0% (Clean)',
    description: 'Implement RSA keygen, extended Euclidean modular inverse, encryption & decryption in Python.',
    submission: null,
  },
  {
    id: '2',
    title: 'Hospital Database Normalization (3NF/BCNF)',
    subject: 'Database Systems',
    code: 'CS-302',
    instructor: 'Prof. Marcus Vance',
    dueText: 'Nov 28, 2026 at 5:00 PM',
    dueDate: 'Nov 28, 2026',
    hoursLeft: 72,
    urgent: false,
    points: 50,
    status: 'submitted',
    category: 'Problem Set',
    similarity: '3% (Clean)',
    description: 'Decompose patient records into Boyce-Codd Normal Form with functional dependency proofs.',
    submission: {
      url: 'https://github.com/alex-morgan/db-normalization',
      note: 'Normalized schema up to BCNF with SQL DDL scripts.',
      submittedAt: 'Nov 22, 2026',
      studentName: 'Alex Morgan',
    },
  },
  {
    id: '3',
    title: 'Self-Balancing AVL Trees & Rotation Proofs',
    subject: 'Data Structures & Algorithms',
    code: 'CS-201',
    instructor: 'Dr. Sarah Connor',
    dueText: 'Nov 30, 2026 at 11:59 PM',
    dueDate: 'Nov 30, 2026',
    hoursLeft: 120,
    urgent: false,
    points: 100,
    earnedPoints: 98,
    status: 'graded',
    gradeLetter: 'A',
    feedback: 'Outstanding tree rotation benchmark analysis and clean recursive balance factor tracking.',
    category: 'Programming Lab',
    similarity: '1% (Clean)',
    description: 'Benchmark AVL tree insertion/deletion vs standard BSTs with asymptotic height proofs.',
    submission: {
      url: 'https://github.com/alex-morgan/avl-trees',
      note: 'Complete C++ implementation with Google Benchmark suites.',
      submittedAt: 'Nov 20, 2026',
      studentName: 'Alex Morgan',
    },
  },
  {
    id: '4',
    title: 'Cloud Microservices Architecture & Docker Swarm',
    subject: 'Cloud Computing',
    code: 'CS-304',
    instructor: 'Prof. Marcus Vance',
    dueText: 'Dec 05, 2026 at 11:59 PM',
    dueDate: 'Dec 05, 2026',
    hoursLeft: 240,
    urgent: false,
    points: 100,
    status: 'pending',
    category: 'Term Project',
    similarity: '0% (Clean)',
    description: 'Deploy a high-availability distributed microservice application using Docker & Kubernetes ingress.',
    submission: null,
  },
];

const COURSE_BREAKDOWN = [
  {
    course: 'Distributed Systems (CS-304)',
    tasksCount: 6,
    progress: 85,
    grade: 'A',
    onTime: '100%',
  },
  {
    course: 'Computer Vision & AI (AI-401)',
    tasksCount: 5,
    progress: 70,
    grade: 'A-',
    onTime: '92%',
  },
  {
    course: 'Multivariable Calculus (MATH-202)',
    tasksCount: 4,
    progress: 60,
    grade: 'B+',
    onTime: '88%',
  },
  {
    course: 'Database Optimization (DB-301)',
    tasksCount: 5,
    progress: 90,
    grade: 'A',
    onTime: '100%',
  },
];

function MainApp() {
  const insets = useSafeAreaInsets();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loginEmail, setLoginEmail] = useState('student@smarttracker.edu');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'tasks' | 'calendar' | 'analytics' | 'team' | 'settings' | 'help'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('student'); // 'student' | 'teacher' | 'admin'

  // Assignments & Filter State
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [taskFilter, setTaskFilter] = useState('all'); // 'all' | 'pending' | 'submitted' | 'graded'
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Timeframe selector for Analytics ('week' | 'month' | 'term')
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('month');

  // Time Tracker State
  const [secondsElapsed, setSecondsElapsed] = useState(5048); // 01:24:08
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Live GPA Interactive Estimator
  const [hwScore, setHwScore] = useState(94);
  const [labScore, setLabScore] = useState(90);
  const [examScore, setExamScore] = useState(92);
  const [projScore, setProjScore] = useState(96);

  // Calendar State matching Web 1:1
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // October (1-indexed)
  const [selectedDate, setSelectedDate] = useState(7);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('02:00 PM - 03:30 PM');

  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: 1,
      day: 15,
      title: 'Meeting with Arc Company',
      time: '02.00 pm - 04.00 pm',
      type: 'Meeting',
      color: '#104f37',
      textColor: '#ffffff',
    },
    {
      id: 2,
      day: 18,
      title: 'Develop API Endpoints Due',
      time: '11:59 PM',
      type: 'Assignment',
      color: '#d1fae5',
      textColor: '#065f46',
    },
    {
      id: 3,
      day: 22,
      title: 'Design Sprint Review',
      time: '10:00 AM - 11:30 AM',
      type: 'Review',
      color: '#fef3c7',
      textColor: '#92400e',
    },
    {
      id: 4,
      day: 26,
      title: 'Build Dashboard Milestones',
      time: '05:00 PM',
      type: 'Milestone',
      color: '#f3e8ff',
      textColor: '#6b21a8',
    },
  ]);

  // Modals
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Create Assignment Modal State
  const [createAssignmentModalVisible, setCreateAssignmentModalVisible] = useState(false);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignSubject, setNewAssignSubject] = useState('Network Security');
  const [newAssignCode, setNewAssignCode] = useState('CS-401');
  const [newAssignCategory, setNewAssignCategory] = useState('Programming Lab');
  const [newAssignDueDate, setNewAssignDueDate] = useState('Dec 05, 2026 at 11:59 PM');
  const [newAssignPoints, setNewAssignPoints] = useState('100');
  const [newAssignDesc, setNewAssignDesc] = useState('');

  // New Project Modal
  const [addProjectModalVisible, setAddProjectModalVisible] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDue, setNewProjectDue] = useState('');

  // Add Member Modal
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  // Meeting Modal
  const [meetingModalVisible, setMeetingModalVisible] = useState(false);

  // Project List
  const [projectsList, setProjectsList] = useState([
    { id: 1, title: 'Develop API Endpoints', due: 'Nov 26, 2026', iconText: '</>', color: '#3b82f6' },
    { id: 2, title: 'Onboarding Flow', due: 'Nov 28, 2026', iconText: '🧭', color: '#0d9488' },
    { id: 3, title: 'Build Dashboard', due: 'Nov 30, 2026', iconText: '⊞', color: '#10b981' },
    { id: 4, title: 'Optimize Page Load', due: 'Dec 05, 2026', iconText: '⚡', color: '#f59e0b' },
  ]);

  // Team Members
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alexandra Deff', role: 'Github Project Repository', status: 'Completed', color: '#10b981' },
    { id: 2, name: 'Edwin Aden', role: 'API Authentication Flow', status: 'In Progress', color: '#f59e0b' },
    { id: 3, name: 'Sarah Connor', role: 'Database Normalization', status: 'In Progress', color: '#3b82f6' },
  ]);

  const colors = isDarkMode ? THEME.dark : THEME.light;

  // Exact 7-column Calendar Weeks Matrix calculation for perfect alignment
  const calendarWeeks = useMemo(() => {
    const totalDays = new Date(currentYear, currentMonth, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();

    const cells = [];
    // Leading blank days
    for (let i = 0; i < firstDay; i++) {
      cells.push({ isBlank: true, key: `blank-${i}` });
    }
    // Days of month
    for (let d = 1; d <= totalDays; d++) {
      cells.push({ isBlank: false, dayNum: d, key: `day-${d}` });
    }
    // Trailing blank days to complete 7-day grid rows
    while (cells.length % 7 !== 0) {
      cells.push({ isBlank: true, key: `blank-end-${cells.length}` });
    }

    // Chunk into 7-day rows
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
  }, [currentYear, currentMonth]);

  const selectedDayEvents = useMemo(() => calendarEvents.filter((ev) => ev.day === selectedDate), [calendarEvents, selectedDate]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleAddCalendarEvent = () => {
    if (!newEventTitle.trim()) {
      Alert.alert('Event Title Required', 'Please enter a title for your calendar event.');
      return;
    }
    const newEv = {
      id: Date.now(),
      day: selectedDate,
      title: newEventTitle.trim(),
      time: newEventTime.trim() || 'All Day',
      type: 'Meeting',
      color: '#104f37',
      textColor: '#ffffff',
    };
    setCalendarEvents([...calendarEvents, newEv]);
    setNewEventTitle('');
    setShowAddEventModal(false);
    Alert.alert('✅ Event Scheduled', `Added "${newEv.title}" on ${MONTH_NAMES[currentMonth - 1]} ${selectedDate}.`);
  };

  // Live Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else if (!isTimerRunning && secondsElapsed !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // GPA calculation
  const calculatedGPA = useMemo(() => {
    const avg = Math.round(hwScore * 0.25 + labScore * 0.25 + examScore * 0.25 + projScore * 0.25);
    if (avg >= 93) return { gpa: '4.0', grade: 'A', label: 'Outstanding', color: '#10b981' };
    if (avg >= 85) return { gpa: '3.5', grade: 'B+', label: 'Very Good', color: '#3b82f6' };
    if (avg >= 75) return { gpa: '3.0', grade: 'B', label: 'Good Standing', color: '#f59e0b' };
    return { gpa: '2.0', grade: 'C', label: 'Needs Focus', color: '#ef4444' };
  }, [hwScore, labScore, examScore, projScore]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const handleOpenSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionUrl('');
    setSubmissionNote('');
    setSubmitModalVisible(true);
  };

  const handleConfirmSubmit = () => {
    if (!submissionUrl.trim()) {
      Alert.alert('Repository Required', 'Please enter your GitHub repository or report link.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setAssignments((prev) =>
        prev.map((item) =>
          item.id === selectedAssignment.id
            ? {
                ...item,
                status: 'submitted',
                similarity: '2% (Verified Clean)',
                submission: {
                  url: submissionUrl,
                  note: submissionNote || 'Completed implementation with test suite.',
                  submittedAt: 'Just now',
                  studentName: 'Alex Morgan',
                },
              }
            : item
        )
      );
      setSubmitting(false);
      setSubmitModalVisible(false);
      Alert.alert('✅ Submitted Successfully', 'Your work has been submitted with a 2% similarity score.');
    }, 900);
  };

  const handleCreateAssignment = () => {
    if (!newAssignTitle.trim()) {
      Alert.alert('Title Required', 'Please enter an assignment title.');
      return;
    }
    const newAssignment = {
      id: String(Date.now()),
      title: newAssignTitle.trim(),
      subject: newAssignSubject.trim() || 'Network Security',
      code: newAssignCode.trim() || 'CS-401',
      instructor: currentRole === 'teacher' ? 'Dr. Sarah Connor' : 'Alex Morgan',
      dueText: newAssignDueDate.trim() || 'Dec 05, 2026',
      dueDate: newAssignDueDate.trim() || 'Dec 05, 2026',
      hoursLeft: 96,
      urgent: false,
      points: Number(newAssignPoints) || 100,
      status: 'pending',
      category: newAssignCategory || 'Programming Lab',
      similarity: '0% (Clean)',
      description: newAssignDesc.trim() || 'Complete requirements and submit report before deadline.',
      submission: null,
    };

    setAssignments([newAssignment, ...assignments]);

    // Also add to calendar events
    setCalendarEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        day: 5,
        title: `${newAssignTitle.trim()} Due`,
        time: '11:59 PM',
        type: 'Assignment',
        color: '#d1fae5',
        textColor: '#065f46',
      },
    ]);

    // Reset form
    setNewAssignTitle('');
    setNewAssignDesc('');
    setCreateAssignmentModalVisible(false);
    Alert.alert('✅ Assignment Created', `"${newAssignment.title}" has been published to course assignments.`);
  };

  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) return;
    const newP = {
      id: Date.now(),
      title: newProjectTitle.trim(),
      due: newProjectDue.trim() || 'Next Week',
      iconText: '✓',
      color: '#10b981',
    };
    setProjectsList([newP, ...projectsList]);
    setNewProjectTitle('');
    setNewProjectDue('');
    setAddProjectModalVisible(false);
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const newM = {
      id: Date.now(),
      name: newMemberName.trim(),
      role: newMemberRole.trim() || 'Sprint Contributor',
      status: 'In Progress',
      color: '#f59e0b',
    };
    setTeamMembers([...teamMembers, newM]);
    setNewMemberName('');
    setNewMemberRole('');
    setAddMemberModalVisible(false);
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const matchFilter = taskFilter === 'all' || item.status === taskFilter;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [assignments, taskFilter, searchQuery]);

  const navigateTo = (tabKey) => {
    setActiveTab(tabKey);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of Assignment Track?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            setDrawerOpen(false);
            setIsLoggedIn(false);
          },
        },
      ]
    );
  };

  const bottomPadding = Math.max(insets.bottom, 16);

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.cardBg} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
            {/* Top Brand Banner */}
            <View style={{ alignItems: 'center', marginBottom: 28 }}>
              <View style={[styles.logoBadge, { width: 56, height: 56, borderRadius: 20, marginBottom: 12 }]}>
                <View style={[styles.logoOuterCircle, { width: 44, height: 44, borderRadius: 14 }]}>
                  <View style={[styles.logoInnerDot, { width: 14, height: 14, borderRadius: 7 }]} />
                </View>
              </View>
              <Text style={{ fontSize: 26, fontWeight: '900', color: colors.textPrimary, letterSpacing: -0.5 }}>
                Assignment Track
              </Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4, textAlign: 'center' }}>
                Plan, prioritize, and accomplish your tasks.
              </Text>
            </View>

            {/* Login Card */}
            <View style={[styles.modalCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder, borderWidth: 1, padding: 20, borderRadius: 24 }]}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 }}>
                Welcome Back
              </Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 18 }}>
                Sign in to your academic workspace
              </Text>

              <Text style={[styles.modalInputLabel, { color: colors.textPrimary }]}>Email Address</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                placeholder="student@smarttracker.edu"
                placeholderTextColor={colors.textMuted}
                value={loginEmail}
                onChangeText={setLoginEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={[styles.modalInputLabel, { color: colors.textPrimary, marginTop: 12 }]}>Password</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setLoginLoading(true);
                  setTimeout(() => {
                    setLoginLoading(false);
                    setIsLoggedIn(true);
                    setActiveTab('dashboard');
                  }, 600);
                }}
                style={[styles.modalSubmitBtn, { backgroundColor: colors.primary, marginTop: 18, width: '100%' }]}
              >
                {loginLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.modalSubmitText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* 1-Click Role Logins */}
              <View style={{ marginTop: 24 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textMuted, textAlign: 'center', letterSpacing: 0.5, marginBottom: 12 }}>
                  OR 1-CLICK DEMO LOGIN
                </Text>

                <View style={{ gap: 8 }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setCurrentRole('student');
                      setLoginEmail('student@smarttracker.edu');
                      setIsLoggedIn(true);
                      setActiveTab('dashboard');
                    }}
                    style={[styles.accountOptionCard, { backgroundColor: colors.badgeBg, borderColor: colors.cardBorder }]}
                  >
                    <Text style={{ fontSize: 20, marginRight: 10 }}>🎓</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.accountTitle, { color: colors.textPrimary }]}>Student Account</Text>
                      <Text style={[styles.accountSub, { color: colors.textSecondary }]}>Alex Morgan • CS-2026</Text>
                    </View>
                    <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 13 }}>Enter →</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setCurrentRole('teacher');
                      setLoginEmail('teacher@smarttracker.edu');
                      setIsLoggedIn(true);
                      setActiveTab('dashboard');
                    }}
                    style={[styles.accountOptionCard, { backgroundColor: colors.badgeBg, borderColor: colors.cardBorder }]}
                  >
                    <Text style={{ fontSize: 20, marginRight: 10 }}>👨‍🏫</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.accountTitle, { color: colors.textPrimary }]}>Teacher Account</Text>
                      <Text style={[styles.accountSub, { color: colors.textSecondary }]}>Dr. Sarah Connor • Faculty</Text>
                    </View>
                    <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 13 }}>Enter →</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setCurrentRole('admin');
                      setLoginEmail('admin@smarttracker.edu');
                      setIsLoggedIn(true);
                      setActiveTab('dashboard');
                    }}
                    style={[styles.accountOptionCard, { backgroundColor: colors.badgeBg, borderColor: colors.cardBorder }]}
                  >
                    <Text style={{ fontSize: 20, marginRight: 10 }}>🛡️</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.accountTitle, { color: colors.textPrimary }]}>System Admin</Text>
                      <Text style={[styles.accountSub, { color: colors.textSecondary }]}>Admin Access</Text>
                    </View>
                    <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 13 }}>Enter →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.cardBg} />

      {/* ========================================================================= */}
      {/* TOP BRAND HEADER */}
      {/* ========================================================================= */}
      <View style={[styles.headerContainer, { backgroundColor: colors.cardBg, borderBottomColor: colors.cardBorder }]}>
        <View style={styles.brandRow}>
          {/* Hamburger Menu Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setDrawerOpen(true)}
            style={[styles.menuBtn, { backgroundColor: colors.badgeBg, borderColor: colors.cardBorder }]}
          >
            <MenuIcon size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Dual Emerald Circle Logo */}
          <View style={styles.logoBadge}>
            <View style={styles.logoOuterCircle}>
              <View style={styles.logoInnerDot} />
            </View>
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>Assignment Track</Text>
          </View>
        </View>

        {/* Header Controls: Role Selector & Dark Mode Toggle */}
        <View style={styles.headerControls}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              const roles = ['student', 'teacher', 'admin'];
              const next = roles[(roles.indexOf(currentRole) + 1) % roles.length];
              setCurrentRole(next);
            }}
            style={[styles.rolePill, { backgroundColor: colors.badgeBg, borderColor: colors.cardBorder }]}
          >
            <Text style={[styles.rolePillText, { color: colors.textPrimary }]}>
              {currentRole === 'student' ? '🎓 Student' : currentRole === 'teacher' ? '👨‍🏫 Faculty' : '🛡️ Admin'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsDarkMode(!isDarkMode)}
            style={[styles.themeToggle, { backgroundColor: colors.badgeBg, borderColor: colors.cardBorder }]}
          >
            <Text style={styles.themeToggleText}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ========================================================================= */}
      {/* MAIN SCROLLABLE CONTENT */}
      {/* ========================================================================= */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 + bottomPadding }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.emerald]} />}
      >
        {/* ----------------------------------------------------------------------- */}
        {/* VIEW 1: ANALYTICS & INSIGHTS (MATCHING WEB 1:1) */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'analytics' && (
          <View style={styles.sectionContainer}>
            {/* Header Title & Timeframe Filters */}
            <View style={styles.dashHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.dashHeaderTitle, { color: colors.textPrimary }]}>Analytics & Insights</Text>
                <Text style={[styles.dashHeaderSub, { color: colors.textSecondary }]}>
                  Real-time project velocity, completion gauges, and GPA predictor.
                </Text>
              </View>
            </View>

            {/* Timeframe Filter Bar & Export Report */}
            <View style={styles.analyticsControlsRow}>
              <View style={[styles.timeframePillGroup, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                {['week', 'month', 'term'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setAnalyticsTimeframe(t)}
                    style={[
                      styles.timeframeBtn,
                      analyticsTimeframe === t && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeframeBtnText,
                        { color: analyticsTimeframe === t ? '#ffffff' : colors.textSecondary },
                      ]}
                    >
                      {t.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Alert.alert('📊 Report Exported', 'Your academic progress report has been compiled and saved.')}
                style={[styles.exportBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.exportBtnText}>📥 Export Report</Text>
              </TouchableOpacity>
            </View>

            {/* 4 Analytics Metric Cards */}
            <View style={styles.kpiGrid}>
              {/* Total Projects */}
              <View style={[styles.kpiCard, { backgroundColor: colors.primary }]}>
                <Text style={styles.kpiCardLabelWhite}>Total Projects</Text>
                <Text style={styles.kpiCardNumberWhite}>24</Text>
                <View style={styles.kpiIncreasePillGreen}>
                  <Text style={styles.kpiIncreaseTextWhite}>▲ 5 from last month</Text>
                </View>
              </View>

              {/* Ended Projects */}
              <View style={[styles.kpiCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <Text style={[styles.kpiCardLabel, { color: colors.textSecondary }]}>Ended Projects</Text>
                <Text style={[styles.kpiCardNumber, { color: colors.textPrimary }]}>10</Text>
                <View style={[styles.kpiIncreasePill, { backgroundColor: colors.badgeBg }]}>
                  <Text style={[styles.kpiIncreaseText, { color: colors.textSecondary }]}>▲ 6 completed</Text>
                </View>
              </View>

              {/* Running Projects */}
              <View style={[styles.kpiCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <Text style={[styles.kpiCardLabel, { color: colors.textSecondary }]}>Running Projects</Text>
                <Text style={[styles.kpiCardNumber, { color: colors.textPrimary }]}>12</Text>
                <View style={[styles.kpiIncreasePill, { backgroundColor: colors.badgeBg }]}>
                  <Text style={[styles.kpiIncreaseText, { color: colors.textSecondary }]}>▲ 2 active</Text>
                </View>
              </View>

              {/* On-Time Submissions */}
              <View style={[styles.kpiCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <Text style={[styles.kpiCardLabel, { color: colors.textSecondary }]}>On-Time Rate</Text>
                <Text style={[styles.kpiCardNumber, { color: colors.textPrimary }]}>96.5%</Text>
                <View style={[styles.kpiIncreasePill, { backgroundColor: colors.emeraldBg }]}>
                  <Text style={[styles.kpiIncreaseText, { color: colors.emerald }]}>★ Honor Standing</Text>
                </View>
              </View>
            </View>

            {/* Weekly Velocity & Hours Logged Chart */}
            <View style={[styles.analyticsCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={[styles.widgetTitle, { color: colors.textPrimary }]}>Weekly Velocity & Hours</Text>
                  <Text style={[styles.widgetSub, { color: colors.textSecondary }]}>Daily breakdown for active sprint</Text>
                </View>
                <View style={[styles.badgeTag, { backgroundColor: colors.emeraldBg, borderColor: colors.emeraldBorder }]}>
                  <Text style={[styles.badgeTagText, { color: colors.emerald }]}>● Live Sync</Text>
                </View>
              </View>

              <View style={styles.chartContainer}>
                <View style={styles.barCol}>
                  <View style={[styles.barPill, { height: 45, backgroundColor: colors.badgeBg }]} />
                  <Text style={[styles.barLabel, { color: colors.textMuted }]}>Sun</Text>
                </View>
                <View style={styles.barCol}>
                  <View style={[styles.barPill, { height: 75, backgroundColor: colors.primary }]} />
                  <Text style={[styles.barLabel, { color: colors.textMuted }]}>Mon</Text>
                </View>
                <View style={styles.barCol}>
                  <View style={styles.tooltipPill}>
                    <Text style={styles.tooltipText}>76%</Text>
                  </View>
                  <View style={[styles.barPill, { height: 110, backgroundColor: colors.emeraldMint }]} />
                  <Text style={[styles.barLabel, { color: colors.textPrimary, fontWeight: '800' }]}>Tue</Text>
                </View>
                <View style={styles.barCol}>
                  <View style={[styles.barPill, { height: 130, backgroundColor: colors.primaryDark }]} />
                  <Text style={[styles.barLabel, { color: colors.textMuted }]}>Wed</Text>
                </View>
                <View style={styles.barCol}>
                  <View style={[styles.barPill, { height: 85, backgroundColor: colors.primary }]} />
                  <Text style={[styles.barLabel, { color: colors.textMuted }]}>Thu</Text>
                </View>
                <View style={styles.barCol}>
                  <View style={[styles.barPill, { height: 60, backgroundColor: colors.badgeBg }]} />
                  <Text style={[styles.barLabel, { color: colors.textMuted }]}>Fri</Text>
                </View>
                <View style={styles.barCol}>
                  <View style={[styles.barPill, { height: 40, backgroundColor: colors.badgeBg }]} />
                  <Text style={[styles.barLabel, { color: colors.textMuted }]}>Sat</Text>
                </View>
              </View>
            </View>

            {/* Overall Completion Ratio Radial Gauge Card */}
            <View style={[styles.gaugeCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={[styles.widgetTitle, { color: colors.textPrimary }]}>Overall Completion Ratio</Text>
              <Text style={[styles.widgetSub, { color: colors.textSecondary }]}>Sprint milestone fulfillment</Text>

              <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 14 }}>
                <Svg width={220} height={130} viewBox="0 0 100 60">
                  {/* Background Track Arc */}
                  <Path
                    d="M 12 52 A 38 38 0 0 1 88 52"
                    fill="none"
                    stroke={isDarkMode ? '#1e293b' : '#e2e8f0'}
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  {/* Progress Indicator Arc (41%) */}
                  <Path
                    d="M 12 52 A 38 38 0 0 1 56 14"
                    fill="none"
                    stroke="#104f37"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </Svg>
                <View style={{ position: 'absolute', bottom: 4, alignItems: 'center' }}>
                  <Text style={[styles.radialPercentText, { color: colors.textPrimary }]}>41%</Text>
                  <Text style={[styles.radialSubText, { color: colors.textSecondary }]}>Project Ended</Text>
                </View>
              </View>

              <View style={[styles.gaugeLegendRow, { borderTopColor: colors.cardBorder }]}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#52b788' }]} />
                  <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>Completed</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#104f37' }]} />
                  <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>In Progress</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#cbd5e1' }]} />
                  <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>Pending</Text>
                </View>
              </View>
            </View>

            {/* Coursework & Subject Distribution Performance Cards */}
            <View style={[styles.subjectDistCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={[styles.widgetTitle, { color: colors.textPrimary }]}>Coursework & Subject Distribution</Text>
              <Text style={[styles.widgetSub, { color: colors.textSecondary, marginBottom: 14 }]}>
                Academic mastery across enrolled modules
              </Text>

              {COURSE_BREAKDOWN.map((item, idx) => (
                <View key={idx} style={[styles.subjectItemCard, { borderBottomColor: colors.cardBorder }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={[styles.subjectItemTitle, { color: colors.textPrimary }]}>{item.course}</Text>
                    <View style={[styles.subjectGradeBadge, { backgroundColor: colors.emeraldBg }]}>
                      <Text style={[styles.subjectGradeText, { color: colors.emerald }]}>{item.grade}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={[styles.subjectItemMeta, { color: colors.textSecondary }]}>{item.tasksCount} tasks • {item.onTime} on-time</Text>
                    <Text style={[styles.subjectItemPercent, { color: colors.textPrimary }]}>{item.progress}%</Text>
                  </View>

                  <View style={[styles.progressTrack, { backgroundColor: colors.badgeBg }]}>
                    <View style={[styles.progressBar, { width: `${item.progress}%`, backgroundColor: colors.primary }]} />
                  </View>
                </View>
              ))}
            </View>

            {/* Live Interactive GPA Predictor */}
            <View style={[styles.gpaDisplayCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={[styles.gpaCardSub, { color: colors.textSecondary }]}>PROJECTED SEMESTER GPA</Text>
              <Text style={[styles.gpaHeroNumber, { color: calculatedGPA.color }]}>{calculatedGPA.gpa}</Text>
              <View style={[styles.gpaGradeBadge, { backgroundColor: calculatedGPA.color + '20' }]}>
                <Text style={[styles.gpaGradeText, { color: calculatedGPA.color }]}>
                  Grade: {calculatedGPA.grade} • {calculatedGPA.label}
                </Text>
              </View>
            </View>

            {/* Score Sliders / Weightage Adjusters */}
            <View style={[styles.scoreAdjustCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={[styles.widgetTitle, { color: colors.textPrimary }]}>Interactive Weightage Tuning</Text>
              <Text style={[styles.widgetSub, { color: colors.textSecondary, marginBottom: 16 }]}>
                Adjust components to calculate your target grade
              </Text>

              {/* Homework */}
              <View style={styles.sliderRow}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={[styles.sliderLabel, { color: colors.textPrimary }]}>Homework & Problem Sets (25%)</Text>
                  <Text style={[styles.sliderValue, { color: colors.emerald }]}>{hwScore}%</Text>
                </View>
                <View style={styles.stepperRow}>
                  <TouchableOpacity
                    onPress={() => setHwScore(Math.max(50, hwScore - 2))}
                    style={[styles.stepperBtn, { backgroundColor: colors.badgeBg }]}
                  >
                    <Text style={[styles.stepperBtnText, { color: colors.textPrimary }]}>- 2%</Text>
                  </TouchableOpacity>
                  <View style={[styles.progressTrack, { backgroundColor: colors.badgeBg }]}>
                    <View style={[styles.progressBar, { width: `${hwScore}%`, backgroundColor: colors.primary }]} />
                  </View>
                  <TouchableOpacity
                    onPress={() => setHwScore(Math.min(100, hwScore + 2))}
                    style={[styles.stepperBtn, { backgroundColor: colors.badgeBg }]}
                  >
                    <Text style={[styles.stepperBtnText, { color: colors.textPrimary }]}>+ 2%</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Labs */}
              <View style={styles.sliderRow}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={[styles.sliderLabel, { color: colors.textPrimary }]}>Laboratory Practical (25%)</Text>
                  <Text style={[styles.sliderValue, { color: colors.emerald }]}>{labScore}%</Text>
                </View>
                <View style={styles.stepperRow}>
                  <TouchableOpacity
                    onPress={() => setLabScore(Math.max(50, labScore - 2))}
                    style={[styles.stepperBtn, { backgroundColor: colors.badgeBg }]}
                  >
                    <Text style={[styles.stepperBtnText, { color: colors.textPrimary }]}>- 2%</Text>
                  </TouchableOpacity>
                  <View style={[styles.progressTrack, { backgroundColor: colors.badgeBg }]}>
                    <View style={[styles.progressBar, { width: `${labScore}%`, backgroundColor: colors.emerald }]} />
                  </View>
                  <TouchableOpacity
                    onPress={() => setLabScore(Math.min(100, labScore + 2))}
                    style={[styles.stepperBtn, { backgroundColor: colors.badgeBg }]}
                  >
                    <Text style={[styles.stepperBtnText, { color: colors.textPrimary }]}>+ 2%</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Midterm & Exams */}
              <View style={styles.sliderRow}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={[styles.sliderLabel, { color: colors.textPrimary }]}>Midterm & Final Exams (25%)</Text>
                  <Text style={[styles.sliderValue, { color: colors.emerald }]}>{examScore}%</Text>
                </View>
                <View style={styles.stepperRow}>
                  <TouchableOpacity
                    onPress={() => setExamScore(Math.max(50, examScore - 2))}
                    style={[styles.stepperBtn, { backgroundColor: colors.badgeBg }]}
                  >
                    <Text style={[styles.stepperBtnText, { color: colors.textPrimary }]}>- 2%</Text>
                  </TouchableOpacity>
                  <View style={[styles.progressTrack, { backgroundColor: colors.badgeBg }]}>
                    <View style={[styles.progressBar, { width: `${examScore}%`, backgroundColor: colors.info }]} />
                  </View>
                  <TouchableOpacity
                    onPress={() => setExamScore(Math.min(100, examScore + 2))}
                    style={[styles.stepperBtn, { backgroundColor: colors.badgeBg }]}
                  >
                    <Text style={[styles.stepperBtnText, { color: colors.textPrimary }]}>+ 2%</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Term Projects */}
              <View style={styles.sliderRow}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={[styles.sliderLabel, { color: colors.textPrimary }]}>Capstone Term Projects (25%)</Text>
                  <Text style={[styles.sliderValue, { color: colors.emerald }]}>{projScore}%</Text>
                </View>
                <View style={styles.stepperRow}>
                  <TouchableOpacity
                    onPress={() => setProjScore(Math.max(50, projScore - 2))}
                    style={[styles.stepperBtn, { backgroundColor: colors.badgeBg }]}
                  >
                    <Text style={[styles.stepperBtnText, { color: colors.textPrimary }]}>- 2%</Text>
                  </TouchableOpacity>
                  <View style={[styles.progressTrack, { backgroundColor: colors.badgeBg }]}>
                    <View style={[styles.progressBar, { width: `${projScore}%`, backgroundColor: colors.warning }]} />
                  </View>
                  <TouchableOpacity
                    onPress={() => setProjScore(Math.min(100, projScore + 2))}
                    style={[styles.stepperBtn, { backgroundColor: colors.badgeBg }]}
                  >
                    <Text style={[styles.stepperBtnText, { color: colors.textPrimary }]}>+ 2%</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VIEW 2: CALENDAR (MATCHING USER SCREENSHOT 1:1 WITH PERFECT ALIGNMENT) */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'calendar' && (
          <View style={styles.sectionContainer}>
            <View style={styles.dashHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.dashHeaderTitle, { color: colors.textPrimary }]}>Calendar</Text>
                <Text style={[styles.dashHeaderSub, { color: colors.textSecondary }]}>
                  Track meetings, submission milestones, and synchronized schedules.
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowAddEventModal(true)}
                style={[styles.addBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.addBtnText}>+ Add Event</Text>
              </TouchableOpacity>
            </View>

            {/* Top 3 Metric Cards */}
            <View style={styles.calendarMetricGrid}>
              <View style={[styles.calMetricCard, { backgroundColor: colors.primary }]}>
                <View style={styles.calMetricTopRow}>
                  <Text style={styles.calMetricLabelWhite}>
                    Total Events ({MONTH_NAMES[currentMonth - 1]})
                  </Text>
                  <View style={styles.calMetricIconCircleWhite}>
                    <Text style={styles.calMetricArrowText}>↗</Text>
                  </View>
                </View>
                <Text style={styles.calMetricNumberWhite}>{calendarEvents.length}</Text>
                <Text style={styles.calMetricSubWhite}>4 upcoming this week</Text>
              </View>

              <View style={[styles.calMetricCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <View style={styles.calMetricTopRow}>
                  <Text style={[styles.calMetricLabel, { color: colors.textPrimary }]}>Scheduled Meetings</Text>
                  <View style={[styles.calMetricIconCircle, { backgroundColor: colors.badgeBg }]}>
                    <Text style={styles.calMetricIconEmoji}>📹</Text>
                  </View>
                </View>
                <Text style={[styles.calMetricNumber, { color: colors.textPrimary }]}>6</Text>
                <Text style={[styles.calMetricSub, { color: colors.textSecondary }]}>Synchronized with Google Meet</Text>
              </View>

              <View style={[styles.calMetricCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <View style={styles.calMetricTopRow}>
                  <Text style={[styles.calMetricLabel, { color: colors.textPrimary }]}>Project Milestones</Text>
                  <View style={[styles.calMetricIconCircle, { backgroundColor: colors.emeraldBg }]}>
                    <Text style={[styles.calMetricIconEmoji, { color: colors.emerald }]}>✓</Text>
                  </View>
                </View>
                <Text style={[styles.calMetricNumber, { color: colors.textPrimary }]}>8</Text>
                <Text style={[styles.calMetricSub, { color: colors.textSecondary }]}>All tasks on track</Text>
              </View>
            </View>

            {/* Monthly Calendar Card Container */}
            <View style={[styles.calendarBoxCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <View style={styles.calBoxHeader}>
                <Text style={[styles.calMonthTitle, { color: colors.textPrimary }]}>
                  {MONTH_NAMES[currentMonth - 1]} {currentYear}
                </Text>

                <View style={styles.calNavButtonsRow}>
                  <TouchableOpacity
                    onPress={handlePrevMonth}
                    style={[styles.calNavBtn, { backgroundColor: colors.badgeBg, borderColor: colors.cardBorder }]}
                  >
                    <Text style={[styles.calNavBtnArrow, { color: colors.textPrimary }]}>‹</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setCurrentMonth(10);
                      setCurrentYear(2026);
                      setSelectedDate(7);
                    }}
                    style={[styles.calTodayBtn, { backgroundColor: colors.badgeBg, borderColor: colors.cardBorder }]}
                  >
                    <Text style={[styles.calTodayBtnText, { color: colors.textPrimary }]}>Today</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleNextMonth}
                    style={[styles.calNavBtn, { backgroundColor: colors.badgeBg, borderColor: colors.cardBorder }]}
                  >
                    <Text style={[styles.calNavBtnArrow, { color: colors.textPrimary }]}>›</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.daysOfWeekRow}>
                {DAYS_OF_WEEK.map((day) => (
                  <View key={day} style={styles.dayOfWeekHeaderCell}>
                    <Text style={[styles.dayOfWeekText, { color: colors.textMuted }]}>{day}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.calendarWeeksContainer}>
                {calendarWeeks.map((week, wIdx) => (
                  <View key={`week-${wIdx}`} style={styles.calendarWeekRow}>
                    {week.map((cell) => {
                      if (cell.isBlank) {
                        return (
                          <View
                            key={cell.key}
                            style={[
                              styles.calCell,
                              styles.calCellBlank,
                              { backgroundColor: isDarkMode ? '#0f172a20' : '#f8fafc' },
                            ]}
                          />
                        );
                      }

                      const isSelected = selectedDate === cell.dayNum;
                      const dayEvents = calendarEvents.filter((e) => e.day === cell.dayNum);

                      return (
                        <TouchableOpacity
                          key={cell.key}
                          activeOpacity={0.7}
                          onPress={() => setSelectedDate(cell.dayNum)}
                          style={[
                            styles.calCell,
                            {
                              backgroundColor: isSelected ? colors.primary : colors.cardBg,
                              borderColor: isSelected ? colors.primary : colors.cardBorder,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayNumText,
                              { color: isSelected ? '#ffffff' : colors.textPrimary },
                              isSelected && { fontWeight: '900' },
                            ]}
                          >
                            {cell.dayNum}
                          </Text>

                          {dayEvents.length > 0 && (
                            <View style={styles.dayEventTagsContainer}>
                              {dayEvents.slice(0, 1).map((ev) => (
                                <View
                                  key={ev.id}
                                  style={[
                                    styles.dayEventTag,
                                    {
                                      backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : ev.color,
                                    },
                                  ]}
                                >
                                  <Text
                                    numberOfLines={1}
                                    style={[
                                      styles.dayEventTagText,
                                      { color: isSelected ? '#ffffff' : ev.textColor },
                                    ]}
                                  >
                                    {ev.title}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>

            {/* Day Schedule Panel */}
            <View style={[styles.dayScheduleCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <View style={styles.dayScheduleHeader}>
                <Text style={[styles.widgetTitle, { color: colors.textPrimary }]}>Day Schedule</Text>
                <View style={[styles.dayPillBadge, { backgroundColor: colors.emeraldBg, borderColor: colors.emeraldBorder }]}>
                  <Text style={[styles.dayPillBadgeText, { color: colors.emerald }]}>
                    {MONTH_NAMES[currentMonth - 1].slice(0, 3)} {selectedDate}
                  </Text>
                </View>
              </View>

              {selectedDayEvents.length > 0 ? (
                <View style={styles.scheduleEventList}>
                  {selectedDayEvents.map((ev) => (
                    <View key={ev.id} style={[styles.scheduleEventItem, { backgroundColor: colors.badgeBg, borderColor: colors.cardBorder }]}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <Text style={[styles.scheduleEventType, { color: colors.primary }]}>{ev.type.toUpperCase()}</Text>
                        <Text style={[styles.scheduleEventTime, { color: colors.textSecondary }]}>🕒 {ev.time}</Text>
                      </View>
                      <Text style={[styles.scheduleEventTitle, { color: colors.textPrimary }]}>{ev.title}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={[styles.emptyScheduleBox, { backgroundColor: colors.badgeBg }]}>
                  <Text style={styles.emptyScheduleIcon}>🗓️</Text>
                  <Text style={[styles.emptyScheduleText, { color: colors.textSecondary }]}>
                    No events scheduled for this day.
                  </Text>
                </View>
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowAddEventModal(true)}
                style={[styles.addDayEventBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.addDayEventBtnText}>+ Add Event for Day {selectedDate}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VIEW 3: DASHBOARD */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <View style={styles.sectionContainer}>
            <View style={styles.dashHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.dashHeaderTitle, { color: colors.textPrimary }]}>Dashboard</Text>
                <Text style={[styles.dashHeaderSub, { color: colors.textSecondary }]}>
                  Plan, prioritize, and accomplish your tasks.
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setCreateAssignmentModalVisible(true)}
                  style={[styles.addBtn, { backgroundColor: colors.badgeBg, borderColor: colors.cardBorder, borderWidth: 1 }]}
                >
                  <Text style={[styles.addBtnText, { color: colors.textPrimary }]}>+ Task</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setAddProjectModalVisible(true)}
                  style={[styles.addBtn, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.addBtnText}>+ Project</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.kpiGrid}>
              <View style={[styles.kpiCard, { backgroundColor: colors.primary }]}>
                <Text style={styles.kpiCardLabelWhite}>Total Projects</Text>
                <Text style={styles.kpiCardNumberWhite}>24</Text>
                <View style={styles.kpiIncreasePillGreen}>
                  <Text style={styles.kpiIncreaseTextWhite}>▲ 5 Increased from last month</Text>
                </View>
              </View>

              <View style={[styles.kpiCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <Text style={[styles.kpiCardLabel, { color: colors.textSecondary }]}>Ended Projects</Text>
                <Text style={[styles.kpiCardNumber, { color: colors.textPrimary }]}>10</Text>
                <View style={[styles.kpiIncreasePill, { backgroundColor: colors.badgeBg }]}>
                  <Text style={[styles.kpiIncreaseText, { color: colors.textSecondary }]}>▲ 6 from last month</Text>
                </View>
              </View>

              <View style={[styles.kpiCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <Text style={[styles.kpiCardLabel, { color: colors.textSecondary }]}>Running Projects</Text>
                <Text style={[styles.kpiCardNumber, { color: colors.textPrimary }]}>12</Text>
                <View style={[styles.kpiIncreasePill, { backgroundColor: colors.badgeBg }]}>
                  <Text style={[styles.kpiIncreaseText, { color: colors.textSecondary }]}>▲ 2 in active sprint</Text>
                </View>
              </View>

              <View style={[styles.kpiCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <Text style={[styles.kpiCardLabel, { color: colors.textSecondary }]}>Pending Review</Text>
                <Text style={[styles.kpiCardNumber, { color: colors.textPrimary }]}>2</Text>
                <View style={[styles.kpiIncreasePill, { backgroundColor: colors.badgeBg }]}>
                  <Text style={[styles.kpiIncreaseText, { color: colors.textSecondary }]}>● On Discuss</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VIEW 4: TASKS / COURSEWORK */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'tasks' && (
          <View style={styles.sectionContainer}>
            <View style={styles.dashHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.dashHeaderTitle, { color: colors.textPrimary }]}>Coursework Tasks</Text>
                <Text style={[styles.dashHeaderSub, { color: colors.textSecondary }]}>
                  Review deadlines, similarity checks, and submit code.
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setCreateAssignmentModalVisible(true)}
                style={[styles.addBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.addBtnText}>+ Create Task</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.searchBox, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={{ fontSize: 14, marginRight: 8, color: colors.textSecondary }}>🔍</Text>
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Search coursework, subject, or code..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
              <View style={styles.filterPillRow}>
                {['all', 'pending', 'submitted', 'graded'].map((filterKey) => (
                  <TouchableOpacity
                    key={filterKey}
                    onPress={() => setTaskFilter(filterKey)}
                    style={[
                      styles.filterPill,
                      {
                        backgroundColor: taskFilter === filterKey ? colors.primary : colors.cardBg,
                        borderColor: taskFilter === filterKey ? colors.primary : colors.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        { color: taskFilter === filterKey ? '#ffffff' : colors.textSecondary },
                      ]}
                    >
                      {filterKey.toUpperCase()} ({assignments.filter((a) => (filterKey === 'all' ? true : a.status === filterKey)).length})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {filteredAssignments.map((item) => (
              <View key={item.id} style={[styles.taskCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <View style={styles.taskCardTop}>
                  <View style={[styles.subjectPill, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.subjectPillText, { color: colors.primary }]}>{item.code} • {item.subject}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor:
                          item.status === 'graded'
                            ? colors.emeraldBg
                            : item.status === 'submitted'
                            ? '#eff6ff'
                            : colors.dangerBg,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        {
                          color:
                            item.status === 'graded'
                              ? colors.emerald
                              : item.status === 'submitted'
                              ? colors.info
                              : colors.danger,
                        },
                      ]}
                    >
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.taskDesc, { color: colors.textSecondary }]}>{item.description}</Text>

                <View style={styles.taskMetaRow}>
                  <Text style={[styles.taskMetaText, { color: item.urgent ? colors.danger : colors.textSecondary }]}>
                    🕒 {item.dueText}
                  </Text>
                  <Text style={[styles.taskMetaText, { color: colors.textSecondary }]}>Points: {item.points}</Text>
                </View>

                {item.status === 'pending' && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleOpenSubmit(item)}
                    style={[styles.submitActionBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={styles.submitActionBtnText}>📤 Submit Coursework</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VIEW 5: TEAM COLLABORATION */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'team' && (
          <View style={styles.sectionContainer}>
            <View style={styles.dashHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.dashHeaderTitle, { color: colors.textPrimary }]}>Team Directory</Text>
                <Text style={[styles.dashHeaderSub, { color: colors.textSecondary }]}>
                  Sprint collaborators, peer reviews, and ownership.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setAddMemberModalVisible(true)}
                style={[styles.addBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.addBtnText}>+ Add Member</Text>
              </TouchableOpacity>
            </View>

            {teamMembers.map((member) => (
              <View key={member.id} style={[styles.teamMemberCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <View style={[styles.avatarRound, { backgroundColor: member.color }]}>
                  <Text style={styles.avatarRoundText}>
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.memberNameLarge, { color: colors.textPrimary }]}>{member.name}</Text>
                  <Text style={[styles.memberRoleLarge, { color: colors.textSecondary }]}>{member.role}</Text>
                </View>
                <View style={[styles.memberStatusBadgeLarge, { backgroundColor: member.color + '20' }]}>
                  <Text style={[styles.memberStatusTextLarge, { color: member.color }]}>{member.status}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VIEW 6: SETTINGS / PROFILE */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <View style={styles.sectionContainer}>
            <View style={[styles.profileHeaderCard, { backgroundColor: colors.primaryDark }]}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>
                  {currentRole === 'student' ? 'AM' : currentRole === 'teacher' ? 'SC' : 'AD'}
                </Text>
              </View>
              <Text style={styles.profileName}>
                {currentRole === 'student'
                  ? 'Alex Morgan'
                  : currentRole === 'teacher'
                  ? 'Dr. Sarah Connor'
                  : 'System Administrator'}
              </Text>
              <Text style={styles.profileEmail}>
                {currentRole === 'student'
                  ? 'student@smarttracker.edu'
                  : currentRole === 'teacher'
                  ? 'teacher@smarttracker.edu'
                  : 'admin@smarttracker.edu'}
              </Text>
            </View>

            <Text style={[styles.sectionHeaderTitle, { color: colors.textPrimary }]}>⚡ 1-Click Role Accounts</Text>
            <View style={styles.accountSwitcherGrid}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setCurrentRole('student');
                  Alert.alert('Switched to Student', 'Signed in as Alex Morgan (student@smarttracker.edu)');
                }}
                style={[
                  styles.accountOptionCard,
                  {
                    backgroundColor: currentRole === 'student' ? colors.primaryLight : colors.cardBg,
                    borderColor: currentRole === 'student' ? colors.emerald : colors.cardBorder,
                  },
                ]}
              >
                <Text style={styles.accountEmoji}>🎓</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.accountTitle, { color: colors.textPrimary }]}>Student Portal</Text>
                  <Text style={[styles.accountSub, { color: colors.textSecondary }]}>student@smarttracker.edu</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setCurrentRole('teacher');
                  Alert.alert('Switched to Faculty', 'Signed in as Dr. Sarah Connor (teacher@smarttracker.edu)');
                }}
                style={[
                  styles.accountOptionCard,
                  {
                    backgroundColor: currentRole === 'teacher' ? colors.primaryLight : colors.cardBg,
                    borderColor: currentRole === 'teacher' ? colors.emerald : colors.cardBorder,
                  },
                ]}
              >
                <Text style={styles.accountEmoji}>👨‍🏫</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.accountTitle, { color: colors.textPrimary }]}>Faculty Portal</Text>
                  <Text style={[styles.accountSub, { color: colors.textSecondary }]}>teacher@smarttracker.edu</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setCurrentRole('admin');
                  Alert.alert('Switched to Admin', 'Signed in as System Administrator (admin@smarttracker.edu)');
                }}
                style={[
                  styles.accountOptionCard,
                  {
                    backgroundColor: currentRole === 'admin' ? colors.primaryLight : colors.cardBg,
                    borderColor: currentRole === 'admin' ? colors.emerald : colors.cardBorder,
                  },
                ]}
              >
                <Text style={styles.accountEmoji}>🛡️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.accountTitle, { color: colors.textPrimary }]}>Admin Suite</Text>
                  <Text style={[styles.accountSub, { color: colors.textSecondary }]}>admin@smarttracker.edu</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogout}
              style={[
                styles.accountOptionCard,
                {
                  backgroundColor: colors.dangerBg,
                  borderColor: '#fecdd3',
                  marginTop: 16,
                  justifyContent: 'center',
                },
              ]}
            >
              <LogoutIcon size={18} color="#e11d48" />
              <Text style={{ color: '#e11d48', fontWeight: '800', marginLeft: 8, fontSize: 14 }}>
                Log Out of Account
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VIEW 7: HELP */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'help' && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.dashHeaderTitle, { color: colors.textPrimary }]}>Help & Support</Text>
            <Text style={[styles.dashHeaderSub, { color: colors.textSecondary }]}>
              Academic guidelines, submission FAQ, and support channels.
            </Text>

            <View style={[styles.featureCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={[styles.featureCardTitle, { color: colors.textPrimary }]}>❓ How do similarity checks work?</Text>
              <Text style={[styles.featureCardDesc, { color: colors.textSecondary, marginTop: 4 }]}>
                The system parses source code and reports, executing an n-gram shingles algorithm to detect overlapping text blocks.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ========================================================================= */}
      {/* NATIVE MOBILE BOTTOM TAB BAR (PERFECT ALIGNMENT - NO OVERLAP) */}
      {/* ========================================================================= */}
      <View
        style={[
          styles.bottomTabBar,
          {
            backgroundColor: colors.tabBarBg,
            borderTopColor: colors.tabBarBorder,
            paddingBottom: bottomPadding,
            height: 56 + bottomPadding,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('dashboard')}
          style={styles.tabItem}
        >
          <GridIcon size={20} color={activeTab === 'dashboard' ? colors.tabActive : colors.tabInactive} />
          <Text
            style={[
              styles.tabLabel,
              {
                color: activeTab === 'dashboard' ? colors.tabActive : colors.tabInactive,
                fontWeight: activeTab === 'dashboard' ? '800' : '600',
              },
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('tasks')}
          style={styles.tabItem}
        >
          <TasksIcon size={20} color={activeTab === 'tasks' ? colors.tabActive : colors.tabInactive} />
          <Text
            style={[
              styles.tabLabel,
              {
                color: activeTab === 'tasks' ? colors.tabActive : colors.tabInactive,
                fontWeight: activeTab === 'tasks' ? '800' : '600',
              },
            ]}
          >
            Tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('calendar')}
          style={styles.tabItem}
        >
          <CalendarIcon size={20} color={activeTab === 'calendar' ? colors.tabActive : colors.tabInactive} />
          <Text
            style={[
              styles.tabLabel,
              {
                color: activeTab === 'calendar' ? colors.tabActive : colors.tabInactive,
                fontWeight: activeTab === 'calendar' ? '800' : '600',
              },
            ]}
          >
            Calendar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('analytics')}
          style={styles.tabItem}
        >
          <AnalyticsIcon size={20} color={activeTab === 'analytics' ? colors.tabActive : colors.tabInactive} />
          <Text
            style={[
              styles.tabLabel,
              {
                color: activeTab === 'analytics' ? colors.tabActive : colors.tabInactive,
                fontWeight: activeTab === 'analytics' ? '800' : '600',
              },
            ]}
          >
            Analytics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setDrawerOpen(true)}
          style={styles.tabItem}
        >
          <MenuIcon size={20} color={colors.tabInactive} />
          <Text style={[styles.tabLabel, { color: colors.tabInactive, fontWeight: '600' }]}>
            Menu
          </Text>
        </TouchableOpacity>
      </View>

      {/* ========================================================================= */}
      {/* EXACT SIDEBAR DRAWER MODAL (LEFT SIDE ANCHORED MATCHING SCREENSHOT 1:1) */}
      {/* ========================================================================= */}
      <Modal visible={drawerOpen} transparent animationType="fade">
        <View style={styles.drawerOverlay}>
          {/* Drawer Content is placed FIRST on the LEFT SIDE */}
          <View style={[styles.drawerContent, { backgroundColor: colors.sidebarBg }]}>
            <View style={styles.drawerHeader}>
              <View style={styles.drawerBrandRow}>
                <View style={styles.drawerLogoBadge}>
                  <View style={styles.drawerLogoOuterCircle}>
                    <View style={styles.drawerLogoInnerDot} />
                  </View>
                </View>
                <View>
                  <Text style={[styles.drawerBrandTitle, { color: colors.textPrimary }]}>Assignment</Text>
                  <Text style={[styles.drawerBrandTitle, { color: colors.textPrimary }]}>Track</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setDrawerOpen(false)}
                style={styles.drawerCloseBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CloseIcon size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View style={styles.drawerSection}>
              <Text style={styles.drawerSectionTitle}>MENU</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigateTo('dashboard')}
                style={[
                  styles.drawerNavItem,
                  activeTab === 'dashboard' && styles.drawerNavItemActive,
                ]}
              >
                <View style={styles.drawerNavLeft}>
                  <View style={styles.drawerIconBox}>
                    <GridIcon size={18} color={activeTab === 'dashboard' ? colors.primary : '#64748b'} />
                  </View>
                  <Text
                    style={[
                      styles.drawerNavLabel,
                      { color: activeTab === 'dashboard' ? colors.textPrimary : '#475569' },
                      activeTab === 'dashboard' && styles.drawerNavLabelActive,
                    ]}
                  >
                    Dashboard
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigateTo('tasks')}
                style={[
                  styles.drawerNavItem,
                  activeTab === 'tasks' && styles.drawerNavItemActive,
                ]}
              >
                <View style={styles.drawerNavLeft}>
                  <View style={styles.drawerIconBox}>
                    <TasksIcon size={18} color={activeTab === 'tasks' ? colors.primary : '#64748b'} />
                  </View>
                  <Text
                    style={[
                      styles.drawerNavLabel,
                      { color: activeTab === 'tasks' ? colors.textPrimary : '#475569' },
                      activeTab === 'tasks' && styles.drawerNavLabelActive,
                    ]}
                  >
                    Tasks
                  </Text>
                </View>
                <View style={styles.tasksBadge}>
                  <Text style={styles.tasksBadgeText}>12+</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigateTo('calendar')}
                style={[
                  styles.drawerNavItem,
                  activeTab === 'calendar' && styles.drawerNavItemActive,
                ]}
              >
                <View style={styles.drawerNavLeft}>
                  <View style={styles.drawerIconBox}>
                    <CalendarIcon size={18} color={activeTab === 'calendar' ? colors.primary : '#64748b'} />
                  </View>
                  <Text
                    style={[
                      styles.drawerNavLabel,
                      { color: activeTab === 'calendar' ? colors.textPrimary : '#475569' },
                      activeTab === 'calendar' && styles.drawerNavLabelActive,
                    ]}
                  >
                    Calendar
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigateTo('analytics')}
                style={[
                  styles.drawerNavItem,
                  activeTab === 'analytics' && styles.drawerNavItemActive,
                ]}
              >
                <View style={styles.drawerNavLeft}>
                  <View style={styles.drawerIconBox}>
                    <AnalyticsIcon size={18} color={activeTab === 'analytics' ? colors.primary : '#64748b'} />
                  </View>
                  <Text
                    style={[
                      styles.drawerNavLabel,
                      { color: activeTab === 'analytics' ? colors.textPrimary : '#475569' },
                      activeTab === 'analytics' && styles.drawerNavLabelActive,
                    ]}
                  >
                    Analytics
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigateTo('team')}
                style={[
                  styles.drawerNavItem,
                  activeTab === 'team' && styles.drawerNavItemActive,
                ]}
              >
                <View style={styles.drawerNavLeft}>
                  <View style={styles.drawerIconBox}>
                    <TeamIcon size={18} color={activeTab === 'team' ? colors.primary : '#64748b'} />
                  </View>
                  <Text
                    style={[
                      styles.drawerNavLabel,
                      { color: activeTab === 'team' ? colors.textPrimary : '#475569' },
                      activeTab === 'team' && styles.drawerNavLabelActive,
                    ]}
                  >
                    Team
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.drawerSection, { marginTop: 16 }]}>
              <Text style={styles.drawerSectionTitle}>GENERAL</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigateTo('settings')}
                style={[
                  styles.drawerNavItem,
                  activeTab === 'settings' && styles.drawerNavItemActive,
                ]}
              >
                <View style={styles.drawerNavLeft}>
                  <View style={styles.drawerIconBox}>
                    <SettingsIcon size={18} color={activeTab === 'settings' ? colors.primary : '#64748b'} />
                  </View>
                  <Text
                    style={[
                      styles.drawerNavLabel,
                      { color: activeTab === 'settings' ? colors.textPrimary : '#475569' },
                      activeTab === 'settings' && styles.drawerNavLabelActive,
                    ]}
                  >
                    Settings
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigateTo('help')}
                style={[
                  styles.drawerNavItem,
                  activeTab === 'help' && styles.drawerNavItemActive,
                ]}
              >
                <View style={styles.drawerNavLeft}>
                  <View style={styles.drawerIconBox}>
                    <HelpIcon size={18} color={activeTab === 'help' ? colors.primary : '#64748b'} />
                  </View>
                  <Text
                    style={[
                      styles.drawerNavLabel,
                      { color: activeTab === 'help' ? colors.textPrimary : '#475569' },
                      activeTab === 'help' && styles.drawerNavLabelActive,
                    ]}
                  >
                    Help
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleLogout}
                style={[styles.drawerNavItem, styles.logoutNavItem]}
              >
                <View style={styles.drawerNavLeft}>
                  <View style={styles.drawerIconBox}>
                    <LogoutIcon size={18} color="#e11d48" />
                  </View>
                  <Text style={styles.logoutNavLabel}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Backdrop Tap to Dismiss on the RIGHT SIDE */}
          <TouchableOpacity
            style={styles.drawerBackdropDismiss}
            activeOpacity={1}
            onPress={() => setDrawerOpen(false)}
          />
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* ADD CALENDAR EVENT MODAL */}
      {/* ========================================================================= */}
      <Modal visible={showAddEventModal} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Add Calendar Event</Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              Schedule for {MONTH_NAMES[currentMonth - 1]} {selectedDate}, {currentYear}
            </Text>

            <Text style={[styles.modalInputLabel, { color: colors.textPrimary }]}>Event Title</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
              placeholder="e.g. Meeting with Arc Company"
              placeholderTextColor={colors.textMuted}
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />

            <Text style={[styles.modalInputLabel, { color: colors.textPrimary }]}>Time Range</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
              placeholder="e.g. 02:00 PM - 04:00 PM"
              placeholderTextColor={colors.textMuted}
              value={newEventTime}
              onChangeText={setNewEventTime}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                onPress={() => setShowAddEventModal(false)}
                style={[styles.modalCancelBtn, { backgroundColor: colors.badgeBg }]}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddCalendarEvent}
                style={[styles.modalSubmitBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.modalSubmitText}>Save Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ========================================================================= */}
      {/* SUBMISSION MODAL */}
      {/* ========================================================================= */}
      <Modal visible={submitModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Submit Coursework</Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>{selectedAssignment?.title}</Text>

            <Text style={[styles.modalInputLabel, { color: colors.textPrimary }]}>Repository / File URL</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
              placeholder="https://github.com/username/project-repo"
              placeholderTextColor={colors.textMuted}
              value={submissionUrl}
              onChangeText={setSubmissionUrl}
            />

            <Text style={[styles.modalInputLabel, { color: colors.textPrimary }]}>Submission Note / Comments</Text>
            <TextInput
              style={[styles.modalInputMulti, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
              placeholder="Briefly describe key implementation highlights..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              value={submissionNote}
              onChangeText={setSubmissionNote}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                onPress={() => setSubmitModalVisible(false)}
                style={[styles.modalCancelBtn, { backgroundColor: colors.badgeBg }]}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmSubmit}
                disabled={submitting}
                style={[styles.modalSubmitBtn, { backgroundColor: colors.primary }]}
              >
                {submitting ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.modalSubmitText}>Confirm Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ========================================================================= */}
      {/* ADD PROJECT MODAL */}
      {/* ========================================================================= */}
      <Modal visible={addProjectModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Add New Sprint Project</Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>Create a tracked task milestone</Text>

            <Text style={[styles.modalInputLabel, { color: colors.textPrimary }]}>Project Title</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
              placeholder="e.g. Implement OAuth Flow"
              placeholderTextColor={colors.textMuted}
              value={newProjectTitle}
              onChangeText={setNewProjectTitle}
            />

            <Text style={[styles.modalInputLabel, { color: colors.textPrimary }]}>Due Date</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
              placeholder="e.g. Dec 10, 2026"
              placeholderTextColor={colors.textMuted}
              value={newProjectDue}
              onChangeText={setNewProjectDue}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                onPress={() => setAddProjectModalVisible(false)}
                style={[styles.modalCancelBtn, { backgroundColor: colors.badgeBg }]}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreateProject}
                style={[styles.modalSubmitBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.modalSubmitText}>Create Project</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ========================================================================= */}
      {/* ADD MEMBER MODAL */}
      {/* ========================================================================= */}
      <Modal visible={addMemberModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Add Team Member</Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>Invite a peer or group contributor</Text>

            <Text style={[styles.modalInputLabel, { color: colors.textPrimary }]}>Full Name</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
              placeholder="e.g. Maya Lin"
              placeholderTextColor={colors.textMuted}
              value={newMemberName}
              onChangeText={setNewMemberName}
            />

            <Text style={[styles.modalInputLabel, { color: colors.textPrimary }]}>Role / Task Assignment</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
              placeholder="e.g. Frontend UI / Jest Testing"
              placeholderTextColor={colors.textMuted}
              value={newMemberRole}
              onChangeText={setNewMemberRole}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                onPress={() => setAddMemberModalVisible(false)}
                style={[styles.modalCancelBtn, { backgroundColor: colors.badgeBg }]}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddMember}
                style={[styles.modalSubmitBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.modalSubmitText}>Add Member</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ========================================================================= */}
      {/* CREATE ASSIGNMENT / COURSEWORK MODAL */}
      {/* ========================================================================= */}
      <Modal visible={createAssignmentModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBg, maxHeight: '90%' }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Create Coursework</Text>
              <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
                Publish new assignment task with automatic calendar sync
              </Text>

              {/* Assignment Title */}
              <Text style={[styles.modalInputLabel, { color: colors.textPrimary }]}>Assignment Title *</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                placeholder="e.g. Consensus Algorithms & Raft Implementation"
                placeholderTextColor={colors.textMuted}
                value={newAssignTitle}
                onChangeText={setNewAssignTitle}
              />

              {/* Subject Selector Chips */}
              <Text style={[styles.modalInputLabel, { color: colors.textPrimary, marginTop: 12 }]}>Course & Subject</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 4 }}>
                {[
                  { code: 'CS-401', name: 'Network Security' },
                  { code: 'CS-302', name: 'Database Systems' },
                  { code: 'CS-201', name: 'Data Structures' },
                  { code: 'AI-401', name: 'Computer Vision' },
                ].map((item) => {
                  const isSelected = newAssignCode === item.code;
                  return (
                    <TouchableOpacity
                      key={item.code}
                      onPress={() => {
                        setNewAssignCode(item.code);
                        setNewAssignSubject(item.name);
                      }}
                      style={[
                        styles.filterPill,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.badgeBg,
                          borderColor: isSelected ? colors.primary : colors.cardBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterPillText,
                          { color: isSelected ? '#ffffff' : colors.textSecondary },
                        ]}
                      >
                        {item.code} • {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Category Chips */}
              <Text style={[styles.modalInputLabel, { color: colors.textPrimary, marginTop: 12 }]}>Category</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 4 }}>
                {['Programming Lab', 'Lab Report', 'Problem Set', 'Project Milestone'].map((cat) => {
                  const isSelected = newAssignCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setNewAssignCategory(cat)}
                      style={[
                        styles.filterPill,
                        {
                          backgroundColor: isSelected ? colors.emerald : colors.badgeBg,
                          borderColor: isSelected ? colors.emerald : colors.cardBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterPillText,
                          { color: isSelected ? '#ffffff' : colors.textSecondary },
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Deadline & Points Row */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.modalInputLabel, { color: colors.textPrimary }]}>Deadline</Text>
                  <TextInput
                    style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                    placeholder="e.g. Dec 05, 2026"
                    placeholderTextColor={colors.textMuted}
                    value={newAssignDueDate}
                    onChangeText={setNewAssignDueDate}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalInputLabel, { color: colors.textPrimary }]}>Points</Text>
                  <TextInput
                    style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                    placeholder="100"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    value={newAssignPoints}
                    onChangeText={setNewAssignPoints}
                  />
                </View>
              </View>

              {/* Description */}
              <Text style={[styles.modalInputLabel, { color: colors.textPrimary, marginTop: 12 }]}>
                Description & Instructions
              </Text>
              <TextInput
                style={[styles.modalInputMulti, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                placeholder="Specify submission requirements, benchmark metrics, or deliverables..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                value={newAssignDesc}
                onChangeText={setNewAssignDesc}
              />

              <View style={[styles.modalBtnRow, { marginTop: 16 }]}>
                <TouchableOpacity
                  onPress={() => setCreateAssignmentModalVisible(false)}
                  style={[styles.modalCancelBtn, { backgroundColor: colors.badgeBg }]}
                >
                  <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCreateAssignment}
                  style={[styles.modalSubmitBtn, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.modalSubmitText}>Publish Coursework</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoOuterCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInnerDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10b981',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  themeToggle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleText: {
    fontSize: 15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  sectionContainer: {
    paddingHorizontal: 16,
  },
  dashHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dashHeaderTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  dashHeaderSub: {
    fontSize: 13,
    marginTop: 2,
  },
  analyticsControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  timeframePillGroup: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    padding: 3,
  },
  timeframeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timeframeBtnText: {
    fontSize: 10,
    fontWeight: '800',
  },
  exportBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
  },
  exportBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  gaugeCard: {
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  gaugeCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  radialCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    borderColor: '#104f37',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfdf5',
  },
  radialPercentText: {
    fontSize: 32,
    fontWeight: '900',
  },
  radialSubText: {
    fontSize: 11,
    fontWeight: '700',
  },
  gaugeLegendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  subjectDistCard: {
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  subjectItemCard: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  subjectItemTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  subjectGradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subjectGradeText: {
    fontSize: 11,
    fontWeight: '900',
  },
  subjectItemMeta: {
    fontSize: 11,
  },
  subjectItemPercent: {
    fontSize: 11,
    fontWeight: '800',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    shadowColor: '#104f37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  calendarMetricGrid: {
    gap: 12,
    marginBottom: 16,
  },
  calMetricCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
  },
  calMetricTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calMetricLabelWhite: {
    color: '#d1fae5',
    fontSize: 13,
    fontWeight: '700',
  },
  calMetricIconCircleWhite: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calMetricArrowText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  calMetricNumberWhite: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
  },
  calMetricSubWhite: {
    color: '#a7f3d0',
    fontSize: 12,
    marginTop: 4,
  },
  calMetricLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  calMetricIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calMetricIconEmoji: {
    fontSize: 14,
    fontWeight: '800',
  },
  calMetricNumber: {
    fontSize: 34,
    fontWeight: '900',
  },
  calMetricSub: {
    fontSize: 12,
    marginTop: 4,
  },
  calendarBoxCard: {
    padding: 14,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  calBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calMonthTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  calNavButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calNavBtnArrow: {
    fontSize: 16,
    fontWeight: '800',
  },
  calTodayBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  calTodayBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  daysOfWeekRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 8,
  },
  dayOfWeekHeaderCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  dayOfWeekText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  calendarWeeksContainer: {
    gap: 5,
  },
  calendarWeekRow: {
    flexDirection: 'row',
    gap: 5,
  },
  calCell: {
    flex: 1,
    height: 64,
    padding: 3,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  calCellBlank: {
    borderWidth: 0,
  },
  dayNumText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 2,
    marginTop: 1,
  },
  dayEventTagsContainer: {
    width: '100%',
  },
  dayEventTag: {
    width: '100%',
    paddingHorizontal: 2,
    paddingVertical: 1.5,
    borderRadius: 3,
  },
  dayEventTagText: {
    fontSize: 7.5,
    fontWeight: '800',
  },
  dayScheduleCard: {
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  dayScheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dayPillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  dayPillBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  scheduleEventList: {
    gap: 10,
    marginBottom: 16,
  },
  scheduleEventItem: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  scheduleEventType: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scheduleEventTime: {
    fontSize: 11,
  },
  scheduleEventTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  emptyScheduleBox: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 18,
    marginBottom: 16,
  },
  emptyScheduleIcon: {
    fontSize: 28,
    marginBottom: 6,
    opacity: 0.6,
  },
  emptyScheduleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addDayEventBtn: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  addDayEventBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  kpiCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  kpiCardLabelWhite: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
  },
  kpiCardNumberWhite: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    marginVertical: 4,
  },
  kpiIncreasePillGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  kpiIncreaseTextWhite: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  kpiCardLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  kpiCardNumber: {
    fontSize: 28,
    fontWeight: '900',
    marginVertical: 4,
  },
  kpiIncreasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  kpiIncreaseText: {
    fontSize: 10,
    fontWeight: '700',
  },
  analyticsCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  widgetSub: {
    fontSize: 12,
    marginTop: 2,
  },
  badgeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    marginTop: 20,
    paddingHorizontal: 8,
  },
  barCol: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - 100) / 7,
  },
  barPill: {
    width: 22,
    borderRadius: 11,
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  tooltipPill: {
    backgroundColor: '#104f37',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  tooltipText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 13,
  },
  filterPillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  taskCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
  },
  taskCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subjectPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  subjectPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  taskDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  taskMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  taskMetaText: {
    fontSize: 11,
  },
  submitActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
  },
  submitActionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  gpaDisplayCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  gpaCardSub: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  gpaHeroNumber: {
    fontSize: 54,
    fontWeight: '900',
    letterSpacing: -1,
    marginVertical: 6,
  },
  gpaGradeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  gpaGradeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  scoreAdjustCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 16,
  },
  sliderRow: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  sliderValue: {
    fontSize: 12,
    fontWeight: '900',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  stepperBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  teamMemberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  avatarRound: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRoundText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  memberNameLarge: {
    fontSize: 14,
    fontWeight: '800',
  },
  memberRoleLarge: {
    fontSize: 12,
    marginTop: 2,
  },
  memberStatusBadgeLarge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  memberStatusTextLarge: {
    fontSize: 11,
    fontWeight: '800',
  },
  profileHeaderCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    marginBottom: 20,
  },
  avatarLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLargeText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  profileName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  profileEmail: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 12,
  },
  accountSwitcherGrid: {
    gap: 10,
    marginBottom: 20,
  },
  accountOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  accountEmoji: {
    fontSize: 22,
  },
  accountTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  accountSub: {
    fontSize: 11,
    marginTop: 2,
  },
  featureCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  featureCardTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  featureCardDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
    letterSpacing: -0.2,
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    flexDirection: 'row',
  },
  drawerBackdropDismiss: {
    flex: 1,
  },
  drawerContent: {
    width: Math.min(SCREEN_WIDTH * 0.78, 300),
    height: '100%',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 24,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  drawerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerLogoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerLogoOuterCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.8,
    borderColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerLogoInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  drawerBrandTitle: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
    letterSpacing: -0.4,
  },
  drawerCloseBtn: {
    padding: 6,
  },
  drawerSection: {
    marginBottom: 8,
  },
  drawerSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  drawerNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 4,
  },
  drawerNavItemActive: {
    backgroundColor: '#f1f5f9',
  },
  drawerNavLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerIconBox: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerNavLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  drawerNavLabelActive: {
    fontWeight: '800',
  },
  tasksBadge: {
    backgroundColor: '#104f37',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 12,
  },
  tasksBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  logoutNavItem: {
    marginTop: 4,
    backgroundColor: '#fff1f2',
  },
  logoutNavLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#e11d48',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  modalSub: {
    fontSize: 12,
    marginBottom: 10,
  },
  modalInputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
  },
  modalInput: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
  },
  modalInputMulti: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 70,
    textAlignVertical: 'top',
    fontSize: 13,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalSubmitBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
