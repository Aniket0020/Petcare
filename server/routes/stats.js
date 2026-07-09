const express = require("express");
const User = require("../model/user.js");

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const stats = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, // group by month
                    total: { $sum: 1 }, // count users
                },
            },
            { $sort: { _id: 1 } }, // sort by month
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      

        // create full months array
        const formatted = months.map((monthName, index) => {
            const stat = stats.find(s => s._id === index + 1);
            return {
                month: monthName,
                users: stat ? stat.total : 0,
            };
        });

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to fetch user data" });
    }
});

module.exports = router; 
