const express = require("express");
const cors = require("cors");

const app = express();


// Middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const projectRoutes = require("./routes/projectRoutes");

app.use(cors({
    origin:"http://localhost:5173",
}));

app.use("/api/auth", authRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/projects",projectRoutes);

app.get("/", (req,res)=>{
    res.json({
        message:"DevHelper AI API running 🚀"
    });
});


module.exports = app;