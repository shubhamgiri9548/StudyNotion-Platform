import "./App.css";
import { Route ,Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword'
import OpenRoute from "./components/cores/Auth/OpenRoute";
import UpdatePassword from "./pages/updatePassword";
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About'
import ContactPage from "./pages/ContactPage";
import MyProfile from "./components/cores/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/cores/Auth/PrivateRoute";
import Error from "./pages/Error";
import Settings from "./components/cores/Dashboard/Settings";
import EnrolledCourse from "./components/cores/Dashboard/EnrolledCourse";
import { ACCOUNT_TYPE } from "./utils/constants";
import Cart from "./components/cores/Dashboard/Cart/index";
import EnrolledCourses from "./components/cores/Dashboard/EnrolledCourse"
import { useSelector } from "react-redux";
import AddCourses from "./components/cores/Dashboard/AddCourses";
import MyCourses from "./components/cores/Dashboard/AddCourses/MyCourses";
import EditCourse from "./components/cores/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/cores/ViewCourse/VideoDetails";
import Instructor from "./components/cores/Dashboard/InstructorDashboard/Instructor";



function App() {
     
  const {user} = useSelector((state) => state.profile);

  return (
       <div className="w-screen bg-richblack-900 min-h-screen flex flex-col font-inter ">
          <Navbar />

          <Routes>
             <Route path="/" element={<Home/>} />
             <Route path="catalog/:catalogName" element={<Catalog/>} />
             <Route path="courses/:courseId" element={<CourseDetails/>} />
              
            <Route path="signup" element={
              <OpenRoute>
                <Signup/>
              </OpenRoute>
            } />
             
            <Route path="login" element={
              <OpenRoute>
                <Login/>
              </OpenRoute>
            } />

            <Route path="forgot-password" element={
              <OpenRoute>
                <ForgotPassword/>
                </OpenRoute>}
              />
               
               <Route path="update-password/:id" element={
              <OpenRoute>
                <UpdatePassword/>
                </OpenRoute>}
              /> 
              
              <Route path="verify-email" element={
              <OpenRoute>
                <VerifyEmail/>
                </OpenRoute>}
              />

            <Route
             path="about"
              element={
               <About/>
                }
              />
              
              <Route 
                path="contact"
                element={
                <ContactPage/>
                }
              />
                
                {/* dash board  */}
                <Route
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
                >
                   <Route path="dashboard/my-profile" element={<MyProfile />}  />
                   <Route path="dashboard/settings" element={<Settings />}  />
                   <Route path="dashboard/enrolled-courses" element={<EnrolledCourse />}  />

                   {
                user?.accountType === ACCOUNT_TYPE.STUDENT && (
                  <>
                  <Route path="dashboard/cart" element={<Cart />} />
                  <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
                  </>
                )
                }

                
                {
                user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                  <>
                  <Route path="dashboard/instructor" element={<Instructor/>} />
                  <Route path="dashboard/add-course" element={<AddCourses/>} />
                  <Route path="dashboard/my-courses" element={<MyCourses/>} />
                  <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
                 
                  </>
                )
                }
              
                </Route>
               

               <Route
               element={
                <PrivateRoute>
                  <ViewCourse/>
                </PrivateRoute>
               }
               >
                    {
                      user?.accountType === ACCOUNT_TYPE.STUDENT && (
                        <>
                        <Route
                         path="View-course/:courseId/section/:sectionId/sub-section/:subSectionId" 
                         element={<VideoDetails/>} />
                        </>
                      )
                    }
                </Route>

              <Route path="*" element={<Error />}/>

          </Routes>
       </div>
  );
}

export default App;
 