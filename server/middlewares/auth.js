const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require("../models/User");





// auth  ( authentication middleware )
exports.auth  = async (req , res , next) => {
        
        try{ 
        // extract token 
        const token = req.body.token || req.cookies.token || req.get("Authorization")?.replace("Bearer ", "");
         
        // if token is missing . then return response 
        if (!token){
            return res.status(401).json ({
                success: false,
                message : 'tOken is missing '
            })
        }

        // verify the token 
        try {
           const decode =   jwt.verify(token, process.env.JWT_SECRET);
            //console.log(decode);
            req.user =   decode ;

        } catch(error){
             // verification  issue 
             return res.status(401).json({
                success: false,
                message : "Token is invalid",
             });
        }
        next();

        }  catch(error)  {
            console.log(error);
            return res.status(401).json ({
                success: false,
                message : "something went wrong while validate the token"
            })  ;

        }
}

// isStudent 

exports.isStudent = async ( req , res , next) => {
      
    try {
         
        if(req.user.accountType !== "Student") {
            return res.status(401).json ({
                success: false,
                message : "this is a protected route for students only"
            })
        }
       next();

    } catch(error){
      return res.staus(500).json ({
        success : false,
        message: "user role cannot be verified, please  try again"
      })

    }

}



// isInstructor 
exports.isInstructor = async ( req , res , next) => {
      
    try {
         
        if(req.user.accountType !== "Instructor") {
            return res.status(401).json ({
                success: false,
                message : "this is a protected route for Instructor only"
            })
        }
       next();

    } catch(error){
      return res.staus(500).json ({
        success : false,
        message: "user role cannot be verified, please  try again"
      })

    }

}


// isAdmin
exports.isAdmin = async ( req , res , next) => {
      
    try {
         
        if(req.user.accountType !== "Admin") {
            return res.status(401).json ({
                success: false,
                message : "this is a protected route for Admin only"
            })
        }
       next();

    } catch(error){
      return res.staus(500).json ({
        success : false,
        message: "user role cannot be verified, please  try again"
      })

    }

}