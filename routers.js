const express = require("express");
const routers = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const client = require("./mongodb");
const ObjectId = require("mongodb").ObjectId;

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(null, false);
  }
  cb(null, true);
};

const upload = multer({ dest: "public", fileFilter: imageFilter });

// ROUTING

// GET USER ORDER
routers.get("/users/orders", async (req, res) => {
    try {
      const db = client.db("latihan");
      const usersWithOrders = await db.collection("users").aggregate([
        {
          $lookup: {
            from: "order",
            localField: "_id",
            foreignField: "userId",
            as: "orders"
          }
        }
      ]).toArray();
  
      res.json({
        status: "success",
        message: "users beserta orders",
        data: usersWithOrders
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil data user dengan orders"
      });
    }
  });

  
// GET ALL USERS
routers.get("/users", async (req, res) => {
  try {
    const db = client.db("latihan");
    const users = await db.collection("users").find().toArray();
    res.json({
      status: "success",
      message: "list users",
      data: users,
    });
  } catch (error) {
    res.json({
      status: "error",
    });
  }
});

// GET SINGLE USER
routers.get("/users/:id", async (req, res) => {
  try {
    const db = client.db("latihan");
    const user = await db.collection("users").findOne({
      _id: new ObjectId(req.params.id),
    });
    res.status(200).json({
      status: "success",
      message: "single user",
      data: user,
    });
  } catch (error) {
    res.json({
      status: "error",
    });
  }
});

// INSERT USER
routers.post("/users", async (req, res) => {
    try {
      const db = client.db("latihan");
      const result = await db.collection("users").insertOne(req.body);
  
      res.status(201).json({
        status: "success",
        message: "User berhasil ditambahkan",
        data: result.insertedId
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal menambahkan user"
      });
    }
  });
  
// UPDATE USER
routers.put("/users/:id", async (req, res) => {
    try {
      const db = client.db("latihan");
      const result = await db.collection("users").updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );
  
      res.json({
        status: "success",
        message: "User berhasil diupdate",
        data: result.modifiedCount
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal update user"
      });
    }
  });

// DELETE USER
routers.delete("/users/:id", async (req, res) => {
    try {
      const db = client.db("latihan");
      const result = await db.collection("users").deleteOne({
        _id: new ObjectId(req.params.id)
      });
  
      res.json({
        status: "success",
        message: "User berhasil dihapus",
        data: result.deletedCount
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal hapus user"
      });
    }
  });

  
routers.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (file) {
    const target = path.join(__dirname, "public", file.originalname);
    fs.renameSync(file.path, target); //rename file agar sama dengan original file name
    res.send("file berhasil diupload");
  } else {
    res.send("file gagal diupload");
  }
});

routers.get("/download", (req, res) => {
  const filename = "dummy.png";
  res.download(path.join(__dirname, "/download", filename), "dummy-photo.png");
});

routers.post("/login", (req, res) => {
  const { username, password } = req.body;
  res.status(200).json({
    status: "success",
    message: "Login page",
    data: {
      username: username,
      password: password,
    },
  });
});
routers.get("/", (req, res) => res.send("Hello World"));
routers.get("/about", (req, res) =>
  res.status(200).json({
    status: "success",
    message: "About page",
    data: [],
  })
);
routers.put("/about", (req, res) =>
  res.status(200).json({
    status: "success",
    message: "About page",
    data: [],
  })
);
routers.post("/contoh", (req, res) => res.send("request method POST"));
routers.put("/contoh", (req, res) => res.send("Request method PUT"));
routers.delete("/contoh", (req, res) => res.send("Request method DELETE"));
routers.patch("/contoh", (req, res) => res.send("Request method PATCH"));

routers.all("/universal", (req, res) =>
  res.send(`Request method ${req.method}`)
);
// Routing dinamis
// 1. Menggunakan params
routers.get("/post/:id", (req, res) =>
  res.send(`Artikel ke - ${req.params.id}`)
);
// 2. Menggunakan Query String
routers.get("/post", (req, res) => {
  const { page, sort } = req.query;
  res.send(`Query string= page :${page}, sort : ${sort}`);
});

module.exports = routers;