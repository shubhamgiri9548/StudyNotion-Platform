import React from "react";
import {  useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { VscSignOut } from "react-icons/vsc";
import SidebarLink from "./SidebarLink";
import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";
import ConfirmationModal from "../../common/ConfirmationModal";
import { useState } from "react";

const Sidebar = () => {
  const { user, loading: profileLoading } = useSelector((state) => state.profile );
  const { loading: authLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: Button to toggle sidebar */}
      <button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className="fixed right-4 top-24 z-10 block rounded-lg bg-richblack-700 p-2 text-richblack-5 
        lg:hidden"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-14 md:top-0 inset-y-0 left-0 z-40 h-[calc(100vh-3.5rem)] min-w-[220px] transform border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10 transition-transform duration-300 ease-in-out 
          ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            );
          })}
        </div>
         
         {/* horizonatal line  */}
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
   
        <div className="flex flex-col">
           {/* setting button */}
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
            {/* Logout button */}
          <button
            onClick={() => {
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              });
            }}
            className="px-8 py-2 text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default Sidebar;
