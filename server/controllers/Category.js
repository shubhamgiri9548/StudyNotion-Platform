
const Category = require("../models/Category");
const Course = require("../models/Course");
function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}


exports.createCategory =  async (req , res) => {
        
       try {
       // fetch the data 
       const {name , description} = req.body;
       
       // validate 
       if ( !name || !description) {
          return res.status(400).json ({
            success: false ,
            message : "Fill all the details "
          });

       }
        
       // create entry in DB
       const CategoryDetails = await Category.create ( {
           name : name,
           description : description,
       });
       console.log(CategoryDetails);
       
       return res.status(200).json({
        success: true,
        message: "Category created successfully",
        data: CategoryDetails, // Optionally return the created category
    });

    }  catch(error) {
       return res.status(500).json ({   
        error: error.message,
        success: false,
        message : error.message,
       });

    }

}  

// getAll handler function 
 
exports.showAllCategories = async (req , res) => {
      
     try {
         const allCategory = await Category.find( {} , {name:true , description: true});
          
         res.status(200).json ({
            success : true,
            message : "All category returned successfully ",
            data : allCategory,
         })


     }  catch (error){
         return res.status(500).json ({   
            success: false,
            message : error.message,
           });
     }
}

//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      //console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "course",
          match: { status: "Published" },
          populate: "ratingAndReviews",
          populate: {
            path: "instructor",
          },
        })
        .exec()
  
      console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      if (!selectedCategory.course || selectedCategory.course.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "course",
          match: { status: "Published" },
          populate: {
            path: "instructor",
          },
        })
        .exec()
        //console.log("Different COURSE", differentCategory)
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "course",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.course)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingCourses COURSE", mostSellingCourses)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  
  }


