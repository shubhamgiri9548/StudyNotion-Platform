import React from 'react';
import HighlightText from './HighlightText';
import CTAButton from './Button';
import { FaArrowRightLong } from "react-icons/fa6";
import { TypeAnimation } from 'react-type-animation';


const CodeBlocks = ({position , heading, subheading , ctabtn1 , ctabtn2 , backgroundGradient , Codeblock , codeColor}) => {
    return (
        <div className={`flex ${position} my-20 justify-between gap-10`}>
           
          {/* section 1 */}
            <div className='w-[50%] flex flex-col gap-8'>
               {heading}

               <div className='text-richblack-300 font-bold'>
               {subheading}
               </div>
              
               <div className='flex flex-row gap-7 mt-7'>
                   <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>

                    <div className='flex gap-2 items-center'>
                        {ctabtn1.btnText}
                        <FaArrowRightLong />
                    </div>
                   </CTAButton>

                   <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                        {ctabtn2.btnText}
                    </CTAButton>
              </div>

              </div>

                {/*codeBlocks section 2 */ }
                <div className={`h-fit flex gap-2 text-10[px] w-[100%] py-4 lg:w-[500px] 
                    ${backgroundGradient ? 'bg-gradient-to-r from-transparent via-blue-500/50 to-transparent' : 
                    'bg-gradient-to-b from-transparent to-purple-500/40'}`
                    }>
                        {/* homework : gradient  */}

                            <div className='w-[10%] text-center font-bold font-inter text-richblack-400 flex flex-col'>
                                <p>1</p>
                                <p>2</p>
                                <p>3</p>
                                <p>4</p>
                                <p>5</p>
                                <p>6</p>
                                <p>7</p>
                                <p>8</p>
                                <p>9</p>
                                <p>10</p>
                                <p>11</p>
                            </div> 
                                
                                <div className={`w-[90%] flex flex-col gap-2 font-bold  font-mono ${codeColor} pr-2`}>
                                    <TypeAnimation 
                                    sequence={[Codeblock , 2000 , ""]}
                                    repeat={Infinity}
                                    cursor={true}
                                    
                                    style={
                                        {
                                            whiteSpace: "pre-line",
                                            display:"block",
                                        }
                                    }
                                     omitDeletionAnimation={true}
                                    />
                                </div>
               </div>

              
        </div>
    );
};

export default CodeBlocks;