const {instance} = require("../config/razorpay");
const mongoose = require('mongoose');
const Course = require("../models/Course");
const User  = require("../models/User");
const mailSender  =require("../utils/mailSender");
const crypto = require('crypto');
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");


// create the payment 
exports.capturePayment = async (req , res) => {

    try {
        const {courses} = req.body;
        const userId = req.user.id;

        // validation 
        if (courses.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid courses",
            })
        }

        // find the total amount 
        let totalAmount = 0;

        for(const course_id of courses) {
            let course;
            try {
                course = await Course.findById(course_id);
                if(!course) {
                    return res.status(400).json({
                        success: false,
                        message: "Course not found",
                    })
                }
                
                // student already enrolled 
                const uid = new mongoose.Types.ObjectId(userId);
                if (course.studentsEnrolled.includes(uid)) {
                    return res.status(400).json({
                        success: false,
                        message: "You have already enrolled in this course",
                    })
                }

                // add the course price to the total amount 
                totalAmount += course.price;

            } catch(error) {
                return res.status(500).json({
                    success: false,
                    message: "problem in fetching amount",
                    error: error.message,
                })
            }
        }

        // create the order 
                const options = {
                    amount: totalAmount * 100,
                    currency: "INR",
                    receipt: Math.random(Date.now()).toString(),
                    notes: {
                        userId: userId,
                        courses: courses,
                    }
                }

                try {
                    const paymentResponse = await instance.orders.create(options);
                    return res.status(200).json({
                        success: true,
                        message: paymentResponse,
                        
                    })
                }  catch(error) {
                    console.log(error);
                    return res.status(500).json({
                        success: false,
                        message: "Count not create order",
                        error: error.message,
                    })
                }
    
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        })
    }
}


// verify the payment 

exports.verifyPayment = async (req , res) => {
    try {
        const razorpay_order_id = req.body?.razorpay_order_id;
        const razorpay_payment_id = req.body?.razorpay_payment_id;
        const razorpay_signature = req.body?.razorpay_signature;

        const userId = req.user.id;
        const courses = req.body?.courses;

        // validation
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment failed",
            })
        }
        
        let body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

        if (expectedSignature === razorpay_signature) {
             // enroll the student in the courses 
             await enrollStudent(res , userId , courses);

             // return respose
             return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
             })
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid signature",
            })
        }

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        })
    }
}


// function to enroll the student in the courses 
const enrollStudent = async ( res ,  userId , courses) => {
   
          
        if(!userId || !courses) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid userId and courses",
            })
        }
        
        for (const courseId of courses) {

           try {
              // find the course and enroll the student in it 
              const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId},
                {$push: {studentsEnrolled: userId}},
                {new: true},
            );

            if(!enrolledCourse) {   
                return res.status(400).json({
                    success: false,
                    message: "Course not found",
                })
            }
             
            const courseProgress = await CourseProgress.create({
                courseID:courseId,
                userId:userId,
                completedVideos: [],
            })

            // find the student and add the course to their list 
            const enrolledStudent = await User.findByIdAndUpdate(userId, {
                $push: { 
                courses: new mongoose.Types.ObjectId(courseId),
                courseProgress : courseProgress._id ,
                 },
              });
               

            if(!enrolledStudent) {
                return res.status(400).json({
                    success: false,
                    message: "Student not found",
                })

            }

            // mail send kardo conformation wala
            const emailResponse = await mailSender(
                enrolledStudent.email,
                 `Successfully enrolled in ${enrolledCourse.courseName}`,
                 courseEnrollmentEmail(
                   `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                    enrolledCourse.courseName,
                    
                 )

            );
            console.log("emailResponse",emailResponse);
        
        } catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message,
            })
        }

        
   }

}

// send payment success email
exports.sendPaymentSuccessEmail = async (req,res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try {
        const user = await User.findById(userId);
        await mailSender(
            user.email,
            `Payment Received`,
            paymentSuccessEmail(`${user.firstName}`,
             amount/100,orderId, paymentId)
        )
    } catch (error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}
 











