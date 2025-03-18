require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
const pool = require("./db");

pool.query("SELECT NOW()", (err, res) => {
    if (err) console.error("Database connection error", err);
    else console.log("Database connected:", res.rows[0]);
});

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const inventoryRoutes = require("./routes/inventoryRoutes");
app.use("/inventory", inventoryRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
