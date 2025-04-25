import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState(null);

  const getEnrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch (error) {
      console.log("Unable to Fetch Enrolled Courses");
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <>
      <div className="text-2xl text-richblack-50 sm:text-3xl">
        Enrolled Courses
      </div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
          {/* TODO: Modify this Empty State */}
        </p>
      ) : (
        <div className="my-6 text-richblack-5 sm:my-8">
          {/* Headings */}
          <div className="hidden rounded-t-lg bg-richblack-500 sm:flex">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>

          {/* Course Names */}
         {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex flex-col items-start gap-4 border border-richblack-700 p-4 sm:flex-row sm:items-center sm:p-0 ${
                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={i}
            >
              {/* Course Thumbnail and Name */}
              <div
                className="flex w-full cursor-pointer items-center gap-4 sm:w-[45%] sm:px-5 sm:py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.SubSection?.[0]?._id}`
                  );                                          
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-12 w-12 rounded-lg object-cover sm:h-14 sm:w-14"
                />
                <div className="flex flex-col gap-1 sm:gap-2">
                  <p className="text-sm font-semibold sm:text-base">
                    {course.courseName}
                  </p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription.length > 50  
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="w-full sm:w-1/4 sm:px-2 sm:py-3">
                <p className="text-sm sm:text-base">
                  Duration: {course?.totalDuration} 
                </p>
              </div>

              {/* Progress */}
              <div className="w-full sm:w-1/5 sm:px-2 sm:py-3">
                <p className="text-sm sm:text-base">
                  Progress: {course.progressPercentage || 0}%
                </p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>

            </div>
          ))}
          
        </div>
      )}
    </>
  );
};

export default EnrolledCourses;
