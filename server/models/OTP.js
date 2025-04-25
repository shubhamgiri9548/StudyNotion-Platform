const mongoose =  require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate =  require("../mail/templates/emailVerificationTemplate");


const OTPSchema  = new mongoose.Schema({
      
    email:{
        type:String,
        required: true,
    },
    otp:{
        type:String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires : 5*60 ,
    }

})

// a function to send emails 

async function sendVerificationEmail(email , otp)  {
    
     try {
          const mailResponse = await mailSender(email , "verification  Email from studyNotion"  , emailTemplate(otp));
          console.log("Email sent successfullly" , mailResponse);

     } catch (error) {
           console.log("error occured while sending mails" , error);
           throw error;
     }

}

OTPSchema.pre("save" , async function(next) {
    console.log("Mail in pre hook", this.email)
    await sendVerificationEmail(this.email , this.otp);
    next();
});

module.exports =  mongoose.model("OTP" , OTPSchema);