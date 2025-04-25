const Razorpay = require('razorpay');
require('dotenv').config();


exports.instance = new Razorpay ({
     key_id: process.env.RAZORPAY_KEY ,
     key_secret: process.env.RAZORPAY_SECRET,
});


console.log("RAZORPAY_KEY:", process.env.RAZORPAY_KEY);
console.log("RAZORPAY_SECRET:", process.env.RAZORPAY_SECRET);



