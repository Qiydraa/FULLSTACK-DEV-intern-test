const express = require("express");
const pool = require("../db");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM inventory");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

// CREATE INVENTORY (Hanya Admin)
router.post("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, quantity, price } = req.body;
        await pool.query(
            "INSERT INTO inventory (name, quantity, price) VALUES ($1, $2, $3)",
            [name, quantity, price]
        );
        res.status(201).json({ message: "Barang berhasil ditambahkan" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

// UPDATE INVENTORY (Hanya Admin)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, price } = req.body;
        await pool.query(
            "UPDATE inventory SET name = $1, quantity = $2, price = $3 WHERE id = $4",
            [name, quantity, price, id]
        );
        res.json({ message: "Barang berhasil diperbarui" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

// DELETE INVENTORY (Hanya Admin)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM inventory WHERE id = $1", [id]);
        res.json({ message: "Barang berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

module.exports = router;
