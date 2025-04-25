const RatingAndReview =  require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");


// create Rating 
exports.createRating= async (req , res) => {
     
    try {
         // get user id 
         const userId = req.user.id;    
         // fetched data from req body
         const {courseId , rating , review} = req.body;
         // check if user is enrolled or not 
          const courseDetails = await Course.findOne(
            {_id: courseId,
                studentsEnrolled: userId
           })
           
           if(!courseDetails){
              return res.status(400).json({
                  success: false,
                  message: "User is not enrolled in the course",
              });
           }

         // check if user already reviewed the course
        const alreadyReview = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        if (alreadyReview) {
            return res.status(400).json({
                success: false,
                message: "User has already reviewed this course",
            });
        }
         // create rating and review
        const ratingReview = await RatingAndReview.create({
            rating , review,
            course: courseId,
            user: userId,
        });

    
        // update course with this rating/ review
         const updatedCourseDetails =   await Course.findByIdAndUpdate(  {_id: courseId},
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                }
            },
            {new:true});

        console.log(updatedCourseDetails);    

        //return response
        return res.status(200).json({
            success: true,
            message: "Rating and review created successfully",
            ratingReview,
        });
    
    } catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });

    }


}

// getAverage Rating 

exports.getAverageRating = async ( req ,res ) => {
    try {
        // get course ID
        const { courseId } = req.body;
        // calculate avg rating 

        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id:null,
                    averageRating: { $avg: "$rating"},
                }
            }
        ])

        // return rating 
        if ( result.length  > 0){
             
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }
        
        // if no rating / review exist 
        return res.status(200).json ({
            success: true,
            message : "average rating is 0,no rating given till now",
            averageRating: 0,
        })
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }

}


// get All Rating ans reviews

exports.getAllRating = async ( req , res) => {
      
    try {
      const allReviews = await RatingAndReview.find({})
       .sort( {rating: "desc"})
       .populate({
          path: "user",
          select: "firstName lastName email image",
       })
       .populate({
         path: "course",
         select: "courseName",
       })
       .exec();

       return res.status(200).json ({
         success: true,
         message : "ALL reviews fetched successfully",
         data: allReviews,
       })

    }  catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });

    }
}