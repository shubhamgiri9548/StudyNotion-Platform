import React from 'react'
import { Outlet  ,useParams} from 'react-router-dom'
import {useSelector , useDispatch} from 'react-redux'
import {useEffect, useState} from 'react'
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI'
import { setCourseSectionData, setCompletedLectures, setEntireCourseData, setTotalNoOfLectures } from "../slices/viewCourseSlice"
import VideoDetailsSidebar from '../components/cores/ViewCourse/VideoDetailsSidebar'
import CourseReviewModal from '../components/cores/ViewCourse/CourseReviewModal'


const ViewCourse = () => {
     
    const [reviewModal, setReviewModal] = useState(false);
    const  {courseId} = useParams();
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();

    useEffect(()=>{
        const setCourseSpecificDetails = async ()=>{
            try {
                const courseData = await getFullDetailsOfCourse(courseId,token);
                dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
                dispatch(setCompletedLectures(courseData.completedVideos));
                dispatch(setEntireCourseData(courseData.courseDetails));
                 
                let lectures = 0;
                courseData?.courseDetails?.courseContent?.forEach((section)=>{
                    lectures += section?.SubSection?.length;
                });
                dispatch(setTotalNoOfLectures(lectures));
            } catch (error) {
                console.log(error);
            }
        }
        setCourseSpecificDetails();
    },[]) 

  return (
    <>
        <div className="relative flex md:flex-row flex-col-reverse pt-8 md:pt-0 min-h-[calc(100vh-3.5rem)]">
            <VideoDetailsSidebar setReviewModal={setReviewModal} />
            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className="md:mx-6 mx-2 text-center md:text-start">
                <Outlet />
                </div>
            </div>
            {reviewModal && (<CourseReviewModal setReviewModal={setReviewModal} />)}
        </div>
        
    </>
  )
}   

export default ViewCourse;
 