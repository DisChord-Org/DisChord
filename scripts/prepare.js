const fs = require('fs');

if (fs.existsSync('.git')) {
    fs.copyFileSync('scripts/commit-msg', '.git/hooks/commit-msg');
    fs.chmodSync('.git/hooks/commit-msg', 0o755);
    console.log('\x1b[32m[INFO]\x1b[0m Git hooks have been set up successfully.');
}