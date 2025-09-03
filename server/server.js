const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();

const userRoute = require('./routes/userRoutes');
const profileRoute = require("./routes/ProfileRoutes");
const petRoute = require("./routes/petRoutes");
const doctorRoutes = require("./routes/doctorAuth");
const activateRoute = require('./routes/Activate');

const app = express();



const Code = require('./model/code'); 





// Middleware setup (increase limit to 10MB or more for image uploads)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Allowed origins
const allowedOrigins = [
    "http://localhost:5173",
    "https://petcard.netlify.app"
];

// CORS middleware
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // allow cookies, authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // include OPTIONS
}));

// Make sure OPTIONS requests are handled
app.options("*", cors({
    origin: allowedOrigins,
    credentials: true,
}));


app.get('/', (req, res) => {
    res.send("Server OK!");
});



app.use('/user', userRoute);
app.use("/profile", profileRoute);
app.use("/pet", petRoute);
app.use("/doctor", doctorRoutes);
app.use('/QR', activateRoute);


app.get('/qr/:code', async (req, res) => {
    try {
        const resCode = await Code.findOne();
        const qr = resCode.code;

        if (!qr || !qr.url) {
            return res.status(404).send("QR code not found or not activated yet.");
        }

        // Redirect to stored destination URL
        res.redirect(qr.url);
        

    } catch (err) {
        console.error("QR redirect error:", err);
        res.status(500).send("Internal Server Error");
    }
});



mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("DB connected"))
    .catch((err) => {
        console.error("Failed to connect to MongoDB server", err);
        process.exit(1); 
    });


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
