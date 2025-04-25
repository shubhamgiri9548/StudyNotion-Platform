import React, { useState } from "react";
import { useSelector } from "react-redux";

const Setting = () => {
    const { user } = useSelector((state) => state.profile);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        dateOfBirth: "",
        gender: user?.gender || "Male",
        contactNumber: user?.contactNumber || "",
        about: user?.about || ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Add update profile logic here
        console.log("Form Data:", formData);
    };

    return (
        <div className="text-white">
            <h1 className="text-3xl font-medium mb-8">Edit Profile</h1>
            
            <div className="bg-richblack-800 p-6 rounded-lg">
                {/* Profile Picture Section */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-[80px] h-[80px] rounded-full bg-red-500 flex items-center justify-center text-2xl">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium mb-2">Change Profile Picture</p>
                        <div className="flex gap-3">
                            <button className="bg-richblack-700 px-4 py-2 rounded">Select</button>
                            <button className="bg-yellow-50 text-black px-4 py-2 rounded">Upload</button>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                        {/* First Name */}
                        <div>
                            <label className="block mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full bg-richblack-700 rounded p-3"
                                placeholder="Enter first name"
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full bg-richblack-700 rounded p-3"
                                placeholder="Enter last name"
                            />
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block mb-2">Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full bg-richblack-700 rounded p-3"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block mb-2">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full bg-richblack-700 rounded p-3"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="block mb-2">Contact Number</label>
                            <input
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="w-full bg-richblack-700 rounded p-3"
                                placeholder="Enter contact number"
                            />
                        </div>

                        {/* About */}
                        <div>
                            <label className="block mb-2">About</label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                className="w-full bg-richblack-700 rounded p-3"
                                placeholder="Enter bio details"
                                rows="1"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            className="px-6 py-2 rounded bg-richblack-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded bg-yellow-50 text-black"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Setting;
    