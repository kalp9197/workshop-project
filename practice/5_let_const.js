// --- THE OLD WAY (Avoid this) ---
// 'var' is function-scoped. It leaks out of blocks.
var name = "John";

// --- THE MODERN WAY (Use this) ---
// 'let' is block-scoped. Use it only if variables change.
let age = 25; 
age = 26; // This is allowed

// 'const' is block-scoped and immutable.
// This is your default choice for 99% of variables.
const PI = 3.14; 
// PI = 3.15; // ❌ ERROR: Assignment to constant variable

console.log(name, age, PI);