const SubSection =  require("../models/SubSection");
const Section  = require("../models/Section");
const {uploadImageToCloudinary}  = require("../utils/imageUploader");




// deepseek
exports.createSubSection = async (req, res) => {
  try {
      const {sectionId, title,timeDuration, description} = req.body;
      const video = req.files.video;

      if (!sectionId || !title || !description || !video) {
          return res.status(400).json({
              success: false,
              message: "All fields are required",
          });
      }

      const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
      
      const SubSectionDetails = await SubSection.create({
          title: title,
          timeDuration: `${uploadDetails.duration}`,
          description: description,
          videoUrl: uploadDetails.secure_url,
      });

      // Update section and populate all subsections
      const updatedSection = await Section.findByIdAndUpdate(
          sectionId,
          {$push: {SubSection: SubSectionDetails._id}},
          {new: true}
      ).populate({
          path: "SubSection",
          model: "SubSection" 
      }).exec();

      // Return the complete updated section
      console.log("Updated Section:", updatedSection);
      return res.status(200).json({
          success: true,
          message: "SubSection created successfully",
          data: updatedSection, // Changed from updatedSection to data
          updatedSection: updatedSection // Keep both for backward compatibility
      });

  } catch (error) {
      return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
      });
  }
}


// chat gpt solution 
exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId,subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        //subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      const updatedSection = await Section.findById(sectionId).populate("SubSection")


      return res.json({
        success: true,
        data:updatedSection,
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }


// HW : delete subsection 

exports.deleteSubSection = async (req,res) =>{
    try {
        
        const {subSectionId,sectionId } = req.body;
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
              $pull: {
                SubSection: subSectionId,
              },
            }
          )

        if(!subSectionId) {
            return res.status(400).json({
                success:false,
                message:'SubSection Id to be deleted is required',
            });
        }

        
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      const updatedSection = await Section.findById(sectionId).populate("SubSection")
  
      return res.json({
        success: true,
        data:updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to delete SubSection',
            error: error.message,
        })
    }
}











// create subsection -- shubham 

// exports.createSubSection =   async (req , res) => {
     
//     try {
//         // fetch data from req body 
//         const {sectionId ,  title , timeDuration , description } = req.body ;
//         // extract  file/video
//         const video = req.files.video ;

//         // validation
//         if ( !sectionId  || !title ||  !description  || !video ) {
//             // !timeDuration

//             return res.status(400).json ({
//                 success: false ,
//                 message : "All fields are required",
//             });
//         }

//         // upload video to cloudinary 
//         const uploadDetails = await uploadImageToCloudinary(video , process.env.FOLDER_NAME);
//          // create a sub section 
//            const SubSectionDetails = await SubSection.create({
//              title : title ,
//              description: description,
//             // timeDuration: timeDuration,
//              videoUrl : uploadDetails.secure_url,
//            })
//          // update section with this sub section objectId
//            const updatedSection = await Section.findByIdAndUpdate({_id: sectionId}, 
//              { $push: {
//               SubSection: SubSectionDetails._id,
//                }},
//               {new: true}
//                ).populate("SubSection").exec();
            

//          // return resposne 
//          return res.status(200).json ({
//             success: true ,
//             message : "SUbSection created successfully",
//             updatedSection,
//          });


//     } catch (error){
//         return res.status(500).json ({
//             success: false ,
//             message : "Internal server error ",
//             error: error.message,
//          });

//     }
// }