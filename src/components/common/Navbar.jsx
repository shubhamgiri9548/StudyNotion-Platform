import React, {  useEffect, useState } from "react";
import { Link, matchPath } from "react-router-dom";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from '../cores/Auth/ProfileDropDown';
import { apiConnector } from "../../services/apiconnector";
 import { categories } from "../../services/apis";
import { IoIosArrowDown } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";



const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  //const { cart } = useSelector((state) => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();


  const [subLinks , setSubLinks] = useState([]);

  const  fetchSublinks = async() => {
       try {
        const result = await apiConnector("GET", categories.CATEGORIES_API);
        console.log("printing sublinks result" , result);
        setSubLinks(result.data.data);

       }  catch (error){
        console.error("Failed to fetch sublinks:", error);
       }

  }
  useEffect( () => {
      fetchSublinks();
  } , []);

  // function to match the path
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };


  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">

        {/* Image  */}
        <Link to="/">
          <img src={Logo} width={160} height={42} loading="lazy" />
        </Link>

         {/* Nav Links */}
         <nav className="relative">
          <ul
            className={`flex flex-col md:flex-row gap-x-6 text-richblack-25 ${
              isMenuOpen
                ? "fixed top-[60px] right-2 bg-richblack-800 p-4 gap-3 w-[40vw] rounded-lg z-20"
                : "hidden"
            } md:flex md:relative md:top-0 md:right-0 md:bg-transparent md:p-0`}
          >
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="relative flex items-center gap-2 group">
                    <p>{link.title}</p>
                    <IoIosArrowDown />

                    <div
                      className={`invisible absolute left-[50%] 
                                    translate-x-[-49%] ${
                                      Array.isArray(subLinks) &&
                                      subLinks.length > 0
                                        ? "translate-y-[15%]"
                                        : "translate-y-[40%]"
                                    }
                                 top-[50%] z-50
                                flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                                opacity-0 transition-all duration-200 group-hover:visible
                                group-hover:opacity-100 lg:w-[300px]`}
                    >
                      <div
                        className="absolute left-[50%] top-0
                                translate-x-[80%]
                                translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5"
                      ></div>

                      {Array.isArray(subLinks) && subLinks.length > 0 ? (
                        subLinks.map((subLink, index) => (
                          <Link
                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                            to={`catalog/${subLink.name}`}
                            key={index}
                          >
                            <p>{subLink.name}</p>
                          </Link>
                        ))
                      ) : (
                        <span className="loader"></span>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

       
        {/* login / signup / Dashboard */}
        <div
          className={`${isMenuOpen
              ? "fixed top-[212px] right-2 w-[40vw] bg-richblack-800 py-3 px-4 flex rounded-lg z-10 items-start flex-col" : "hidden md:flex"
          } md:flex-row md:relative md:top-0 md:right-0 md:bg-transparent md:p-0 md:w-auto gap-4`}
        >
          {user && user?.accountType !== "Instructor" && (
            <Link
              to="/dashboard/cart"
              className="relative pr-2 flex flex-row gap-2"
            >
              <AiOutlineShoppingCart className="text-2xl text-richblack-100 " />
              {isMenuOpen ? (
                <div className="text-[16px] text-richblack-100">Cart</div>
              ) : (
                ""
              )}
              {totalItems > 0 && (
                <span className=" absolute -bottom-2 -right-0 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="border  border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Sign Up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>

        <div
          className="mr-4 md:hidden text-[#AFB2BF] scale-150"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <RxHamburgerMenu />
        </div>
  
      </div>
    </div>
  );
};

export default Navbar;
