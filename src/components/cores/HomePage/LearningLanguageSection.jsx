import React from 'react';
import HighlightText from './HighlightText';
import ProgressImage from "../../../assets/Images/Know_your_progress.png"
import CompareImage from "../../../assets/Images/Compare_with_others.png"
import PlanImage from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from "../HomePage/Button";

const LearningLanguageSection = () => {
    return (
     <div className='w-11/12 max-w-maxContent flex flex-col  mt-[130px] items-center mb-32 '>

          <div className='flex flex-col gap-5 items-center'>

              <div className='text-4xl font-semibold text-center '>
                Your swiss Knife for 
                <HighlightText text=" learing any language"/>
                </div>

                <div className='text-center text-richblack-600 mx-auto font-semibold text-base w-[70%]'>
                    Using spin making learning multiple languages easy. with 20+ languages
                    realistic voice-over, progress tracking, custom schedule and more.
                </div>

            <div className='flex flex-row mt-6 justify-center items-center'>
              
                    <img src={ProgressImage} alt='ProgressImage'
                    className='object-contain -mr-14'
                    />
        
                    <img src={CompareImage} alt='CompareImage'
                        className='object-contain'
                    />

                    <img src={PlanImage} alt='PlanImage'
                   className='object-contain -ml-20'
                    />
             </div>

  
                <div className='w-fit '>
                   <CTAButton active={true} linkto={"/login"}>
                      <div>
                        Learn More 
                      </div>
                   </CTAButton>
                </div>
          

          </div>
            

          
    </div>
    );
};

export default LearningLanguageSection;