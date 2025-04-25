const User  = require("../models/User");
const OTP  =  require("../models/OTP");
const Profile =   require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt  =  require('bcrypt');
const jwt  = require("jsonwebtoken");
const { trusted } = require("mongoose");
const mailSender =  require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
require('dotenv').config();



// send OTP 
exports.sendOTP  = async (req , res) =>  { 
      
   try{
    //fetch email from the  body
    const {email} =  req.body;
   
   // check if  user already exist 
   const checkUserPresent = await User.findOne( {email} );
    
   // if user already exist , then return resonse 
     if (checkUserPresent) {
        return res.status(401).json({
            success: false,
            message : "user already registerd",
        }) 
     }
    
     // generate otp 
     var otp  = otpGenerator.generate(6 , {
        upperCaseAlphabets: false,
        lowerCaseAlphabets : false, 
        specialChars : false,
     });
     console.log("OTP generated : ",  otp);
     
     // check  otp is unique or not  
     let result  = await OTP.findOne({otp:otp});

     while ( result) {
         otp = otpGenerator.generate( 6 , {
            upperCaseAlphabets: false,
            lowerCaseAlphabets : false, 
            specialChars : false,
         });
         result  = await OTP.findOne({otp:otp});
     }

     const otpPayload =  {email , otp} ;

     // create an entry for OTP 
     const otpBody = await OTP.create(otpPayload);
     console.log(otpBody);


     // return response successfully
     res.status(200).json ({
        success: true,
        message: "OTP sent successfully",
        otp,
     })

   } catch (error) {

    console.log(error);
    return res.status(500).json({
        success: false ,
        message:error.message,
    })
      
   }

}

// signup ..........................................
exports.signup = async (req , res) =>  {
      
    try {
     // data fetch from request ki body
      const {email ,firstName , lastName , password , confirmPassword , accountType , contactNumber ,  otp } = req.body;
     
     // validate krlo 
     if ( !firstName || !lastName || !email || !password || !confirmPassword || !otp )  {
         
        return res.status(403).json( {
            success: false ,
            message: "all fields are required",
        })
        

     }

     // match the password   
     if (password !== confirmPassword ){
        return res.status(404).json ({
            success:false,
            message: " Password do not match , plz try again "
        })
     } 

     const existingUser = await User.findOne( {email} );
    
     // if user already exist , then return resonse 
       if (existingUser) {
          return res.status(401).json({
              success: false,
              message : "user already registerd",
          }) 
       }
     
       // find most recent otp stored for the user 
       const recentOtp  = await OTP.find({email}).sort({createdAt: -1}).limit(1);
       console.log(recentOtp);

       // validate otp
       if ( recentOtp.length === 0) {
            // otp not found 
            return res.status(400).json ({
                success: false,
                message : "OTP not found "
            })
       } else if ( otp !== recentOtp[0].otp) {
         // invalid OTP
         return res.status(400).json ({
           success: false,
           message : "OTP is not valid "

         } )
       }
       
       // OTP is verified now 

       //Hash Password 
       const hashedPassword  = await bcrypt.hash(password , 10) ;

        // entry create in DB
        
        const profileDetails  = await Profile.create ({
             gender: null,
             dateOfBirth : null,
             about : null ,
             contactNumber: null
        });

       // entry create in db
       const user =  await User.create({
          firstName ,
          lastName,
          email,
          contactNumber,
          password: hashedPassword,
          accountType,
          additionalDetails: profileDetails._id,
          image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
       });

       // return res
       return res.status(200).json({
        success: true,
        message: "user is registered successfully",
        user,
       });

    } catch (error){
        console.log(error);
        return res.json(500).json ( {
            success : false,
            message : "user cannot  be registered . plz try again ",
        })
    }

}


// login ...............................................

exports.login  = async (req , res) => {
        
      try {
        // get data from the req body 
        const {email , password } = req.body;
        // validatoin data

        if ( !email || !password ) {
            return res.status(400).json ({
                success: false,
                message : "All fields are required , please try again "
            })
        }
         
        // user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails")

        if (!user) {
             return res.status(401).json ({
                success: false,
                message : "user is not registered , Plz signup first ",
             })
        }
        
        // generate Jwt after passowrd matching 
        if (await bcrypt.compare(password , user.password)) {
               
               const payload  = {
                email : user.email,
                id: user._id,
                accountType : user.accountType,
               }

               const token = jwt.sign(payload , process.env.JWT_SECRET , {
                   expiresIn:"2h",
               });
               user.token  = token ;
               user.password  = undefined ;         // we have to undefined the pswd 
            
               // options for cookie
               const options  = {
                    expires : new Date(Date.now() + 3*24*60*60*1000),
                    httpOnly : true,
               }

               //create cookie and send response 
               res.cookie("token" , token , options).status(200).json ({
                success: true,
                token,
                user,
                message: 'Logged in successfully'
               })
        }
         
        else {
             return res.status(403).json ({
                success: false,
                message : "Password do not match "
             })
        }


      }  catch(error){

         console.log(error);
         return res.status(500).json ({
            success: false,
            message : "Login failure plz try again "
         })


      }

}



/// change password   handler 

exports.changePassword  = async ( req , res ) => {
          
    try {
      
   //  step 1: get data from req.body 
   const { oldPassword, newPassword, confirmPassword } = req.body;
   const userId = req.user.id;                                       // Assuming you have user info in req.user (from authentication middleware)

  
   // Step 2: Validation
         if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                  success: false,
                  message: 'All fields are required' 
               });
      }   
      if (newPassword !== confirmPassword) {
         return res.status(400).json({
            success: false,
            message: 'New password and confirm password do not match' 
            });
      }

       // Step 3: Fetch the user from the database
       const user = await User.findById(userId);
       if (!user) {
           return res.status(404).json({ 
            success: false,
            message: 'User not found' ,
         });
       }

         // Step 4: Verify the old password
         const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
            success: false ,   
            message: 'Old password is incorrect'
          });
        }

          // Step 5: Hash the new password
          const hashedPassword = await bcrypt.hash(newPassword, 10);
  
          // Step 6: Update the password in the database
          user.password = hashedPassword;
          await user.save();


          // Step 7: Send email notification  ( dought )
   
		try {
			const emailResponse = await mailSender(
				user.email,
				passwordUpdated(
					user.email,
					`Password updated successfully for ${user.firstName} ${user.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

               
         // return response
         return res.status(200).json ({
            success: true ,
            message : "Password is updated successfully",
         })
   
    }  catch (error) {
      console.error('Error in changePassword:', error);
      res.status(500).json({ 
          success: false ,
         message: 'Internal server error'
       });

    }

}