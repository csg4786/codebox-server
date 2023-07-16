const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(process.cwd(), "utils", "codes");

try {
  if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
  }
} catch (error) {
  console.log(error);
}

const generateFile = async (format, content) => {
  fse.emptyDirSync(dirCodes);
  const jobId = uuid();
  const filename = `${jobId}.${format}`;
  const filepath = path.join(dirCodes, filename);
  fs.writeFileSync(filepath, content);
  return filepath;
};

module.exports = { generateFile };