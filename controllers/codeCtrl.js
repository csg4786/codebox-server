const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname+"\\..\\utils\\", "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
  const taskId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${taskId}.out`);
  // console.log(filepath, outPath, outputPath);

  return new Promise((resolve, reject) => {
    exec(
      `g++ "${filepath}" -o "${outPath}" && "${outPath}"`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

const executeC = (filepath) => {
  const taskId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${taskId}.out`);

  return new Promise((resolve, reject) => {
    exec(
      `gcc "${filepath}" -o "${outPath}" && "${outPath}"`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};


const executeJS = (filepath) => {
  // const taskId = path.basename(filepath).split(".")[0];
  // const outPath = path.join(outputPath, `${taskId}.out`);

  return new Promise((resolve, reject) => {
    exec(
      `node "${filepath}"`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
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

const executePy = (filepath) => {

  return new Promise((resolve, reject) => {
    exec(
      `python "${filepath}"`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};


module.exports = { executePy, executeCpp, executeC, executeJS, executePhp };