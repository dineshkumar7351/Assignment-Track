import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CheckSquare,
  TrendingUp,
  ArrowRight,
  GraduationCap,
  Users,
  ShieldCheck,
  Clock,
  BookOpen
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="space-y-16 sm:space-y-24 py-10 sm:py-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Management Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 uppercase sm:leading-tight mb-6">
            Smart Assignment Tracker
          </h1>

          {/* Core Value Statements */}
          <div className="space-y-1.5 sm:space-y-2 text-lg sm:text-xl font-medium text-slate-600 mb-10">
            <p className="flex items-center justify-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
              <span>Plan your assignments.</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span>Track your deadlines.</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Improve your academic performance.</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-xl shadow-xs transition-colors"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 text-base font-semibold rounded-xl border border-slate-300 shadow-xs transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Role Cards: Students, Teachers, Administrators */}
      <section id="roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Designed for the Entire Campus
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            A single unified workspace connecting students, instructors, and campus administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Students Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:border-indigo-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Students</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Never miss a deadline. View assignments across all subjects, manage your study schedule, and submit coursework on time.
            </p>
            <ul className="space-y-2 text-xs font-medium text-slate-500">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Personalized assignment calendar
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Deadline reminders & tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Submission history & grades
              </li>
            </ul>
          </div>

          {/* Teachers Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:border-indigo-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Teachers</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Create, distribute, and grade assignments effortlessly. Maintain transparent grading criteria and provide timely student feedback.
            </p>
            <ul className="space-y-2 text-xs font-medium text-slate-500">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Structured assignment publishing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Batch grading & evaluation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Cohort performance insights
              </li>
            </ul>
          </div>

          {/* Administrators Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:border-indigo-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Administrators</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Maintain institutional standards, manage departmental accounts, oversee academic calendars, and ensure operational integrity.
            </p>
            <ul className="space-y-2 text-xs font-medium text-slate-500">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Role & permission governance
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Department-level management
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Campus-wide academic metrics
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Platform Features Overview */}
      <section id="overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Built for Modern Higher Education
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              Smart Assignment Tracker provides colleges and universities with an intuitive platform to streamline assignment workflows, elevate institutional accountability, and empower student success.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Centralized Schedule</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Single source of truth for all course due dates.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Streamlined Submissions</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Simple submission workflow for every student.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
