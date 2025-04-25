const { response } = require("express");
const Course = require("../models/Course");
const Category = require("../models/Category");
const User  = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration");

// createCourse handler function 
exports.createCourse  =  async (req , res ) => {
     
    try {
     
        // fetch data
        const {courseName , courseDescription , whatWillYouLearn , price , category , tags , status , instructions} = req.body ;
        
       // get thumbnail 
       const thumbnail = req.files.thumbnailImage;

       // validation 
       if (!courseName ||
         !courseDescription ||
          !whatWillYouLearn || 
          !price ||
          !instructions ||
           !tags ||
          !thumbnail || 
           !category 
         )  {
           
        return res.status(400).json ({
            success: false,
            message : "All fields are required",
        });
          
       }
       
       // check for instructor 
       const userId = req.user.id;
       const instructorDetails = await User.findById(userId);
       console.log("Instructor details" , instructorDetails);

       if ( !instructorDetails){
            return res.status(403).json ({
                success: false,
                message : " Instructor details is not found"
            });
       }

       // check given tag is valid or not 
       const CategoryDetails = await Category.findById(category);
       if (!CategoryDetails){
        return res.status(403).json ({
            success: false,
            message : " Category details is not found"
        });
       }
        
       // upload image to cloudinary 
       const thumbnailImage = await uploadImageToCloudinary(thumbnail , process.env.FOLDER_NAME);

       // create an entry for new course  in DB 
       const newCourse =  await Course.create({
           courseName,
           courseDescription,
           instructor: instructorDetails,
           whatWillYouLearn, 
           price,
           status: status,
           instructions,
           tags,
           category:CategoryDetails._id,
           thumbnail: thumbnailImage.secure_url,
       });


       // add the new course to the user 
       await User.findByIdAndUpdate(
                  {_id: instructorDetails._id},
                  {
                     $push: {
                      courses : newCourse._id,
                     }
                  },
                  {new: true},
            )

         // update the CATEGORY ka schema ( h.w)
           await Category.findByIdAndUpdate(
                      {_id: CategoryDetails.id},
                      {
                        $push: {
                          course : newCourse._id,
                        }
                      },
                      {new: true},
                      
           )
         
         // return response 
         return res.status(200).json ( {
              success : true ,
              course: newCourse,
              message : "Course created successfully "
         })

    }  catch (error){
        console.log(error);
         return res.json(500).json ({
            success: false ,
            message : "Failed to create a course ",
            error : error.message,
         })

    }

}


// get all course handler function
exports.showAllCourses = async ( req , res) => {
       
      try {
           // change the below statement in future 
        const allCourses = await Course.find({});
          
        return res.status(200).json ({
            success : true ,
            message : "data for all courses fetched successfully ",
            courses: allCourses,
        })

      } catch (error){
        console.log(error);
        return res.json(500).json ({
           success: false ,
           message : "canot fetch course data",
           error : error.message,
        })
 
      }

}


// will changed :: get course Details ( ALL Details)
exports.getCourseDetails = async (req, res) => {
  try {
    //get id
    const {courseId} = req.body;
    //find course details
    const courseDetails = await Course.findById(courseId)
                                .populate(
                                    {
                                        path:"instructor",
                                        populate:{
                                            path:"additionalDetails",
                                        },
                                    }
                                )
                                .populate("category")
                                .populate("ratingAndReviews")
                                .populate({
                                    path:"courseContent",
                                    populate:{
                                        path:"SubSection",
                                        //select: "-videoUrl",
                                    },
                                })
                                .exec();

        //validation
        if(!courseDetails) {
            return res.status(400).json({
                success:false,
                message:`Could not find the course with ${courseId}`,
            });
        }

        let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.SubSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        //return response
        return res.status(200).json({
            success:true,
            message:"Course Details fetched successfully",
            data:{courseDetails,
              totalDuration
            },
        })

  }
  catch(error) {
      console.log(error);
      return res.status(500).json({
          success:false,
          message:error.message,
      });
  }
}

// edit course details 
 exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        course[key] = updates[key]
        // if (key === "tag" || key === "instructions") {
        //   course[key] = JSON.parse(updates[key])
        // } else {
        //   course[key] = updates[key]
        // }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails", 
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}


// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 }).populate({
      path: "courseContent",
      populate: {
        path: "SubSection",
      },
    })
    .exec()

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.SubSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }
    

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}


exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.SubSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}