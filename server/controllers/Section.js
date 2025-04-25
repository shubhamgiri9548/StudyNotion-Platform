const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

// create section 
exports.createSection = async  (req , res) =>  {

    try {
        // data fetch 
        const {sectionName , courseId} =  req.body;
        // data validation 
        if ( !sectionName || !courseId){
            return res.status(400).json ({
                success: false ,
                message : "fill all details",
            });
        }
        // create section 
        const newSection = await Section.create({sectionName});
        // update course with section ObjectID
        const updatedCourseDetails =  await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push: {
                                                    courseContent: newSection._id,
                                                }
                                            },
                                            {new: true},
                                            ).populate("courseContent").exec(); 
        // HW: use populate to replace section  

        // return response
         return res.status(200).json ({
            success: true ,
            message : "Section created successfully",
            updatedCourseDetails,
         });


    }  catch (error){
        return res.status(500).json ({
            success: false ,
            message : "Unable to create section , please try again later",
            error: error.message,
         });

    }


};

// update section ........................

exports.updateSection = async ( req , res) => {
      
    try{
      // data input 
      const {sectionName , sectionId , courseId} = req.body;
      // data validation 
      if ( !sectionName || !sectionId){
        return res.status(400).json ({
            success: false ,
            message : "fill all details",
        });
    }
      // update data
      const section = await Section.findByIdAndUpdate(
                              sectionId, {sectionName}, {new: true} );

       const updatedCourse = await Course.findById(courseId)
                              .populate({
                                  path:"courseContent",
                                  populate: {
                                      path:"SubSection",
                                  }});                      

      // response  
      return res.status(200).json ({
         success: true ,
         message : "Section updated successfully",
         data: updatedCourse,
         
      });


    } catch (error){
        return res.status(500).json ({
            success: false ,
            message : "Unable to update section , please try again later",
            error: error.message,
         });

    }
}

// delete section ............................

exports.deleteSection = async (req,res) => {
    try {
        
        const {sectionId, courseId} = req.body;

        if (!sectionId) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        const sectionDetails = await Section.findById(sectionId);
        
        // //Section ke ander ke subsections delete kiye hai 
        sectionDetails.SubSection.forEach( async (ssid)=>{
            await SubSection.findByIdAndDelete(ssid);
        })
        console.log('Subsections within the section deleted')
        //NOTE: Due to cascading deletion, Mongoose automatically triggers the built-in middleware to perform a cascading delete for all the referenced 
        //SubSection documents. DOUBTFUL!

        //From course, courseContent the section gets automatically deleted due to cascading delete feature
        await Section.findByIdAndDelete(sectionId);
        console.log('Section deleted')

        const updatedCourse = await Course.findById(courseId)
          .populate({
              path:"courseContent",
              populate: {
                  path:"SubSection"
              }});
        return res.status(200).json({
            success:true,
            message:'Section deleted successfully',
            data: updatedCourse
        })   
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to delete Section',
            error: error.message,
        })
    }
}

// chat gpt solution  :: 
// exports.deleteSection = async (req, res) => {
//     try {
//         const { sectionId, courseId } = req.body;

//         if (!sectionId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'All fields are required',
//             });
//         }

//         const sectionDetails = await Section.findById(sectionId);

//         if (!sectionDetails) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Section not found',
//             });
//         }

//         // Delete all subsections in the section
//         if (sectionDetails.SubSection && sectionDetails.SubSection.length > 0) {
//             for (const ssid of sectionDetails.SubSection) {
//                 await SubSection.findByIdAndDelete(ssid); // Make sure this is SubSection model, not Section
//             }
//             console.log('Subsections within the section deleted');
//         }

//         await Section.findByIdAndDelete(sectionId);
//         console.log('Section deleted');

//         const updatedCourse = await Course.findById(courseId).populate({
//             path: "courseContent",
//             populate: {
//                 path: "SubSection",
//             },
//         });

//         return res.status(200).json({
//             success: true,
//             message: 'Section deleted successfully',
//             data: updatedCourse,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to delete Section',
//             error: error.message,
//         });
//     }
// }
