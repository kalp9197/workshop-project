import path from 'path';

// BAD: Hardcoding slashes (breaks on Windows vs Linux)
// const badPath = "folder/subfolder/file.txt";

// GOOD: Uses correct separator for the OS
const fullPath = path.join('practice', 'data.txt');

console.log(fullPath);