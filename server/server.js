const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();

const userRoute = require('./routes/userRoutes');
const profileRoute = require("./routes/ProfileRoutes");
const petRoute = require("./routes/petRoutes");
const doctorRoutes = require("./routes/doctorAuth");
const adminRoutes = require("./routes/adminRoutes")
const adminQR = require("./routes/adminQR")
const qrRoute = require("./routes/qrRedirect")
const QR = require("./model/qr")
const authRoutes = require("./middleware/auth")
const statsRoutes = require("./routes/stats")



const app = express();


// Import your Code model
const Code = require('./model/code'); // Adjust the path as needed





// Middleware setup (increase limit to 10MB or more for image uploads)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



app.use(cors({
    origin: ["http://localhost:5173", "https://petcard.netlify.app"], // your frontend origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});



// Basic Route
app.get('/', (req, res) => {
    res.send("Server OK!");
});

app.post("/code", async (req, res) => {

})

app.post("/QR/activate", async (req, res) => {
    const { code, petId } = req.body;

    const qr = await QR.findOne({ code });
    if (!qr) return res.status(404).json({ message: "Invalid code" });
    if (qr.isActivated) return res.status(400).json({ message: "Already activated" });

    qr.petId = petId;
    qr.redirectUrl = `${process.env.FRONTEND_URL}/pet/${petId}`;
    qr.isActivated = true;
    await qr.save();

    res.json({ message: "QR activated", redirectUrl: qr.redirectUrl });
});

// Routes setup

app.use('/user', userRoute);
app.use("/profile", profileRoute);
app.use("/pet", petRoute);
app.use("/doctor", doctorRoutes);
app.use("/admin", adminRoutes)
app.use("/adminqr", adminQR)
app.use("/qr", qrRoute)
app.use("/auth", authRoutes);
app.use("/stats", statsRoutes)





// MongoDB connection
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("DB connected"))
    .catch((err) => {
        console.error("Failed to connect to MongoDB server", err);
        process.exit(1); // Exit if DB connection fails
    });

// Set port dynamically from .env or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
