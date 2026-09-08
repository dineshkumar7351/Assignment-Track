import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import BaseLayout from './layouts/BaseLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// Dashboards & Profile
import DashboardRouter from './pages/DashboardRouter';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import ComingSoonPage from './pages/ComingSoonPage';

// Assignment Management Pages
import TeacherAssignmentsPage from './pages/teacher/TeacherAssignmentsPage';
import TeacherAssignmentFormPage from './pages/teacher/TeacherAssignmentFormPage';
import TeacherAssignmentDetailPage from './pages/teacher/TeacherAssignmentDetailPage';
import TeacherSubmissionsPage from './pages/teacher/TeacherSubmissionsPage';
import TeacherPlagiarismPage from './pages/teacher/TeacherPlagiarismPage';
import TeacherSimilarityComparePage from './pages/teacher/TeacherSimilarityComparePage';
import StudentAssignmentsPage from './pages/student/StudentAssignmentsPage';
import StudentAssignmentDetailPage from './pages/student/StudentAssignmentDetailPage';
import StudentSubmitPage from './pages/student/StudentSubmitPage';

// Calendar & Notification Pages (Section 10)
import CalendarPage from './pages/CalendarPage';
import NotificationsPage from './pages/NotificationsPage';

// Analytics & Smart Features (Section 11)
import AnalyticsPage from './pages/AnalyticsPage';

// AI Assistant & Admin Suite (Section 12)
import AiAssistantPage from './pages/AiAssistantPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSubjectsPage from './pages/admin/AdminSubjectsPage';
import AdminAssignmentsPage from './pages/admin/AdminAssignmentsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import ClerkProviderWrapper from './context/ClerkProviderWrapper';

function App() {
  return (
    <ErrorBoundary>
      <ClerkProviderWrapper>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
            <Routes>
              {/* Public Website Layout */}
              <Route path="/" element={<BaseLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="unauthorized" element={<UnauthorizedPage />} />
              </Route>

              {/* Smart Dashboard Router */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />

              {/* Direct Student Assignments Routes (/assignments and /assignments/:id) */}
              <Route
                path="/assignments"
                element={
                  <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<StudentAssignmentsPage />} />
                <Route path=":id" element={<StudentAssignmentDetailPage />} />
                <Route path=":id/submit" element={<StudentSubmitPage />} />
              </Route>

              {/* Direct Calendar & Notification & Analytics Routes */}
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<CalendarPage />} />
              </Route>

              <Route
                path="/notifications"
                element={
                  <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<NotificationsPage />} />
              </Route>

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AnalyticsPage />} />
              </Route>

              <Route
                path="/ai-assistant"
                element={
                  <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AiAssistantPage />} />
              </Route>

              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ProfilePage />} />
              </Route>

              {/* Student Role Application Section */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/student/dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="assignments" element={<StudentAssignmentsPage />} />
                <Route path="assignments/:id" element={<StudentAssignmentDetailPage />} />
                <Route path="assignments/:id/submit" element={<StudentSubmitPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="ai-assistant" element={<AiAssistantPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Teacher Role Application Section */}
              <Route
                path="/teacher"
                element={
                  <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/teacher/dashboard" replace />} />
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="assignments" element={<TeacherAssignmentsPage />} />
                <Route path="assignments/create" element={<TeacherAssignmentFormPage />} />
                <Route path="assignments/:id" element={<TeacherAssignmentDetailPage />} />
                <Route path="assignments/:id/edit" element={<TeacherAssignmentFormPage />} />
                <Route path="submissions" element={<TeacherSubmissionsPage />} />
                <Route path="plagiarism" element={<TeacherPlagiarismPage />} />
                <Route path="plagiarism/compare/:id1/:id2" element={<TeacherSimilarityComparePage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="ai-assistant" element={<AiAssistantPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Administrator Role Application Section */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="ai-assistant" element={<AiAssistantPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="subjects" element={<AdminSubjectsPage />} />
                <Route path="assignments" element={<AdminAssignmentsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ClerkProviderWrapper>
  </ErrorBoundary>
  );
}

export default App;
