const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('📦 [1/3] Installing Server Dependencies...');
  execSync('npm install', {
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit',
  });

  console.log('📦 [2/3] Installing Client Dependencies...');
  execSync('npm install', {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
  });

  console.log('🔨 [3/3] Building React Frontend with Vite...');
  execSync('npm run build', {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
  });

  console.log('🎉 Fullstack Build Completed Successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
