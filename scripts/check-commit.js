const fs = require('fs');
const path = require('path');

const commitMsgFile = process.argv[2];

if (!commitMsgFile) {
    console.error('\x1b[31m[ERROR]\x1b[0m The commit message file was not provided..');
    process.exit(1);
}

const commitMsgPath = path.resolve(commitMsgFile);
const commitMsg = fs.readFileSync(commitMsgPath, 'utf8').trim();
const REGEXP = /^(add|delete|modify|refactor|fix): .+$/;

if (!REGEXP.test(commitMsg)) {
    console.error('\n\x1b[31m%s\x1b[0m', '[ERROR] Invalid commit structure.');
    console.error(`Your message was: '\x1b[33m${commitMsg}\x1b[0m'`);
    console.error('\nThe format must strictly comply with one of the following prefixes:');
    console.error('  \x1b[32madd: <message>\x1b[0m');
    console.error('  \x1b[32mdelete: <message>\x1b[0m');
    console.error('  \x1b[32mmodify: <message>\x1b[0m');
    console.error('  \x1b[32mrefactor: <message>\x1b[0m');
    console.error('  \x1b[32mfix: <message>\x1b[0m');
    console.error('\nAborted commit. Please correct the format and try again.\n');
    
    process.exit(1);
}

process.exit(0);