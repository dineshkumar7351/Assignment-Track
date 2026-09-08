const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAcademicData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-assignment-tracker';
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB for Academic Seeding...');

    const dept = 'Computer Science & Engineering';

    // 1. Ensure Teacher exists
    let teacher = await User.findOne({ email: 'sarah.teacher@college.edu' });
    if (!teacher) {
      teacher = await User.create({
        fullName: 'Dr. Sarah Connor',
        email: 'sarah.teacher@college.edu',
        password: 'Password@123',
        role: 'teacher',
        department: dept,
        employeeId: 'EMP-CS-101',
      });
      console.log('✅ Created default teacher user');
    }

    // 2. Ensure Students exist
    let student1 = await User.findOne({ email: 'john.student@college.edu' });
    if (!student1) {
      student1 = await User.create({
        fullName: 'John Student',
        email: 'john.student@college.edu',
        password: 'Password@123',
        role: 'student',
        department: dept,
        studentId: 'STU-2026-999',
      });
      console.log('✅ Created student 1');
    }

    let student2 = await User.findOne({ email: 'emily.davis@college.edu' });
    if (!student2) {
      student2 = await User.create({
        fullName: 'Emily Davis',
        email: 'emily.davis@college.edu',
        password: 'Password@123',
        role: 'student',
        department: dept,
        studentId: 'STU-2026-102',
      });
      console.log('✅ Created student 2');
    }

    let student3 = await User.findOne({ email: 'alex.rivera@college.edu' });
    if (!student3) {
      student3 = await User.create({
        fullName: 'Alex Rivera',
        email: 'alex.rivera@college.edu',
        password: 'Password@123',
        role: 'student',
        department: dept,
        studentId: 'STU-2026-103',
      });
      console.log('✅ Created student 3');
    }

    // Clean existing subjects, assignments and submissions
    await Subject.deleteMany({});
    await Assignment.deleteMany({});
    await Submission.deleteMany({});
    console.log('🧹 Cleaned existing subjects, assignments, and submissions');

    // 3. Seed Subjects
    const subjectsToInsert = [
      {
        name: 'Database Systems',
        code: 'CS-301',
        department: dept,
        teacherId: teacher._id,
        description: 'Relational & NoSQL database architectures, indexing, distributed queries, and ACID guarantees.',
        isActive: true,
      },
      {
        name: 'Web Technologies',
        code: 'CS-302',
        department: dept,
        teacherId: teacher._id,
        description: 'Modern full-stack web applications with React, Node.js, REST APIs, and authentication.',
        isActive: true,
      },
      {
        name: 'Operating Systems',
        code: 'CS-303',
        department: dept,
        teacherId: teacher._id,
        description: 'Kernel architectures, multi-threading, concurrency, semaphores, and memory management.',
        isActive: true,
      },
      {
        name: 'Cloud Computing',
        code: 'CS-304',
        department: dept,
        teacherId: teacher._id,
        description: 'Microservices, Docker containerization, Kubernetes orchestration, and cloud deployments.',
        isActive: true,
      },
      {
        name: 'Machine Learning',
        code: 'CS-305',
        department: dept,
        teacherId: teacher._id,
        description: 'Statistical machine learning algorithms, linear regression, gradient descent, and neural networks.',
        isActive: true,
      },
      {
        name: 'Network Security',
        code: 'CS-306',
        department: dept,
        teacherId: teacher._id,
        description: 'Applied cryptography, public-key infrastructure, digital signatures, and vulnerability audits.',
        isActive: true,
      },
      {
        name: 'Computer Graphics',
        code: 'CS-307',
        department: dept,
        teacherId: teacher._id,
        description: '3D shader programming, OpenGL rendering pipeline, matrix transformations, and lighting models.',
        isActive: true,
      },
    ];

    const createdSubjects = await Subject.insertMany(subjectsToInsert);
    console.log(`✅ Seeded ${createdSubjects.length} academic subjects`);

    const now = new Date();

    // Deadlines
    const pastDeadline1 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const pastDeadline2 = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const overdueDeadline = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const submittedPendingDeadline = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); // 24h away (Due soon)
    const upcomingSoonDeadline = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 48h away (Due soon)
    const upcoming4DaysDeadline = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000); // 4 days away
    const upcoming6DaysDeadline = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000); // 6 days away

    const assignmentsToInsert = [
      {
        title: 'Distributed Database Systems - Sharding & Replication Lab',
        description: 'Design and benchmark a MongoDB replica set with 3 shards, implementing custom hash partitioning and failover monitoring.',
        instructions: '1. Set up a local 3-shard cluster.\n2. Ingest 100,000 synthetic records.\n3. Measure query response times under node failure.\n4. Submit a PDF report and reproduction script.',
        subjectId: createdSubjects[0]._id,
        subject: createdSubjects[0].name,
        department: dept,
        teacherId: teacher._id,
        deadline: pastDeadline1,
        maxMarks: 100,
        difficulty: 'hard',
        priority: 'high',
        attachmentName: 'sharding_spec_v1.pdf',
        attachmentUrl: 'https://storage.googleapis.com/smart-tracker/sharding_spec.pdf',
        status: 'published',
      },
      {
        title: 'Full-Stack React & Node.js SPA Architecture',
        description: 'Implement a comprehensive role-based client dashboard with responsive navigation, Tailwind styling, and JWT token authentication.',
        instructions: '1. Create React frontend with React Router v7.\n2. Implement JWT token persistence and route protection.\n3. Add Dark Mode theme support.\n4. Submit your GitHub repository URL.',
        subjectId: createdSubjects[1]._id,
        subject: createdSubjects[1].name,
        department: dept,
        teacherId: teacher._id,
        deadline: pastDeadline2,
        maxMarks: 100,
        difficulty: 'medium',
        priority: 'high',
        attachmentName: 'react_spa_rubric.pdf',
        attachmentUrl: 'https://storage.googleapis.com/smart-tracker/react_spa_rubric.pdf',
        status: 'published',
      },
      {
        title: 'Operating Systems - Concurrency & Mutex Semaphores',
        description: 'Write a multi-threaded POSIX C implementation of the Dining Philosophers problem resolving deadlock through resource hierarchy.',
        instructions: '1. Implement solution in C using pthreads.\n2. Guard fork resources using mutex semaphores.\n3. Test with 5 and 10 philosopher threads.\n4. Ensure zero deadlock over a 60-second runtime.',
        subjectId: createdSubjects[2]._id,
        subject: createdSubjects[2].name,
        department: dept,
        teacherId: teacher._id,
        deadline: submittedPendingDeadline,
        maxMarks: 50,
        difficulty: 'medium',
        priority: 'medium',
        attachmentName: 'dining_philosophers_prompt.c',
        attachmentUrl: 'https://storage.googleapis.com/smart-tracker/dining_philosophers.c',
        status: 'published',
      },
      {
        title: 'Cloud Infrastructure - Docker Containerization & Orchestration',
        description: 'Create multi-stage Dockerfiles and a docker-compose cluster deploying an Express API, MongoDB, and Redis cache.',
        instructions: '1. Optimize production Dockerfile sizes under 150MB.\n2. Configure volume persistence for MongoDB.\n3. Set up healthcheck probes in compose file.\n4. Submit docker-compose.yml and architecture diagram.',
        subjectId: createdSubjects[3]._id,
        subject: createdSubjects[3].name,
        department: dept,
        teacherId: teacher._id,
        deadline: upcomingSoonDeadline,
        maxMarks: 100,
        difficulty: 'hard',
        priority: 'high',
        attachmentName: 'docker_compose_template.yml',
        attachmentUrl: 'https://storage.googleapis.com/smart-tracker/docker_compose.yml',
        status: 'published',
      },
      {
        title: 'Machine Learning - Linear Regression & Gradient Descent',
        description: 'Implement vectorized multivariate linear regression from scratch using NumPy and analyze loss convergence over 1,000 iterations.',
        instructions: '1. Do not use scikit-learn or high-level estimators for fitting.\n2. Implement gradient descent cost minimization.\n3. Plot loss curves against learning rates (0.001, 0.01, 0.1).\n4. Submit Jupyter Notebook with markdown commentary.',
        subjectId: createdSubjects[4]._id,
        subject: createdSubjects[4].name,
        department: dept,
        teacherId: teacher._id,
        deadline: upcoming4DaysDeadline,
        maxMarks: 75,
        difficulty: 'medium',
        priority: 'medium',
        attachmentName: 'housing_dataset.csv',
        attachmentUrl: 'https://storage.googleapis.com/smart-tracker/housing_dataset.csv',
        status: 'published',
      },
      {
        title: 'Network Security - RSA Cryptography & Digital Signatures',
        description: 'Implement 2048-bit RSA key pair generation, OAEP padding, and SHA-256 digital signature validation.',
        instructions: '1. Generate prime factors p and q using Miller-Rabin primality test.\n2. Compute public exponent e and modular inverse d.\n3. Sign a message hash and verify authenticity.\n4. Submit Python source code.',
        subjectId: createdSubjects[5]._id,
        subject: createdSubjects[5].name,
        department: dept,
        teacherId: teacher._id,
        deadline: upcoming6DaysDeadline,
        maxMarks: 100,
        difficulty: 'easy',
        priority: 'low',
        attachmentName: 'rsa_math_guide.pdf',
        attachmentUrl: 'https://storage.googleapis.com/smart-tracker/rsa_math_guide.pdf',
        status: 'published',
      },
      {
        title: 'Computer Graphics - OpenGL 3D Shader Rendering Pipeline',
        description: 'Build a custom GLSL vertex and fragment shader implementing Phong lighting and specular reflection maps.',
        instructions: '1. Write vertex shader calculating normal transforms.\n2. Implement Blinn-Phong specular reflection in fragment shader.\n3. Add directional and point light sources.\n4. Submit GLSL source code and rendered screenshot.',
        subjectId: createdSubjects[6]._id,
        subject: createdSubjects[6].name,
        department: dept,
        teacherId: teacher._id,
        deadline: overdueDeadline,
        maxMarks: 100,
        difficulty: 'hard',
        priority: 'high',
        attachmentName: 'shader_starter_pack.zip',
        attachmentUrl: 'https://storage.googleapis.com/smart-tracker/shader_starter.zip',
        status: 'published',
      },
    ];

    const createdAssignments = await Assignment.insertMany(assignmentsToInsert);
    console.log(`✅ Seeded ${createdAssignments.length} academic assignments`);

    // Submissions for Dr. Sarah Connor's assignments
    // 1. Graded submission - John Student (Database Systems)
    await Submission.create({
      assignment: createdAssignments[0]._id,
      student: student1._id,
      submittedAt: new Date(pastDeadline1.getTime() - 24 * 60 * 60 * 1000),
      content: 'GitHub repo: https://github.com/johnstudent/sharded-cluster-benchmark',
      status: 'graded',
      obtainedMarks: 94,
      feedback: 'Outstanding implementation of sharding topology and query optimization metrics.',
      similarityScore: 4,
      similarityStatus: 'clean',
      gradedAt: new Date(pastDeadline1.getTime() + 12 * 60 * 60 * 1000),
      gradedBy: teacher._id,
    });

    // 2. Graded submission - John Student (Web Technologies)
    await Submission.create({
      assignment: createdAssignments[1]._id,
      student: student1._id,
      submittedAt: new Date(pastDeadline2.getTime() - 10 * 60 * 60 * 1000),
      content: 'Deploys at: https://smart-tracker-preview.edu',
      status: 'graded',
      obtainedMarks: 90,
      feedback: 'Very clean component architecture and responsive mobile layout. Great work on AuthContext!',
      similarityScore: 6,
      similarityStatus: 'clean',
      gradedAt: new Date(pastDeadline2.getTime() + 8 * 60 * 60 * 1000),
      gradedBy: teacher._id,
    });

    // 3. Pending Evaluation - John Student (Operating Systems)
    await Submission.create({
      assignment: createdAssignments[2]._id,
      student: student1._id,
      submittedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      content: 'POSIX C source code attached: mutex_semaphore_sync.c',
      status: 'submitted',
      obtainedMarks: null,
      feedback: '',
      similarityScore: 8,
      similarityStatus: 'clean',
    });

    // 4. Pending Evaluation with High Similarity - Emily Davis (Operating Systems)
    await Submission.create({
      assignment: createdAssignments[2]._id,
      student: student2._id,
      submittedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      content: 'POSIX C code attached: dining_philosophers_sync.c',
      status: 'submitted',
      obtainedMarks: null,
      feedback: '',
      similarityScore: 38,
      similarityStatus: 'high',
    });

    // 5. Graded submission - Alex Rivera (Database Systems)
    await Submission.create({
      assignment: createdAssignments[0]._id,
      student: student3._id,
      submittedAt: new Date(pastDeadline1.getTime() - 36 * 60 * 60 * 1000),
      content: 'Repo: https://github.com/alexrivera/mongo-distributed-cluster',
      status: 'graded',
      obtainedMarks: 86,
      feedback: 'Good shard distribution, but replica election timeout configuration could be improved.',
      similarityScore: 14,
      similarityStatus: 'clean',
      gradedAt: new Date(pastDeadline1.getTime() + 14 * 60 * 60 * 1000),
      gradedBy: teacher._id,
    });

    console.log('✅ Seeded 5 student submissions with similarity scores and marks');
    console.log('🎉 Academic Data Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during academic seeding:', error);
    process.exit(1);
  }
};

seedAcademicData();
