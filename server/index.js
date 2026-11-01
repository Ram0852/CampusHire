const express=require("express");
require("dotenv").config();
const connectDB=require("./config/db");
const app=express();
const authRoutes = require("./routes/authRoutes");
const questionRoutes=require("./routes/questionRoutes");
const progressRoutes=require("./routes/progressRoutes");
const dashboardRoutes=require("./routes/dashboardRoutes");
const cors=require("cors");

app.use(cors({
    origin:"http://localhost:5173"
}));

app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/questions",questionRoutes);
app.use("/api/progress/stats",dashboardRoutes);
app.use("/api/progress",progressRoutes);

connectDB();

const PORT=process.env.PORT || 5000;

app.get("/",(req,res) => {
    res.json(
        {"message":"hi ram"}
    );
})

app.listen(PORT,() => {
    console.log(`server running on port : ${PORT}`);
});