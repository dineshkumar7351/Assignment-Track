const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Subject = require('../models/Subject');

/**
 * Multi-factor Deadline Risk Engine
 * Calculates risk level (Low, Medium, High, Critical) and risk score for an assignment
 */
function calculateDeadlineRisk(assignment, submission, now = new Date()) {
  const deadline = new Date(assignment.deadline);
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  // If already submitted and graded or submitted on time
  if (submission && ['submitted', 'graded'].includes(submission.status)) {
    return {
      level: 'Completed',
      color: 'emerald',
      score: 0,
      hoursRemaining: Math.round(diffHours),
      reason: 'Deliverable has already been submitted',
    };
  }

  // If overdue
  if (diffHours < 0) {
    return {
      level: 'Critical',
      color: 'rose',
      score: 100,
      hoursRemaining: Math.round(diffHours),
      reason: `Overdue by ${Math.abs(Math.round(diffHours))} hours`,
    };
  }

  // 1. Time urgency score (0 - 90)
  let timeScore = 10;
  if (diffHours <= 12) {
    timeScore = 90;
  } else if (diffHours <= 24) {
    timeScore = 75;
  } else if (diffHours <= 48) {
    timeScore = 55;
  } else if (diffHours <= 120) {
    // 5 days
    timeScore = 30;
  }

  // 2. Difficulty multiplier
  const difficultyMap = {
    easy: 0.9,
    medium: 1.1,
    hard: 1.35,
  };
  const diffMultiplier = difficultyMap[assignment.difficulty?.toLowerCase()] || 1.0;

  // 3. Priority multiplier
  const priorityMap = {
    low: 0.85,
    medium: 1.0,
    high: 1.25,
    urgent: 1.45,
  };
  const priorityMultiplier = priorityMap[assignment.priority?.toLowerCase()] || 1.0;

  // 4. Marks impact factor (higher marks = higher risk if missed)
  const maxMarks = assignment.maxMarks || assignment.totalMarks || 100;
  const marksFactor = Math.min(1.2, Math.max(0.8, maxMarks / 100));

  // Compute final risk score (0 - 100 capped)
  const rawScore = timeScore * diffMultiplier * priorityMultiplier * marksFactor;
  const riskScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  let level = 'Low';
  let color = 'emerald';

  if (riskScore >= 75 || diffHours <= 18) {
    level = 'Critical';
    color = 'rose';
  } else if (riskScore >= 55 || diffHours <= 36) {
    level = 'High';
    color = 'amber';
  } else if (riskScore >= 30 || diffHours <= 72) {
    level = 'Medium';
    color = 'sky';
  }

  return {
    level,
    color,
    score: riskScore,
    hoursRemaining: Math.round(diffHours),
    diffHours,
    reason: `Due in ${Math.round(diffHours)}h • ${assignment.difficulty || 'Medium'} difficulty • ${assignment.priority || 'Normal'} priority`,
  };
}

/**
 * Deterministic "What Should I Do Now?" Recommendation Engine
 */
function getWhatShouldIDoNowRecommendation(pendingAssignmentsWithRisk) {
  if (!pendingAssignmentsWithRisk || pendingAssignmentsWithRisk.length === 0) {
    return {
      hasRecommendation: false,
      message: 'All caught up! You have no pending assignments.',
      recommendation: null,
    };
  }

  // Deterministic ranking formula:
  // Ranking Score = Risk Score (0-100) + (MaxMarks * 0.25) + Priority Weight + (Overdue penalty boost)
  const ranked = [...pendingAssignmentsWithRisk].map((item) => {
    const { assignment, risk } = item;
    const maxMarks = assignment.maxMarks || assignment.totalMarks || 100;
    let priorityBonus = 0;
    if (assignment.priority === 'urgent') priorityBonus = 25;
    if (assignment.priority === 'high') priorityBonus = 15;
    if (assignment.priority === 'medium') priorityBonus = 5;

    let difficultyHoursEstimate = 3;
    if (assignment.difficulty === 'hard') difficultyHoursEstimate = 5;
    if (assignment.difficulty === 'easy') difficultyHoursEstimate = 1.5;

    // Deterministic composite priority
    const compositeScore = risk.score + maxMarks * 0.2 + priorityBonus;

    return {
      assignment,
      risk,
      compositeScore,
      estimatedHours: difficultyHoursEstimate,
    };
  });

  // Sort descending by composite score
  ranked.sort((a, b) => b.compositeScore - a.compositeScore);

  const top = ranked[0];
  const { assignment, risk, estimatedHours } = top;
  const maxMarks = assignment.maxMarks || assignment.totalMarks || 100;

  let timeText = '';
  const roundedHours = Math.round(risk.hoursRemaining);
  if (roundedHours < 0) {
    timeText = `Overdue by ${Math.abs(roundedHours)} hours`;
  } else if (roundedHours < 24) {
    timeText = `Due in ${roundedHours} hours`;
  } else {
    const days = Math.round(roundedHours / 24);
    timeText = `Due in ${days} ${days === 1 ? 'day' : 'days'}`;
  }

  const reasons = [
    timeText,
    `${maxMarks} marks total value`,
    `${assignment.priority ? assignment.priority.toUpperCase() : 'MEDIUM'} priority coursework`,
    `${assignment.difficulty ? assignment.difficulty.toUpperCase() : 'MEDIUM'} complexity level`,
    `Estimated remaining focus time: ~${estimatedHours} hours`,
  ];

  return {
    hasRecommendation: true,
    recommendation: {
      assignmentId: assignment._id,
      title: assignment.title,
      subject: assignment.subjectId?.name || assignment.subject || 'Academic Subject',
      subjectCode: assignment.subjectId?.code || '',
      deadline: assignment.deadline,
      maxMarks,
      priority: assignment.priority || 'medium',
      difficulty: assignment.difficulty || 'medium',
      riskLevel: risk.level,
      riskScore: risk.score,
      estimatedRemainingHours: estimatedHours,
      reasons,
      actionUrl: `/student/assignments/${assignment._id}/submit`,
    },
  };
}

/**
 * Calculate Student Analytics and Academic Health Score
 */
async function getStudentAnalytics(studentId, department = 'Computer Science & Engineering') {
  const now = new Date();
  const deptPrefix = department.split(/[\s,&]+/)[0];

  // 1. Fetch published assignments for the student's department
  const assignments = await Assignment.find({
    status: 'published',
    $or: [
      { department: department },
      { department: { $regex: new RegExp(`^${deptPrefix}`, 'i') } },
      { department: 'General' },
    ],
  })
    .populate('subjectId', 'name code')
    .populate('teacherId', 'fullName email')
    .sort({ deadline: 1 })
    .lean();

  const assignmentIds = assignments.map((a) => a._id);

  // 2. Fetch all submissions by student
  const submissions = await Submission.find({
    student: studentId,
    assignment: { $in: assignmentIds },
  })
    .populate('assignment', 'title maxMarks passingMarks deadline subjectId subject')
    .lean();

  const submissionMap = new Map();
  submissions.forEach((s) => {
    submissionMap.set(s.assignment._id ? s.assignment._id.toString() : s.assignment.toString(), s);
  });

  const totalAssigned = assignments.length;
  let submittedCount = 0;
  let onTimeCount = 0;
  let lateCount = 0;
  let overdueCount = 0;
  let gradedCount = 0;
  let totalMarksEarned = 0;
  let totalMaxMarksGraded = 0;

  const pendingList = [];

  assignments.forEach((a) => {
    const sub = submissionMap.get(a._id.toString());
    const deadline = new Date(a.deadline);

    if (sub) {
      submittedCount++;
      const isLate = sub.isLate || (sub.submittedAt && new Date(sub.submittedAt) > deadline);
      if (isLate) {
        lateCount++;
      } else {
        onTimeCount++;
      }

      if (typeof sub.obtainedMarks === 'number') {
        gradedCount++;
        totalMarksEarned += sub.obtainedMarks;
        totalMaxMarksGraded += a.maxMarks || a.totalMarks || 100;
      }
    } else {
      if (deadline < now) {
        overdueCount++;
      }
      const risk = calculateDeadlineRisk(a, null, now);
      pendingList.push({
        assignment: a,
        risk,
      });
    }
  });

  // KPI Calculations
  const completionRate = totalAssigned > 0 ? Math.round((submittedCount / totalAssigned) * 100) : 100;
  const onTimeSubmissionRate = submittedCount > 0 ? Math.round((onTimeCount / submittedCount) * 100) : 100;
  const averageMarks = totalMaxMarksGraded > 0 ? Math.round((totalMarksEarned / totalMaxMarksGraded) * 100) : 0;
  const lateSubmissionRate = submittedCount > 0 ? Math.round((lateCount / submittedCount) * 100) : 0;

  // 3. Academic Health Score Calculation
  // Formula: (Completion Rate * 0.30) + (OnTime Rate * 0.25) + (Average Marks * 0.35) - (Overdue Ratio * 10)
  const overdueRatio = totalAssigned > 0 ? (overdueCount / totalAssigned) : 0;
  const rawHealthScore =
    (completionRate * 0.30) +
    (onTimeSubmissionRate * 0.25) +
    ((averageMarks > 0 ? averageMarks : 75) * 0.35) -
    (overdueRatio * 20);

  const healthScore = Math.min(100, Math.max(0, Math.round(rawHealthScore)));

  let healthStatus = 'Good';
  let healthColor = 'emerald';
  let healthBadge = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';

  if (healthScore >= 85) {
    healthStatus = 'Exceptional';
    healthColor = 'emerald';
    healthBadge = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
  } else if (healthScore >= 70) {
    healthStatus = 'Good';
    healthColor = 'sky';
    healthBadge = 'bg-sky-500/10 text-sky-600 border-sky-500/20';
  } else if (healthScore >= 50) {
    healthStatus = 'Needs Attention';
    healthColor = 'amber';
    healthBadge = 'bg-amber-500/10 text-amber-600 border-amber-500/20';
  } else {
    healthStatus = 'At Risk';
    healthColor = 'rose';
    healthBadge = 'bg-rose-500/10 text-rose-600 border-rose-500/20';
  }

  const healthScoreBreakdown = {
    completion: {
      label: 'Coursework Completion',
      value: completionRate,
      weight: '30%',
      contribution: Math.round(completionRate * 0.30),
    },
    onTimeRate: {
      label: 'On-Time Submission Rate',
      value: onTimeSubmissionRate,
      weight: '25%',
      contribution: Math.round(onTimeSubmissionRate * 0.25),
    },
    academicPerformance: {
      label: 'Average Mark Performance',
      value: averageMarks > 0 ? averageMarks : 75,
      weight: '35%',
      contribution: Math.round((averageMarks > 0 ? averageMarks : 75) * 0.35),
    },
    overdueImpact: {
      label: 'Overdue Assignment Penalty',
      value: overdueCount,
      deduction: Math.round(overdueRatio * 20),
    },
  };

  // 4. Subject Performance Breakdown
  const subjectStatsMap = new Map();
  assignments.forEach((a) => {
    const subjectName = a.subjectId?.name || a.subject || 'General Studies';
    const subjectCode = a.subjectId?.code || 'GEN';

    if (!subjectStatsMap.has(subjectName)) {
      subjectStatsMap.set(subjectName, {
        subject: subjectName,
        code: subjectCode,
        total: 0,
        completed: 0,
        late: 0,
        graded: 0,
        marksEarned: 0,
        maxMarks: 0,
      });
    }

    const stat = subjectStatsMap.get(subjectName);
    stat.total++;

    const sub = submissionMap.get(a._id.toString());
    if (sub) {
      stat.completed++;
      if (sub.isLate || (sub.submittedAt && new Date(sub.submittedAt) > new Date(a.deadline))) {
        stat.late++;
      }
      if (typeof sub.obtainedMarks === 'number') {
        stat.graded++;
        stat.marksEarned += sub.obtainedMarks;
        stat.maxMarks += a.maxMarks || a.totalMarks || 100;
      }
    }
  });

  const subjectPerformance = Array.from(subjectStatsMap.values()).map((s) => ({
    subject: s.subject,
    code: s.code,
    totalAssignments: s.total,
    completed: s.completed,
    completionRate: s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0,
    averageMarks: s.maxMarks > 0 ? Math.round((s.marksEarned / s.maxMarks) * 100) : 0,
    lateCount: s.late,
  }));

  // 5. Monthly Submission Activity (Last 6 months)
  const monthlyActivity = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const monthIndex = d.getMonth();

    const monthSubs = submissions.filter((s) => {
      if (!s.submittedAt) return false;
      const subD = new Date(s.submittedAt);
      return subD.getFullYear() === year && subD.getMonth() === monthIndex;
    });

    const monthOnTime = monthSubs.filter((s) => !s.isLate).length;
    const monthLate = monthSubs.filter((s) => s.isLate).length;

    monthlyActivity.push({
      month: monthName,
      submissions: monthSubs.length,
      onTime: monthOnTime,
      late: monthLate,
    });
  }

  // 6. "What Should I Do Now?" recommendation
  const recommendationData = getWhatShouldIDoNowRecommendation(pendingList);

  return {
    kpis: {
      totalAssigned,
      submittedCount,
      completionRate,
      onTimeSubmissionRate,
      averageMarks,
      lateCount,
      lateSubmissionRate,
      overdueCount,
      gradedCount,
    },
    academicHealth: {
      score: healthScore,
      status: healthStatus,
      color: healthColor,
      badge: healthBadge,
      breakdown: healthScoreBreakdown,
      disclaimer: 'This is a deterministic academic engagement metric and does not constitute an official university grade.',
    },
    recommendation: recommendationData,
    subjectPerformance,
    monthlyActivity,
    pendingAssignmentsWithRisk: pendingList.map((p) => ({
      _id: p.assignment._id,
      title: p.assignment.title,
      subject: p.assignment.subjectId?.name || p.assignment.subject || 'Subject',
      deadline: p.assignment.deadline,
      priority: p.assignment.priority,
      difficulty: p.assignment.difficulty,
      maxMarks: p.assignment.maxMarks || p.assignment.totalMarks || 100,
      risk: p.risk,
    })),
  };
}

/**
 * Calculate Teacher Analytics
 */
async function getTeacherAnalytics(teacherId) {
  // 1. Fetch all teacher's assignments
  const assignments = await Assignment.find({ teacherId })
    .populate('subjectId', 'name code')
    .sort({ createdAt: -1 })
    .lean();

  const assignmentIds = assignments.map((a) => a._id);

  // 2. Fetch all submissions for teacher's assignments
  const submissions = await Submission.find({
    assignment: { $in: assignmentIds },
  })
    .populate('student', 'fullName email studentId department')
    .populate('assignment', 'title maxMarks deadline subjectId subject')
    .lean();

  const totalAssignments = assignments.length;
  const totalSubmissions = submissions.length;

  let totalLateSubmissions = 0;
  let gradedSubmissions = 0;
  let totalMarksAwarded = 0;
  let totalMaxMarksPossible = 0;

  // Similarity Distribution
  let lowSimilarity = 0;
  let mediumSimilarity = 0;
  let highSimilarity = 0;

  submissions.forEach((sub) => {
    if (sub.isLate) {
      totalLateSubmissions++;
    }
    if (typeof sub.obtainedMarks === 'number') {
      gradedSubmissions++;
      totalMarksAwarded += sub.obtainedMarks;
      const aMax = sub.assignment?.maxMarks || 100;
      totalMaxMarksPossible += aMax;
    }

    const simScore = sub.similarityScore || 0;
    if (simScore >= 60) {
      highSimilarity++;
    } else if (simScore >= 30) {
      mediumSimilarity++;
    } else {
      lowSimilarity++;
    }
  });

  const averageMarks = totalMaxMarksPossible > 0 ? Math.round((totalMarksAwarded / totalMaxMarksPossible) * 100) : 0;
  const lateSubmissionRate = totalSubmissions > 0 ? Math.round((totalLateSubmissions / totalSubmissions) * 100) : 0;

  // 3. Per-Assignment Performance Breakdown
  const assignmentPerformance = assignments.map((a) => {
    const aSubs = submissions.filter(
      (s) => (s.assignment?._id ? s.assignment._id.toString() : s.assignment.toString()) === a._id.toString()
    );

    const aGraded = aSubs.filter((s) => typeof s.obtainedMarks === 'number');
    const aLate = aSubs.filter((s) => s.isLate).length;
    const aMarks = aGraded.map((s) => s.obtainedMarks);

    const avgMark = aMarks.length > 0 ? Math.round((aMarks.reduce((p, c) => p + c, 0) / (aMarks.length * (a.maxMarks || 100))) * 100) : 0;
    const highestMark = aMarks.length > 0 ? Math.max(...aMarks) : 0;
    const lowestMark = aMarks.length > 0 ? Math.min(...aMarks) : 0;

    return {
      _id: a._id,
      title: a.title,
      subject: a.subjectId?.name || a.subject || 'Subject',
      code: a.subjectId?.code || '',
      deadline: a.deadline,
      maxMarks: a.maxMarks || 100,
      submissionsCount: aSubs.length,
      gradedCount: aGraded.length,
      lateCount: aLate,
      onTimeRate: aSubs.length > 0 ? Math.round(((aSubs.length - aLate) / aSubs.length) * 100) : 100,
      averageMarks: avgMark,
      highestMark,
      lowestMark,
    };
  });

  // 4. Similarity & Plagiarism Risk Breakdown
  const similarityStats = {
    totalEvaluated: totalSubmissions,
    highRiskCount: highSimilarity,
    mediumRiskCount: mediumSimilarity,
    lowRiskCount: lowSimilarity,
    highRiskPercentage: totalSubmissions > 0 ? Math.round((highSimilarity / totalSubmissions) * 100) : 0,
    mediumRiskPercentage: totalSubmissions > 0 ? Math.round((mediumSimilarity / totalSubmissions) * 100) : 0,
    lowRiskPercentage: totalSubmissions > 0 ? Math.round((lowSimilarity / totalSubmissions) * 100) : 0,
  };

  // Grade Distribution Ranges (A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: <60)
  const gradeDistribution = [
    { grade: 'A (90-100%)', count: 0, color: '#10b981' },
    { grade: 'B (80-89%)', count: 0, color: '#0ea5e9' },
    { grade: 'C (70-79%)', count: 0, color: '#f59e0b' },
    { grade: 'D (60-69%)', count: 0, color: '#f97316' },
    { grade: 'F (<60%)', count: 0, color: '#ef4444' },
  ];

  submissions.forEach((s) => {
    if (typeof s.obtainedMarks === 'number') {
      const max = s.assignment?.maxMarks || 100;
      const pct = (s.obtainedMarks / max) * 100;
      if (pct >= 90) gradeDistribution[0].count++;
      else if (pct >= 80) gradeDistribution[1].count++;
      else if (pct >= 70) gradeDistribution[2].count++;
      else if (pct >= 60) gradeDistribution[3].count++;
      else gradeDistribution[4].count++;
    }
  });

  return {
    kpis: {
      totalAssignments,
      totalSubmissions,
      gradedSubmissions,
      pendingGrading: totalSubmissions - gradedSubmissions,
      averageMarks,
      totalLateSubmissions,
      lateSubmissionRate,
    },
    assignmentPerformance,
    similarityStats,
    gradeDistribution,
  };
}

module.exports = {
  calculateDeadlineRisk,
  getWhatShouldIDoNowRecommendation,
  getStudentAnalytics,
  getTeacherAnalytics,
};
