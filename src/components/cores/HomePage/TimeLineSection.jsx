import React from 'react';
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg';
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg';
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg';
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg';
import timeLineImage from "../../../assets/Images/TimelineImage.png"


const TimeLineSection = () => {
       
    const timelineData = [
        { Logo: Logo1, heading: "Leadership", Description: "Fully committed to the success company" },
        { Logo: Logo2, heading: "Responsibility", Description: "Students will always be our top priority" },
        { Logo: Logo3, heading: "Flexibility", Description: "The ability to switch is an important skills" },
        { Logo: Logo4, heading: "Solve the problem", Description: "Code your way to a solution" },
    ];   

    return (
        <div className='flex flex-row gap-15 items-center'>
           
           <div className='flex flex-col w-[45%] gap-5'>
               {
                timelineData.map( (element , index) => {  
                     return (
                        <div className='flex flex-row gap-6' key={index}>
                            <div className='h-[50px] w-[50px] items-center'>
                                <img src={element.Logo} alt='Logo' />
                            </div>
                             
                             <div>
                                 <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                 <p className='text-base'>{element.Description}</p>
                              </div>  
                       </div>
                     )

                })
               }
           </div>

            <div className='relative shadow-blue-200'>

                <img src={timeLineImage} 
                alt="timeLineImage"
                 className='shadow-white object-cover h-fit'
                />

                <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-[-50%] '>

                    <div className='flex flex-row gap-5 items-center border-r border-r-white px-7 '>
                         <p className='text-3xl font-bold'>10</p>
                         <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                    </div>

                    <div className='flex gap-5 items-center px-7'>
                        <div className='flex flex-row gap-5 items-center'>
                            <p className='text-3xl font-bold'>250</p>
                            <p className='text-caribbeangreen-300 text-sm'>Types of courses</p>
                        </div>
                    </div>
                </div>

            </div>


        </div>
    );
};

export default TimeLineSection;