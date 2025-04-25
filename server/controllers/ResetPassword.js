const User = require("../models/User");
const crypto = require('crypto')
const mailSender  = require("../utils/mailSender");
const bcrypt = require('bcrypt');


// resetPassword Token 

exports.resetPasswordToken = async (req , res) => {
    
    try {  

      // get email from req body 
      const email = req.body.email;
      // check user for this email , email validation 
      const user = await User.findOne({email : email});
        
       if ( !user) {
           return res.json({
            success: false,
            message : "Your Email is not registerd with us",
          }); 
       }
        

      // generate token 
      const token  = crypto.randomUUID();

      // update user by adding token and expiring time 
      const updatedDetails   = await User.findOneAndUpdate (
                                            {email: email},
                                            {
                                                token : token,
                                                resetPasswordExpires: Date.now() + 5*60*1000,
                                            },
                                            {new: true});

      // creaet url 
       const url = `http://localhost:3000/update-password/${token}`

      // send mail containg the url 
      await mailSender(email,  "Password Resent Link", `Password Reset Link: ${url}`,
      )

      // return  response 
        return res.status(200).json({
            success:true,
            message : "Email sent successsfull , please check email and change pwd ",
        });

    }  catch(error){
         console.log(error);
         return res.status(500).json({
          error: error.message,
          success: false,
          message : "Something went wrong while reset pwd "
         
    })
   }

}


//  reset password handler 

exports.resetPassword = async  (req, res) => {
      
     try {
     // data fetch
     const {password , confirmPassword  , token } =  req.body;
     // validation 
     if( password !== confirmPassword) {
        return res.json ({
            success:false,
            message : 'password not matching',
        });
     }
     
     // get userdetails from db using token
     const userDetails  = await User.findOne({token: token});
     // if no entry -- invalid token 
     if (!userDetails ){
        return res.json ({
            success: false,
            message : "token is invalid ",
        })
     }
     // token time check 
      if ( userDetails.resetPasswordExpires <  Date.now() ) {
          
        return res.json ({
             success: false,
             message : "Token is expired, please regnerate your token"
        })

      }
     
     // hash the password
       const hashedPassword  = await bcrypt.hash(password , 10);
     // password update 
       await User.findOneAndUpdate(
          {token: token},
          {password: hashedPassword},
          {new:true},
       )

     // return response 
     return res.status(200).json ({
        success: true,
        message : "password reset successfully"
     })

    } catch(error){
        console.log(error);
        return res.status(500).json({
          error: error.message,
         success: false,
         message : "Something went wrong while reset pwd "
   })
}

} 