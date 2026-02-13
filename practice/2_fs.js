import fs from 'fs/promises';

const readFileData = async () => {
  try {
    // Reads file content as UTF-8 string
    const data = await fs.readFile('data.txt', 'utf-8');
    console.log(data);
  } catch (err) {
    // Always handle file not found errors
    console.error("File error:", err);
  }
};

readFileData();