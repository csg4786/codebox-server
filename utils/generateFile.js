const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const { v4: uuid } = require("uuid");

let dirCodes;
if (process.env.NODE_ENV && process.env.NODE_ENV == "production") {
  dirCodes = path.resolve("/tmp", "codes");
} else {
  dirCodes = path.resolve(process.cwd(), "utils", "codes");
}
console.log(dirCodes);

try {
  if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
  }
} catch (error) {
  console.log(error);
}

const generateFile = async (format, content) => {
  if (fs.existsSync(dirCodes)) {
    fse.emptyDirSync(dirCodes);
  }
  const jobId = uuid();
  const filename = `${jobId}.${format}`;
  const filepath = path.join(dirCodes, filename);
  // await fs.writeFileSync(filepath, content);
  return filepath;
};

module.exports = { generateFile };