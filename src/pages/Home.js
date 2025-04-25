import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRightLong } from "react-icons/fa6";
import HighlightText from '../components/cores/HomePage/HighlightText';
import CTAButton from '../components/cores/HomePage/Button'
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/cores/HomePage/CodeBlocks';
import TimeLineSection from '../components/cores/HomePage/TimeLineSection';
import LearningLanguageSection from '../components/cores/HomePage/LearningLanguageSection'
import InstructorSection from '../components/cores/HomePage/InstructorSection'
import Footer from "../components/common/Footer";
import ExploreMore from "../components/cores/HomePage/ExploreMore";
import ReviewSlider from '../components/common/ReviewSlider';


const Home = () => {
    return (
        <div>
              {/* {Main section 1} */}
               
               <div className='relative mx-auto flex flex-col w-11/12 items-center max-w-maxContent mt-4 text-white'>

                    <Link to={"/signup"}>
                    
                        <div className='mx-auto p-5 rounded-full font-bold bg-richblack-800 text-richblack-200 transition-all duration-200 hover:scale-95 w-fit '>
                                <div className='flex flex-row gap-3'>
                                    <p>Become an Instructor</p>
                                    <FaArrowRightLong className='mt-1'/>
                                </div>
                        </div>
                    
                    </Link>
                    
                    <div className='text-center mt-7 text-4xl  font-semibold'>
                        Empower your future with 
                        <HighlightText text={" Coding Skills"} />
                    </div>

                    <div className='mt-4 w-[90%]text-center text-lg  text-richblack-300'>
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                    </div>
                    
                    <div className='mt-8 flex flex-row gap-7'>
                        <CTAButton active={true} linkto={"/signup"}>
                        Learn More
                        </CTAButton>

                        <CTAButton active={false}  linkto={"/login"}>
                            Book a Demo
                        </CTAButton>
                    </div>
 
                    {/*  adding the video   */}
                    <div className='shadow-lg  shadow-blue-500/50 mt-11 mx-3'>
                        <video
                            src={Banner}
                            type="video/mp4"
                            autoPlay
                            loop
                            muted
                            className="rounded-sm shadow-lg w-full"
                        />
                    </div>
                     
                        {/* codeBlock 1 */}
                        <div>

                            <CodeBlocks 
                            position={"lg: flex-row"}
                            heading={
                                <div className='text-4xl font-semibold'>
                                    Unlock your 
                                    <HighlightText text={" Coding Potential"} />
                                    with our Online Courses
                                </div>
                            }
                            subheading={
                                "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you." 
                            }

                            ctabtn1={
                                {
                                    btnText:"Try it Yourself",
                                    linkto : "/signup",
                                    active: true,
                                }
                            }
                            
                            ctabtn2={
                                {
                                    btnText:"Learn More",
                                    linkto : "/login",
                                    active: false,
                                }
                            } 

                            Codeblock={
                                `<<<<!DOCTYPE html>\n<html>\n<head>\n<title>Example</title><linkrel="stylesheet"href="styles.css"\n/head>\nscript.js\nhelloworld`
                            }
                            codeColor={
                                "text-yellow-25"
                            }
                            
                            backgroundGradient={
                               true
                            }

                            />
                    
                        </div>

                          {/* codeBlock 2 */}
                          <div>

                                <CodeBlocks 
                                position={"lg: flex-row-reverse"}
                                heading={
                                    <div className='text-4xl font-semibold'>
                                        Start 
                                        <HighlightText text={" coding in seconds"} />
                                    </div>
                                }
                                subheading={
                                    "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson." 
                                }

                                ctabtn1={
                                    {
                                        btnText:"Continue Lession",
                                        linkto : "/signup",
                                        active: true,
                                    }
                                }

                                ctabtn2={
                                    {
                                        btnText:"learn more",
                                        linkto : "/login",
                                        active: false,
                                    }
                                } 

                                Codeblock={
                                    `<<<<!DOCTYPE html>\n<html>\n<head>\n<title>Example</title><linkrel="stylesheet"href="styles.css"\n/head>\nscript.js\nhelloworld`
                                }
                                codeColor={
                                    "text-pink-200"
                                }

                                backgroundGradient={
                                    false
                                }

                                />

                            </div>

                     <ExploreMore />

               </div>
               

                  
               {/* {Main section 2} */}
               <div className='bg-pure-greys-5 text-richblack-700'>
                   <div className='homepage_bg h-[310px]'>

                    <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
                         <div className='h-[150px]'></div>

                      <div className='flex flex-row gap-7 text-white'>
                       
                        <CTAButton active={true} linkto={"/signup"}>
                           <div className='flex flex-row gap-3'>
                               Explore Full Catalog
                               <FaArrowRightLong />
                           </div>
                        </CTAButton>

                        <CTAButton active={false} linkto={"/login"}>
                           <div className='flex flex-row gap-3'>
                               Learn More
                               <FaArrowRightLong />
                           </div>
                        </CTAButton>


                     </div>

                    </div>

                   </div>
              

               <div className='mx-auto  w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
                    
                    <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
                        <div className='text-4xl font-semibold w-[45%]'>
                            Get the skills you need for a
                            <HighlightText  text={" job that is in demand"} />
                        </div>
                   

                        <div className='flex flex-col gap-10 w-[40%] items-start'>
                             <div className='text-[16px]'>
                             The modern StudyNotion is the dictates its own terms. 
                             Today, to be a competitive specialist requires more than professional skills.
                             </div>
                          
                          <CTAButton active={true} linkto={"/signup"} >
                             <div>
                                Learn More
                             </div>
                          </CTAButton>

                        </div>

                     </div> 

                    <TimeLineSection />

                    <LearningLanguageSection />  
                   

               </div>

             

               </div>

                {/* {Main section 3} */}
                <div className='w-11/12 mx-auto max-w-maxContent  flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>

                       <InstructorSection /> 

                       <h2 className='text-center text-4xl font-semobold mt-10'>Review From Other Learners</h2>

                       {/* <ReviewSlider/  > */}
                        <ReviewSlider />

                </div>

                 {/* {Main section 4} or Footer */}
                 <Footer />

                

        </div>
    );
};

export default Home;