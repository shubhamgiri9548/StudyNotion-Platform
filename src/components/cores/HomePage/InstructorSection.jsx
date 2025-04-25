import React from 'react';
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText';
import CTAButton from './Button';
import { FaArrowRightLong } from "react-icons/fa6";


const InstructorSection = () => {
    return (
        <div className="mt-16">
        <div className='flex flex-row gap-24 items-center ml-5 mr-5'>
            
            <div className='w-[50%]'> 
                <img src={Instructor} 
                 alt='InstructorImage'
                 className='shadow-white'
                 />
            </div>
            
            <div className='w-[50%] flex flex-col gap-10'>
                <div className='text-4xl font-semibold w-[50%]'>
                    Become an 
                    <HighlightText text={" Instructor"}/>
                </div>

                <p className='font-semibold text-[16px] w-[80%] text-richblack-300'>
                    Instructors from around the world teach millions of students on StudyNotion.
                     We provide the tools and skills to teach what you love.
                </p>

               <div className='w-fit'>
                  <CTAButton active={true} linkto={"/signup"} >
                        <div className='flex flex-row gap-2 items-center '>
                        Start Teaching Today 
                        <FaArrowRightLong /> 
                        </div>
                    </CTAButton>
               </div>
              

            </div>
        </div>
    </div>
    );
};

export default InstructorSection;