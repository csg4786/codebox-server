const { exec } = require("child_process");
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");

let outputPath;
if (process.env.NODE_ENV && process.env.NODE_ENV == "production") {
  outputPath = path.resolve("/tmp", "outputs");
} else {
  outputPath = path.resolve(process.cwd(), "utils", "outputs");
}
console.log(outputPath);

try {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
} catch (error) {
  console.log(error);
}

const executeCpp = (filepath, code) => {
  if (fs.existsSync(outputPath)) {
    fse.emptyDirSync(outputPath);
  }
  const taskId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${taskId}.out`);
  // console.log(filepath, outPath, outputPath);
  
  return new Promise((resolve, reject) => {
    exec(
      `g++ -o "${outPath}" -x c++ - && "${outPath}"`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    ).stdin.end(code);
  });
};

const executeC = (filepath, code) => {
  if (fs.existsSync(outputPath)) {
    fse.emptyDirSync(outputPath);
  }
  const taskId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${taskId}.out`);
  
  return new Promise((resolve, reject) => {
    exec(
      `gcc -o "${outPath}" -x c - && "${outPath}"`, (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    ).stdin.end(code);
  });
};
    
const executeJS = (code) => {

  return new Promise((resolve, reject) => {
    const compileJS = exec(`node -`, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
    compileJS.stdin.write(code);
    compileJS.stdin.end();
  });
};


const executePhp = (filepath) => {

  return new Promise((resolve, reject) => {
    exec(
      `php "${filepath}"`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

const executePy = (code) => {

  return new Promise((resolve, reject) => {
    const compilePy = exec(`python -`, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
    compilePy.stdin.write(code);
    compilePy.stdin.end();
  });
};


module.exports = { executePy, executeCpp, executeC, executeJS, executePhp };