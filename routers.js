const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const users = require('./users'); 
const upload = multer({ dest: "public" });


router.get("/users", (req, res) => {
    res.status(200).json(users);
});

router.post("/users", (req, res) => {
    res.status(200).json(users);
});

router.get("/users/:name", (req, res) => {
    const name = req.params.name.toLowerCase();
    const foundUser = users.find(u => u.name.toLowerCase() === name);

    if (foundUser) {
        res.status(200).json(foundUser);
    } else {
        res.status(404).json({
            status: "error",
            message: "Masukan data yang akan diubah",
        });
    }
});

router.post("/users/:name", (req, res) => {
    const name = req.params.name.toLowerCase();
    const foundUser = users.find(u => u.name.toLowerCase() === name);

    if (foundUser) {
        res.status(200).json(foundUser);
    } else {
        res.status(404).json({
            status: "error",
            message: "Data user tidak ditemukan",
        });
    }
});

router.get("/download/", (req, res) => {
    const filename = "logo.png";
    const filepath = path.join(__dirname, "assets", filename);

    if (fs.existsSync(filepath)) {
        res.download(filepath);
    } else {
        res.status(404).json({
            status: "error",
            message: "File tidak ditemukan",
        });
    }
})

router.post("/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    if (file) {
        const target = path.join(__dirname, "public", file.originalname);
        fs.renameSync(file.path, target);
        res.send("file berhasil diupload")
    } else {
        res.send("file gagal diupload")
    }
})


// ROUTING DASAR
router.get("/contoh", (req, res) => res.send("request dengan method GET"));
router.post("/contoh", (req, res) => res.send("request dengan method POST"));
router.put("/contoh", (req, res) => res.send("request dengan method PUT"));
router.delete("/contoh", (req, res) => res.send("request dengan method DELETE"));


module.exports = router;
