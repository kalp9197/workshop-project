// --- Synchronous (Blocking) ---
import fs from 'fs';

console.log('Start');
const data = fs.readFileSync('data.txt', 'utf-8'); // Line 2 waits here
console.log('File length:', data.length);
console.log('End (runs AFTER file read finishes)');

// --- Asynchronous (Non-blocking) ---
import fsPromises from 'fs/promises';

console.log('Start');
const readFileAsync = async () => {
  const dataAsync = await fsPromises.readFile('data.txt', 'utf-8');
  console.log('File length:', dataAsync.length);
};

readFileAsync();
console.log('End (can log WHILE file is loading)');