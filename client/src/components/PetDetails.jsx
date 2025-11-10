import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ActivateQR from "./ActivateQR";
import Button from "@mui/material/Button";
import ShareIcon from "@mui/icons-material/Share";
import QrCodeIcon from "@mui/icons-material/QrCode";

const PetDetails = () => {
  const URL = import.meta.env.VITE_API_URL;
  const [isMedOpen, setIsMedOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const { petId } = useParams();
  const location = useLocation();
  const isPublicView = location.pathname.startsWith("/public/pet/");
  const [pet, setPet] = useState(null);
  const navigate = useNavigate();

  const [newRecord, setNewRecord] = useState({
    date: "",
    description: "",
    vet: "",
  });

  const handleMedRecordChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMedicalRecord = async () => {
    if (!newRecord.date || !newRecord.description || !newRecord.vet) {
      toast.error("Please fill all fields");
      return;
    }

    const updatedRecords = [...(pet.medicalRecords || []), newRecord];
    const updatedData = {
      ...updatedPet,
      medicalRecords: updatedRecords,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${URL}/pet/${petId}`,
        { ...updatedData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPet(res.data.pet || res.data);
      setUpdatedPet((prev) => ({ ...prev, medicalRecords: updatedRecords }));
      setNewRecord({ date: "", description: "", vet: "" });
      toast.success("Medical record added!");
    } catch (error) {
      console.error("Failed to update medical records:", error);
      toast.error("Error saving medical record.");
    }
  };

  const [updatedPet, setUpdatedPet] = useState({
    about: "",
    name: "",
    breed: "",
    DOB: "",
    gender: "",
    weight: "",
    color: "",
    age: "",
    vaccinated: false,
    owner: { name: "", contactNumber: "" },
    image: "",
  });

  useEffect(() => {
    fetchPet();
  }, []);

  const fetchPet = async () => {
    try {
      const url = isPublicView
        ? `${URL}/pet/public/${petId}`
        : `${URL}/pet/${petId}`;
      const headers = isPublicView
        ? {}
        : { Authorization: `Bearer ${localStorage.getItem("token")}` };

      const res = await axios.get(url, { headers });
      setPet(res.data);
      setUpdatedPet({
        about: res.data.about,
        name: res.data.name,
        breed: res.data.breed,
        DOB: res.data.DOB,
        gender: res.data.gender,
        weight: res.data.weight,
        color: res.data.color,
        vaccinated: res.data.vaccinated,
        owner: res.data.owner,
        image: res.data.image || "",
      });
      if (res.data.template) {
        setSelectedTemplate(res.data.template);
      }
    } catch (error) {
      console.error("Error fetching pet:", error);
      alert("Could not fetch pet data");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "ownerName" || name === "contactNumber") {
      setUpdatedPet((prev) => ({
        ...prev,
        owner: {
          ...prev.owner,
          [name === "ownerName" ? "name" : "contactNumber"]: value,
        },
      }));
    } else if (name === "image") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUpdatedPet((prev) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setUpdatedPet((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${URL}/pet/${petId}`,
        { ...updatedPet, template: selectedTemplate }, // added template here
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPet(res.data.pet || res.data);
      toast.info("Pet info updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Falied to update Pet info !");
    }
  };

  const handleShareLink = () => {
    const publicLink = `${window.location.origin}/pet/${petId}`;
    navigator.clipboard.writeText(publicLink);
    toast.success("Link copied! You can now share your pet’s profile.");
  };

  const toggleQRModal = (name, link) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      link
    )}&size=200x200`;

    setQrData({ name, link, qrUrl });
    setQrModalVisible(!qrModalVisible); // toggle visibility
  };

  if (!pet)
    return <div className="text-center mt-10 text-blue-700">Loading...</div>;

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }); // e.g., 20 May 2025
  };

  const handleDeletePet = async (petId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pet?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${URL}/pet/${petId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Pet deleted successfully!");
      navigate("/petlist");
    } catch (error) {
      console.error("Error deleting pet:", error);
      alert(error?.response?.data?.message || "Failed to delete pet.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2 ">
          {/* Toggle Button */}
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-blue-700 text-white px-4 py-2 rounded-t-xl flex items-center justify-between"
          >
            <span>Edit Pet Info</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                isFormOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Collapsible Form Section */}
          <div
            className={`bg-white p-6 rounded-b-xl shadow-md border border-gray-200 transition-all duration-300 ease-in-out ${
              isFormOpen
                ? "opacity-100 max-h-[2000px]"
                : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <div className="mb-4">
              <label className="font-medium text-blue-700 mr-2">
                Choose Template:
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="border border-blue-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-200"
              >
                <option value="template1">Classic Card</option>
                <option value="template2">Modern Minimal</option>
                <option value="template3">Bold Highlight</option>
                <option value="template4">4</option>
                <option value="template5">5</option>
              </select>
            </div>

            <div className="space-y-4">
              {/* Inputs */}
              {[
                { label: "About", key: "about" },
                { label: "Name", key: "name" },
                { label: "Breed", key: "breed" },
                { label: "Date of Birth", key: "DOB", type: "date" },

                { label: "Weight (kg)", key: "weight", type: "number" },
                { label: "Color", key: "color" },
              ].map(({ label, key, type = "text" }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={key}
                    value={updatedPet[key]}
                    onChange={handleChange}
                    className="mt-1 block w-full border px-3 py-2 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm text-gray-600">Gender</label>
                <select
                  name="gender"
                  value={updatedPet.gender}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border px-3 py-2 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="vaccinated"
                    checked={updatedPet.vaccinated}
                    onChange={handleChange}
                    className="accent-green-600"
                  />
                  Vaccinated
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Owner Name
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={updatedPet.owner.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border px-3 py-2 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Owner Contact
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={updatedPet.owner.contactNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border px-3 py-2 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <button
                onClick={handleUpdate}
                className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* medical details */}
          {/* Toggle Button */}
          <br />
          <br />
          <button
            onClick={() => setIsMedOpen(!isMedOpen)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-blue-700 text-white px-4 py-2 rounded-t-xl flex items-center justify-between"
          >
            <span>Medical Details</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                isMedOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Collapsible Form Section */}
          <div
            className={`bg-white p-6 rounded-b-xl shadow-md border border-gray-200 transition-all duration-300 ease-in-out ${
              isMedOpen
                ? "opacity-100 max-h-[2000px]"
                : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={newRecord.date}
                  onChange={handleMedRecordChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={newRecord.description}
                  onChange={handleMedRecordChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g. Annual vaccination"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vet Name
                </label>
                <input
                  type="text"
                  name="vet"
                  value={newRecord.vet}
                  onChange={handleMedRecordChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Dr. Smith"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleAddMedicalRecord}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Add Record
              </button>
            </div>

            {/* --- Medical Records Table --- */}
            <div className="overflow-x-auto mt-6 shadow rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white">
              <table className="min-w-full table-auto divide-y divide-gray-200">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Vet Name
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-50">
                  {pet.medicalRecords && pet.medicalRecords.length > 0 ? (
                    pet.medicalRecords.map((record, index) => (
                      <tr key={index} className="hover:bg-blue-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 font-medium">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-blue-800">
                          {record.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-blue-800">
                          {record.vet}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-blue-400 italic"
                      >
                        No medical records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <button
            onClick={() => handleDeletePet(pet._id)}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition duration-200 shadow mt-4 font-semibold tracking-wide"
          >
            Delete Pet
          </button>
          <div className="mt-4 flex flex-col md:flex-row items-center gap-2">
            <ActivateQR />
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-md border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">
            Live Preview
          </h2>
          <div className="font-medium text-xl mb-5 ">
            <spam className=" font-bold">Pet Id:</spam> <i>{petId}</i>
          </div>
          {selectedTemplate === "template1" && (
            <div
              className="rounded-2xl shadow-2xl border border-gray-300 overflow-hidden max-w-6xl mx-auto p-4 sm:p-6 md:p-10 bg-cover bg-center"
              style={{ backgroundImage: "url('/img/bg.jpeg')" }}
            >
              {/* Header Section */}
              <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row justify-around gap-6 md:gap-10 overflow-hidden">
                {/* Background Image */}
                {updatedPet.image && (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${updatedPet.image})` }}
                  ></div>
                )}

                {/* Optional overlay for readability */}
                {/* <div className="absolute inset-0 bg-black/10"></div> */}

                {/* Foreground Content */}
                <div className="relative z-10 flex items-center md:items-end w-full md:w-2/3 text-white ">
                  <div className="text-center md:text-left bg-black/40 p-4 rounded-lg">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold drop-shadow-lg">
                      {updatedPet.name}
                    </h2>
                    <p className="mt-2 text-sm italic tracking-wide  ">
                      {updatedPet.breed}
                    </p>
                  </div>
                </div>

                {/* Right Side - Buttons */}
                <div className="relative z-10 flex justify-center sm:flex-col md:flex-col items-center gap-4 md:gap-6">
                  <button
                    onClick={() =>
                      toggleQRModal(updatedPet.name, `${URL}/pet/${pet._id}`)
                    }
                    className="flex items-center justify-center bg-yellow-300 hover:bg-amber-500 text-black p-4 sm:p-6 md:p- shadow-lg transition duration-200 rounded-2xl"
                  >
                    <QrCodeIcon style={{ fontSize: "40px" }} />
                  </button>

                  <button
                    onClick={handleShareLink}
                    className="flex items-center justify-center bg-[#3c625d] hover:bg-[#16433f] text-white p-4 sm:p-6 md:p- shadow-lg transition duration-200 rounded-2xl"
                  >
                    <ShareIcon style={{ fontSize: "40px" }} />
                  </button>

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
                </div>
              </div>

              {/* About Section */}
              <section className="bg-white p-6 sm:p-8 rounded-2xl mt-8 shadow-md">
                <h3 className="text-center mb-4 text-2xl sm:text-3xl font-semibold text-amber-800 border-b-2 border-amber-300 pb-2">
                  About
                </h3>
                <p className="text-gray-700 leading-relaxed tracking-wide text-sm sm:text-base">
                  {updatedPet.about}
                </p>
              </section>

              {/* Info Section */}
              <section className="mt-8 space-y-8 rounded-2xl bg-white p-6 sm:p-8 shadow-lg text-gray-700">
                {/* Owner Info */}
                <div>
                  <h4 className="text-xl sm:text-2xl font-semibold text-amber-900 mb-3 border-b border-amber-200 pb-1">
                    Owner Information
                  </h4>
                  <div className="text-sm sm:text-base">
                    <p>
                      <span className="font-semibold text-amber-600">
                        Name:
                      </span>{" "}
                      {updatedPet.owner?.name || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-amber-600">
                        Contact:
                      </span>{" "}
                      {updatedPet.owner?.contactNumber || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Pet Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 bg-amber-50 p-6 rounded-xl shadow-inner text-sm sm:text-base">
                  <div>
                    <p className="font-semibold text-amber-700">Gender</p>
                    <p>{updatedPet.gender || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-700">Weight</p>
                    <p>
                      {updatedPet.weight
                        ? `${updatedPet.weight} kg`
                        : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-700">Color</p>
                    <p>{updatedPet.color || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-700">DOB</p>
                    <p>{formatDate(updatedPet.DOB)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-700">Age</p>
                    <p>{updatedPet.age} yrs</p>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-700">Vaccinated</p>
                    <p>{updatedPet.vaccinated ? "Yes ✅" : "No ❌"}</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {selectedTemplate === "template2" && (
            <div className="max-w-lg mx-auto bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-900 via-cyan-900 to-teal-800 p-7 flex flex-col items-center border-b border-cyan-700">
                {updatedPet.image ? (
                  <img
                    src={updatedPet.image}
                    alt="Pet"
                    className="w-32 h-32 object-cover rounded-full border-4 border-gray-900 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
                    No Image
                  </div>
                )}
                <h2 className="mt-5 text-4xl font-extrabold text-cyan-400 drop-shadow-lg">
                  {updatedPet.name}
                </h2>
                <p className="text-lg italic text-cyan-300">
                  {updatedPet.breed}
                </p>
              </div>

              {/* Content Sections */}
              <div className="p-7 space-y-8 text-gray-300">
                {/* About */}
                <section className="rounded-xl border border-cyan-700 p-5 bg-gradient-to-tr from-cyan-900/60 to-teal-900/40 shadow-md">
                  <h3 className="text-2xl font-semibold text-cyan-400 mb-3 border-b border-cyan-600 pb-2">
                    About
                  </h3>
                  <p className="leading-relaxed text-gray-400">
                    {updatedPet.about}
                  </p>
                </section>

                {/* Owner Info */}
                <section className="rounded-xl border border-cyan-700 p-5 bg-gradient-to-tr from-teal-900/60 to-cyan-900/40 shadow-md">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3 border-b border-cyan-600 pb-2">
                    Owner Information
                  </h4>
                  <p>
                    <span className="font-semibold text-cyan-300">Name:</span>{" "}
                    {updatedPet.owner?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-cyan-300">
                      Contact:
                    </span>{" "}
                    {updatedPet.owner?.contactNumber || "N/A"}
                  </p>
                </section>

                {/* Pet Details Grid */}
                <section className="rounded-xl border border-cyan-700 p-5 bg-gradient-to-tr from-cyan-800/70 to-teal-900/50 shadow-lg">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-semibold text-cyan-300">Gender</p>
                      <p>{updatedPet.gender || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-300">Weight</p>
                      <p>
                        {updatedPet.weight
                          ? `${updatedPet.weight} kg`
                          : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-300">Color</p>
                      <p>{updatedPet.color || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-300">DOB</p>
                      <p>{formatDate(updatedPet.DOB)}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-300">Age</p>
                      <p>{pet.age} </p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold text-cyan-300">Vaccinated</p>
                      <p>{updatedPet.vaccinated ? "Yes ✅" : "No ❌"}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {selectedTemplate === "template3" && (
            <div className="max-w-xl mx-auto bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-900 p-6 flex flex-col items-center">
                {updatedPet.image ? (
                  <img
                    src={updatedPet.image}
                    alt="Pet"
                    className="w-28 h-28 object-cover rounded-full border-4 border-gray-900 shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 bg-gray-800 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
                    No Image
                  </div>
                )}
                <h2 className="mt-4 text-3xl font-extrabold text-white drop-shadow-md">
                  {updatedPet.name}
                </h2>
                <p className="text-sm italic text-purple-300">
                  {updatedPet.breed}
                </p>
              </div>

              {/* Tabbed Sections */}
              <div className="p-6 text-gray-300 space-y-6">
                {/* About */}
                <section>
                  <h3 className="text-2xl font-semibold text-white border-b border-purple-700 pb-2 mb-2">
                    About
                  </h3>
                  <p className="leading-relaxed text-gray-400">
                    {updatedPet.about}
                  </p>
                </section>

                {/* Owner Info */}
                <section>
                  <h4 className="text-xl font-semibold text-white border-b border-purple-700 pb-2 mb-3">
                    Owner Information
                  </h4>
                  <p>
                    <span className="font-semibold text-purple-400">Name:</span>{" "}
                    {updatedPet.owner?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-purple-400">
                      Contact:
                    </span>{" "}
                    {updatedPet.owner?.contactNumber || "N/A"}
                  </p>
                </section>

                {/* Pet Details Grid */}
                <section>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-semibold text-purple-400">Gender</p>
                      <p>{updatedPet.gender || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-purple-400">Weight</p>
                      <p>
                        {updatedPet.weight
                          ? `${updatedPet.weight} kg`
                          : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-purple-400">Color</p>
                      <p>{updatedPet.color || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-purple-400">DOB</p>
                      <p>{formatDate(updatedPet.DOB)}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-purple-400">Age</p>
                      <p>{pet.age} </p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold text-purple-400">
                        Vaccinated
                      </p>
                      <p>{updatedPet.vaccinated ? "Yes ✅" : "No ❌"}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {selectedTemplate === "template4" && (
            <div className="max-w-lg mx-auto bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-900 via-orange-900 to-red-800 p-7 flex flex-col items-center border-b border-orange-700">
                {updatedPet.image ? (
                  <img
                    src={updatedPet.image}
                    alt="Pet"
                    className="w-32 h-32 object-cover rounded-full border-4 border-gray-900 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
                    No Image
                  </div>
                )}
                <h2 className="mt-5 text-4xl font-extrabold text-orange-400 drop-shadow-lg">
                  {updatedPet.name}
                </h2>
                <p className="text-lg italic text-orange-300">
                  {updatedPet.breed}
                </p>
              </div>

              {/* Content Sections */}
              <div className="p-7 space-y-8 text-gray-300">
                {/* About */}
                <section className="rounded-xl border border-orange-700 p-5 bg-gradient-to-tr from-orange-900/60 to-red-900/40 shadow-md">
                  <h3 className="text-2xl font-semibold text-orange-400 mb-3 border-b border-orange-600 pb-2">
                    About
                  </h3>
                  <p className="leading-relaxed text-gray-400">
                    {updatedPet.about}
                  </p>
                </section>

                {/* Owner Info */}
                <section className="rounded-xl border border-orange-700 p-5 bg-gradient-to-tr from-red-900/60 to-orange-900/40 shadow-md">
                  <h4 className="text-xl font-semibold text-orange-400 mb-3 border-b border-orange-600 pb-2">
                    Owner Information
                  </h4>
                  <p>
                    <span className="font-semibold text-orange-300">Name:</span>{" "}
                    {updatedPet.owner?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-orange-300">
                      Contact:
                    </span>{" "}
                    {updatedPet.owner?.contactNumber || "N/A"}
                  </p>
                </section>

                {/* Pet Details Grid */}
                <section className="rounded-xl border border-orange-700 p-5 bg-gradient-to-tr from-orange-800/70 to-red-900/50 shadow-lg">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-semibold text-orange-300">Gender</p>
                      <p>{updatedPet.gender || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-orange-300">Weight</p>
                      <p>
                        {updatedPet.weight
                          ? `${updatedPet.weight} kg`
                          : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-orange-300">Color</p>
                      <p>{updatedPet.color || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-orange-300">DOB</p>
                      <p>{formatDate(updatedPet.DOB)}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-orange-300">Age</p>
                      <p>{formatDate(pet.age)}</p>
                    </div>

                    <div className="col-span-2">
                      <p className="font-semibold text-orange-300">
                        Vaccinated
                      </p>
                      <p>{updatedPet.vaccinated ? "Yes ✅" : "No ❌"}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {selectedTemplate === "template5" && (
            <div className="max-w-lg mx-auto bg-blue-50 rounded-3xl shadow-lg border border-blue-200 overflow-hidden">
              {/* Header */}
              <div className="bg-blue-100 p-7 flex flex-col items-center border-b border-blue-300">
                {updatedPet.image && (
                  <img
                    src={updatedPet.image}
                    alt="Pet"
                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
                  />
                )}
                <h2 className="mt-5 text-4xl font-bold text-blue-700">
                  {updatedPet.name}
                </h2>
                <p className="text-lg italic text-blue-500">
                  {updatedPet.breed}
                </p>
              </div>

              {/* Content Sections */}
              <div className="p-7 space-y-8 text-blue-800">
                {/* About */}
                <section className="rounded-xl border border-blue-300 p-5 bg-blue-50 shadow-sm">
                  <h3 className="text-2xl font-semibold mb-3 border-b border-blue-300 pb-2">
                    About
                  </h3>
                  <p className="leading-relaxed">{updatedPet.about}</p>
                </section>

                {/* Owner Info */}
                <section className="rounded-xl border border-blue-300 p-5 bg-blue-50 shadow-sm">
                  <h4 className="text-xl font-semibold mb-3 border-b border-blue-300 pb-2">
                    Owner Information
                  </h4>
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {updatedPet.owner?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Contact:</span>{" "}
                    {updatedPet.owner?.contactNumber || "N/A"}
                  </p>
                </section>

                {/* Pet Details Grid */}
                <section className="rounded-xl border border-blue-300 p-5 bg-blue-50 shadow-sm">
                  <div className="grid grid-cols-2 gap-6 text-blue-700">
                    <div>
                      <p className="font-semibold">Gender</p>
                      <p>{updatedPet.gender || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Weight</p>
                      <p>
                        {updatedPet.weight
                          ? `${updatedPet.weight} kg`
                          : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Color</p>
                      <p>{updatedPet.color || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">DOB</p>
                      <p>{formatDate(updatedPet.DOB)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Age</p>
                      <p>{formatDate(pet.age)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold">Vaccinated</p>
                      <p>{updatedPet.vaccinated ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {}
          {!isPublicView && (
            <div className="mt-6 text-center">
              <button
                onClick={handleShareLink}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-md transition"
              >
                Share Pet Card Link
              </button>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
