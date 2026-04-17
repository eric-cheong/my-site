import crypto from 'crypto';
import readline from 'readline/promises';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const pw = (await rl.question('New admin password: ')).trim();
rl.close();

if (pw.length < 12) {
  console.error('Password must be at least 12 characters.');
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(pw, salt, 64);
const encoded = `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;

console.log('\nSet this in your .env file:');
console.log(`ADMIN_PASSWORD_HASH=${encoded}\n`);
