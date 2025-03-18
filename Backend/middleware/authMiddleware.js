const jwt = require("jsonwebtoken");

require("dotenv").config();

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(403).json({ message: "Akses ditolak, token tidak ditemukan" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Token tidak valid" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Akses hanya untuk admin" });
    }
    next();
};

module.exports = { verifyToken, isAdmin };
