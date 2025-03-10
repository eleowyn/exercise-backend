const http = require("http");
const moment = require("moment");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const app = express();
const routers = require("./routers");

const upload = multer({ dest: "public/uploads" });

// Middleware morgan
app.use(morgan("tiny"));

// Middleware Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware file statis
app.use(express.static(path.join(__dirname, "public")));

// Middleware CORS
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Middleware Log
const log = (req, res, next) => {
  console.log(
    `${moment().format("h:mm:ss a")} ${req.method} ${req.originalUrl} dari ${req.ip}`
  );
  next();
};
app.use(log);

// Routing
app.use(routers);

// Middleware 404 (Resource Tidak Ditemukan)
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "resource tidak ditemukan",
  });
});

// Middleware Penanganan Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan pada server",
  });
});

// Server
const hostname = "127.0.0.1";
const port = 3000;
app.listen(port, hostname, () =>
  console.log(`Server running at http://${hostname}:${port}`)
);
