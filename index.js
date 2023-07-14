const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
const hostname = "127.0.0.1";
const port = process.env.PORT || 5000;
const authRouter = require("./routes/authRouter");
const codeRouter = require("./routes/codeRouter");
const { notFound, badRequest, errorHandler } = require("./middlewares/errorHandler");
const morgan = require("morgan");

dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRouter);

app.use("/api/code", codeRouter);

app.use(notFound);
app.use(badRequest);
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Listening at https://${hostname}:${port}`);
});
