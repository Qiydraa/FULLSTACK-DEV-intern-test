const express = require("express");
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const router = express.Router();

// REGISTER USER
router.post("/register", async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const userCheck = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: "Username sudah digunakan" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
            [username, hashedPassword, role]
        );

        res.status(201).json({ message: "User berhasil didaftarkan" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

// LOGIN USER
router.post("/login", async (req, res) => {
    try {
        console.log("Login request received", req.body); 

        const { username, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (user.rows.length === 0) {
            console.log("User tidak ditemukan");
            return res.status(400).json({ message: "Username atau password salah" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            console.log("Password tidak cocok");
            return res.status(400).json({ message: "Username atau password salah" });
        }

        const token = jwt.sign(
            { userId: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, role: user.rows[0].role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

module.exports = router;
