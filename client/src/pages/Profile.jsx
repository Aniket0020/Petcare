import React, { useState, useEffect } from "react";
import axios from "axios";

import { User, Phone, MapPin, Building } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("view");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Get role from localStorage
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
          setError("Authentication token missing");
          return;
        }

        if (!role || (role !== "doctor" && role !== "user")) {
          setError("Invalid user role");
          return;
        }

        const url =
          role === "doctor"
            ? "http://localhost:3000/doctor/profile"
            : "http://localhost:3000/profile/get";

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
        setFormData({
          name: response.data.name || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
          city: response.data.city || "",
          state: response.data.state || "",
          image: response.data.image || null,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      // Use correct update endpoint based on role
      let url = "";
      if (role === "doctor") {
        url = "http://localhost:3000/doctor/update"; // Doctor profile update endpoint
      } else {
        url = "http://localhost:3000/profile/update"; // User profile update endpoint
      }

      const response = await axios.post(url, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(response.data.profile || response.data); // Adjust if your API returns profile inside data or directly
      setActiveSection("view");
      toast.info("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
    }
  };

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg max-w-md mx-auto mt-8">
        Error: {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="max-w-2xl mx-auto">
        {/* Tab Buttons */}
        <div className="flex justify-center space-x-4 mb-8 gap-2">
          <button
            onClick={() => setActiveSection("view")}
            className={`px-6 py-2 rounded font-medium  ${
              activeSection === "view"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            View Profile
          </button>
          <button
            onClick={() => setActiveSection("update")}
            className={`px-6 py-2 rounded font-medium ${
              activeSection === "update"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Update Profile
          </button>
        </div>

        {/* Profile View */}
        {activeSection === "view" && (
          <div className="max-w-lg mx-auto  ">
            <div className="relative bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                <h2 className="text-2xl font-bold text-center relative z-10 mb-5">
                  Your Profile
                </h2>
              </div>

              <div className="px-10 py-6 mb-2">
                {/* Profile Image Section */}
                <div className="flex justify-center -mt-14 mb-6 relative z-10">
                  {profile.image ? (
                    <img
                      src={`data:image/jpeg;base64,${profile.image}`}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 border-4 border-white shadow-lg flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>

                {/* Profile Information */}
                <div className="space-y-4">
                  {/* Name and Phone Row */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-0">
                            Full Name
                          </p>
                          <p className="text-gray-800 font-semibold mb-0">
                            {profile.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-0">
                            Phone Number
                          </p>
                          <p className="text-gray-800 font-semibold mb-0">
                            {profile.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 font-medium mb-0">
                          {role === "doctor" ? "Clinic Address" : "Address"}
                        </p>
                        <p className="text-gray-800 font-semibold leading-relaxed mb-0">
                          {profile.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* City and State Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-0">
                            City
                          </p>
                          <p className="text-gray-800 font-semibold mb-0">
                            {profile.city || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-0">
                            State
                          </p>
                          <p className="text-gray-800 font-semibold mb-0">
                            {profile.state || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom decorative element */}
              <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
            </div>
          </div>
        )}

        {/* Profile Update */}
        {activeSection === "update" && (
          <div className="max-w-lg mx-auto">
            <div className="relative bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                <h2 className="text-2xl font-bold text-center relative z-10 mb-5">
                  Update Profile
                </h2>
              </div>

              <div className="px-10 py-6 mb-2">
                <form onSubmit={handleUpdate} className="space-y-4">
                  {/* Profile Image Upload */}
                  <div className="flex justify-center -mt-14 mb-6 relative z-10">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : profile.image ? (
                      <img
                        src={`data:image/jpeg;base64,${profile.image}`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 border-4 border-white shadow-lg flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                    <label className="block text-sm font-medium text-gray-500 capitalize mb-2">
                      Upload Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-ful border rounded-sm border-gray-200 p-2"
                    />
                  </div>

                  {/* Form Fields */}
                  {["name", "phone", "address", "city", "state"].map(
                    (field) => (
                      <div
                        key={field}
                        className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100"
                      >
                        <label className="block text-sm font-medium text-gray-500 capitalize mb-2">
                          {field}
                        </label>
                        <input
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                          // placeholder={`Enter ${field}`}
                        />
                      </div>
                    )
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition duration-300 font-medium"
                  >
                    Save Changes
                  </button>
                </form>
              </div>

              {/* Bottom decorative element */}
              <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
