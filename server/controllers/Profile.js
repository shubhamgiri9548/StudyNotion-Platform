const Profile = require("../models/Profile");
const User =  require("../models/User");
const Course =  require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const {convertSecondsToDuration} = require("../utils/secToDuration");
const CourseProgress = require('../models/CourseProgress');


exports.updateProfile = async (req, res) => {
  try {
    // get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    // get user ID from auth middleware
    const id = req.user.id;

    // validation
    if (!contactNumber || !gender || !about || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // find the user
    const userDetails = await User.findById(id);
    if (!userDetails || !userDetails.additionalDetails) {
      return res.status(404).json({
        success: false,
        message: "User or user profile not found",
      });
    }

    // find the profile
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);
    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // update the profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();

    // get updated user details with profile populated
    const updatedUser = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Can't update the profile, please try again",
      error: error.message,
    });
  }
};


exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  

// delete account handler ........
exports.deleteAccount = async (req , res) => {
     
    try {
         // get id 
        const id = req.user.id ;
        // validation 
        const userDetails = await User.findById(id);
        if ( !userDetails) {
              return res.status(404).json ({
                success: false,
                message : "user not found"
              });
        }
        // delete profile 
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
             
        // TODO : HW unenroll user from all enrolled course
         // Example:
        // await Course.updateMany(
        //     { studentsEnrolled: userDetails._id },
        //     { $pull: { studentsEnrolled: userDetails._id } }
        // );

        // delete user
        await User.findByIdAndDelete({_id:id});

        // return response
        return res.status(200).json ({
           success: true ,
           message : "Account  deleted successfully "
        })


    } catch (error){
        return res.status(500).json ({
            success : false ,
            message :"User cannot be delete, plz try again",
            error:error.message,
        });
     
    }

}


// fetch the detail of user (optional)

exports.getAllUserDetails = async (req, res) => {
    try {
        // get user id
        const id = req.user.id;
        
        // find user details
        const userDetails = await User.findById(id).populate('additionalDetails');
        
        // check if user exists
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // return user details
        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            userDetails
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch user details, please try again",
            error: error.message
        });
    }
}


// get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
      .populate({
        path: "courses",
        populate: {
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
        },
      })
      .exec()

      userDetails = userDetails.toObject()
	  var SubsectionLength = 0
	  for (var i = 0; i < userDetails.courses.length; i++) {
		let totalDurationInSeconds = 0
		SubsectionLength = 0
		for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
		  totalDurationInSeconds += userDetails.courses[i].courseContent[
			j
		  ].SubSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
		  userDetails.courses[i].totalDuration = convertSecondsToDuration(
			totalDurationInSeconds
		  )
		  SubsectionLength +=
			userDetails.courses[i].courseContent[j].SubSection.length
		}
		let courseProgressCount = await CourseProgress.findOne({
		  courseID: userDetails.courses[i]._id,
		  userId: userId,
		})
		courseProgressCount = courseProgressCount?.completedVideos.length
		if (SubsectionLength === 0) {
		  userDetails.courses[i].progressPercentage = 100
		} else {
		  // To make it up to 2 decimal point
		  const multiplier = Math.pow(10, 2)
		  userDetails.courses[i].progressPercentage =
			Math.round(
			  (courseProgressCount / SubsectionLength) * 100 * multiplier
			) / multiplier
		}
	  }

      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
}; 

// get instructor dashboard
exports.instructorDashboard = async(req, res) => {
	try{
		const courseDetails = await Course.find({instructor:req.user.id});

		const courseData  = courseDetails.map((course)=> {
			const totalStudentsEnrolled = course.studentsEnrolled.length
			const totalAmountGenerated = totalStudentsEnrolled * course.price

			//create an new object with the additional fields
			const courseDataWithStats = {
				_id: course._id,
				courseName: course.courseName,
				courseDescription: course.courseDescription,
				totalStudentsEnrolled,
				totalAmountGenerated,
			}
			return courseDataWithStats
		})

		res.status(200).json({courses:courseData});

	}
	catch(error) {
		console.error(error);
		res.status(500).json({message:"Internal Server Error"});
	}
}



