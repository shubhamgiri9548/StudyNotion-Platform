const express = require('express');
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require('express-fileupload');
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT ;

// database connect 
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        // origin: "http://localhost:3000",
        origin: "https://study-notion-platform-42iz.vercel.app",
        credentials: true,
    })
)

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir:"/tmp",
    })
) 
// cloudinary connection 
cloudinaryConnect();

// routes ko mount karna hai 
app.use("/api/v1/auth" , userRoutes);
app.use("/api/v1/profile" , profileRoutes);
app.use("/api/v1/course" , courseRoutes);
app.use("/api/v1/payment" , paymentRoutes);

// def route 
app.get("/", (req , res) => {
    return res.json ({
        success: true,
        message : "your server is up and running...."
    })
});

app.get("/api/test", (req, res) => {
    res.send("Backend is working!");
  });

app.listen(PORT, () => {
    console.log(`APP is running at ${PORT}`);
})