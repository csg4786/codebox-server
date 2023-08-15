const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose.set("strictQuery", true);

  const dbName = "codebox";
  const dbUrl = (process.env.NODE_ENV && process.env.NODE_ENV == "production") ? process.env.MONGODB_URL1 + dbName + process.env.MONGODB_URL2 : process.env.MONGODB_URL + dbName;
  try {
    const conn = mongoose.connect(dbUrl);
    console.log("Database Connected!");
  } catch (error) {
    console.log(`Database Connection Error! : ${error}`);
  }
};

module.exports = dbConnect;
