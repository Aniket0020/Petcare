import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ShareIcon from "@mui/icons-material/Share";

import Button from "@mui/material/Button";
import QrCodeIcon from "@mui/icons-material/QrCode";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const PublicpetCard = () => {
  const FrontURL = import.meta.env.VITE_API_FRONT;
  const URL = import.meta.env.VITE_API_URL;
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrData, setQrData] = useState({ name: "", link: "", qrUrl: "" });

  const { petId } = useParams();
  const [pet, setpet] = useState(null);

  useEffect(() => {
    const fetchpet = async () => {
      try {
        const res = await axios.get(`${URL}/pet/public/${petId}`);
        setpet(res.data);
      } catch (error) {
        console.error("Error fetching pet:", error);
        alert("Could not fetch pet data");
      }
    };
    fetchpet();
  }, [petId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }); // e.g., 20 May 2025
  };

  if (!pet) return <div>Loading...</div>;

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

  return (
    <div className="p-2">
      {pet.template === "template1" && (
        <div
          className="rounded-2xl shadow-2xl border border-gray-300 overflow-hidden max-w-6xl mx-auto p-4 sm:p-6 md:p-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/bg.jpeg')" }}
        >
          {/* Header Section */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row justify-around gap-6 md:gap-10">
            {/* Left Side - Pet Info */}
            <div className="flex flex-col items-center md:items-start w-full md:w-2/3">
              {pet.image ? (
                <img
                  src={pet.image}
                  alt="Pet"
                  className="w-60 h-40 sm:w-100 sm:h-48 md:w-120 md:h-56 object-cover rounded-full border-8 border-white shadow-xl transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-lg font-semibold">
                  Add Image
                </div>
              )}

              <div className="text-center md:text-left mt-5">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-900 drop-shadow-md">
                  {pet.name}
                </h2>
                <p className="mt-2 text-lg text-amber-700 italic tracking-wide">
                  {pet.breed}
                </p>
              </div>
            </div>

            {/* Right Side - Buttons */}
            <div className="flex justify-center sm:flex-col md:flex-col items-center gap-4 md:gap-6">
              <button
                onClick={() =>
                  toggleQRModal(pet.name, `${FrontURL}/pet/${pet._id}`)
                }
                className="flex items-center justify-center bg-yellow-300 hover:bg-amber-500 text-black p-4 sm:p-6 md:p-10  shadow-lg transition duration-200 rounded-2xl"
              >
                <QrCodeIcon style={{ fontSize: "40px" }} />
              </button>

              <button
                onClick={handleShareLink}
                className="flex items-center justify-center bg-[#3c625d] hover:bg-[#16433f] text-white p-4 sm:p-6 md:p-10  shadow-lg transition duration-200 rounded-2xl"
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
              {pet.about}
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
                  <span className="font-semibold text-amber-600">Name:</span>{" "}
                  {pet.owner?.name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-amber-600">Contact:</span>{" "}
                  {pet.owner?.contactNumber || "N/A"}
                </p>
              </div>
            </div>

            {/* Pet Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 bg-amber-50 p-6 rounded-xl shadow-inner text-sm sm:text-base">
              <div>
                <p className="font-semibold text-amber-700">Gender</p>
                <p>{pet.gender || "Unknown"}</p>
              </div>
              <div>
                <p className="font-semibold text-amber-700">Weight</p>
                <p>{pet.weight ? `${pet.weight} kg` : "Unknown"}</p>
              </div>
              <div>
                <p className="font-semibold text-amber-700">Color</p>
                <p>{pet.color || "Unknown"}</p>
              </div>
              <div>
                <p className="font-semibold text-amber-700">DOB</p>
                <p>{formatDate(pet.DOB)}</p>
              </div>
              <div>
                <p className="font-semibold text-amber-700">Age</p>
                <p>{pet.age} yrs</p>
              </div>
              <div>
                <p className="font-semibold text-amber-700">Vaccinated</p>
                <p>{pet.vaccinated ? "Yes ✅" : "No ❌"}</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {pet.template === "template2" && (
        <div className="max-w-lg mx-auto bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-900 via-cyan-900 to-teal-800 p-7 flex flex-col items-center border-b border-cyan-700">
            {pet.image ? (
              <img
                src={pet.image}
                alt="pet"
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-900 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
                No Image
              </div>
            )}
            <h2 className="mt-5 text-4xl font-extrabold text-cyan-400 drop-shadow-lg">
              {pet.name}
            </h2>
            <p className="text-lg italic text-cyan-300">{pet.breed}</p>
            <div>
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
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-7 space-y-8 text-gray-300">
            {/* About */}
            <section className="rounded-xl border border-cyan-700 p-5 bg-gradient-to-tr from-cyan-900/60 to-teal-900/40 shadow-md">
              <h3 className="text-2xl font-semibold text-cyan-400 mb-3 border-b border-cyan-600 pb-2">
                About
              </h3>
              <p className="leading-relaxed text-gray-400">{pet.about}</p>
            </section>

            {/* Owner Info */}
            <section className="rounded-xl border border-cyan-700 p-5 bg-gradient-to-tr from-teal-900/60 to-cyan-900/40 shadow-md">
              <h4 className="text-xl font-semibold text-cyan-400 mb-3 border-b border-cyan-600 pb-2">
                Owner Information
              </h4>
              <p>
                <span className="font-semibold text-cyan-300">Name:</span>{" "}
                {pet.owner?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-cyan-300">Contact:</span>{" "}
                {pet.owner?.contactNumber || "N/A"}
              </p>
            </section>

            {/* pet Details Grid */}
            <section className="rounded-xl border border-cyan-700 p-5 bg-gradient-to-tr from-cyan-800/70 to-teal-900/50 shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-cyan-300">Gender</p>
                  <p>{pet.gender || "Unknown"}</p>
                </div>
                <div>
                  <p className="font-semibold text-cyan-300">Weight</p>
                  <p>{pet.weight ? `${pet.weight} kg` : "Unknown"}</p>
                </div>
                <div>
                  <p className="font-semibold text-cyan-300">Color</p>
                  <p>{pet.color || "Unknown"}</p>
                </div>
                <div>
                  <p className="font-semibold text-cyan-300">DOB</p>
                  <p>{formatDate(pet.DOB)}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold text-cyan-300">Vaccinated</p>
                  <p>{pet.vaccinated ? "Yes ✅" : "No ❌"}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
      {pet.template === "template3" && (
        <div className="max-w-xl mx-auto bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-900 p-6 flex flex-col items-center">
            {pet.image ? (
              <img
                src={pet.image}
                alt="pet"
                className="w-28 h-28 object-cover rounded-full border-4 border-gray-900 shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 bg-gray-800 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
                No Image
              </div>
            )}
            <h2 className="mt-4 text-3xl font-extrabold text-white drop-shadow-md">
              {pet.name}
            </h2>
            <p className="text-sm italic text-purple-300">{pet.breed}</p>
            <div>
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
            </div>
          </div>

          {/* Tabbed Sections */}
          <div className="p-6 text-gray-300 space-y-6">
            {/* About */}
            <section>
              <h3 className="text-2xl font-semibold text-white border-b border-purple-700 pb-2 mb-2">
                About
              </h3>
              <p className="leading-relaxed text-gray-400">{pet.about}</p>
            </section>

            {/* Owner Info */}
            <section>
              <h4 className="text-xl font-semibold text-white border-b border-purple-700 pb-2 mb-3">
                Owner Information
              </h4>
              <p>
                <span className="font-semibold text-purple-400">Name:</span>{" "}
                {pet.owner?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-purple-400">Contact:</span>{" "}
                {pet.owner?.contactNumber || "N/A"}
              </p>
            </section>

            {/* pet Details Grid */}
            <section>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-purple-400">Gender</p>
                  <p>{pet.gender || "Unknown"}</p>
                </div>
                <div>
                  <p className="font-semibold text-purple-400">Weight</p>
                  <p>{pet.weight ? `${pet.weight} kg` : "Unknown"}</p>
                </div>
                <div>
                  <p className="font-semibold text-purple-400">Color</p>
                  <p>{pet.color || "Unknown"}</p>
                </div>
                <div>
                  <p className="font-semibold text-purple-400">DOB</p>
                  <p>{formatDate(pet.DOB)}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold text-purple-400">Vaccinated</p>
                  <p>{pet.vaccinated ? "Yes ✅" : "No ❌"}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
      {pet.template === "template4" && (
        <div className="max-w-lg mx-auto bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-900 via-orange-900 to-red-800 p-7 flex flex-col items-center border-b border-orange-700">
            {pet.image ? (
              <img
                src={pet.image}
                alt="pet"
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-900 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
                No Image
              </div>
            )}
            <h2 className="mt-5 text-4xl font-extrabold text-orange-400 drop-shadow-lg">
              {pet.name}
            </h2>
            <p className="text-lg italic text-orange-300">{pet.breed}</p>
            <div>
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
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-7 space-y-8 text-gray-300">
            {/* About */}
            <section className="rounded-xl border border-orange-700 p-5 bg-gradient-to-tr from-orange-900/60 to-red-900/40 shadow-md">
              <h3 className="text-2xl font-semibold text-orange-400 mb-3 border-b border-orange-600 pb-2">
                About
              </h3>
              <p className="leading-relaxed text-gray-400">{pet.about}</p>
            </section>

            {/* Owner Info */}
            <section className="rounded-xl border border-orange-700 p-5 bg-gradient-to-tr from-red-900/60 to-orange-900/40 shadow-md">
              <h4 className="text-xl font-semibold text-orange-400 mb-3 border-b border-orange-600 pb-2">
                Owner Information
              </h4>
              <p>
                <span className="font-semibold text-orange-300">Name:</span>{" "}
                {pet.owner?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-orange-300">Contact:</span>{" "}
                {pet.owner?.contactNumber || "N/A"}
              </p>
            </section>

            {/* pet Details Grid */}
            <section className="rounded-xl border border-orange-700 p-5 bg-gradient-to-tr from-orange-800/70 to-red-900/50 shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-orange-300">Gender</p>
                  <p>{pet.gender || "Unknown"}</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-300">Weight</p>
                  <p>{pet.weight ? `${pet.weight} kg` : "Unknown"}</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-300">Color</p>
                  <p>{pet.color || "Unknown"}</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-300">DOB</p>
                  <p>{formatDate(pet.DOB)}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold text-orange-300">Vaccinated</p>
                  <p>{pet.vaccinated ? "Yes ✅" : "No ❌"}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
      {pet.template === "template5" && (
        <div className="max-w-lg mx-auto bg-blue-50 rounded-3xl shadow-lg border border-blue-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-100 p-7 flex flex-col items-center border-b border-blue-300">
            {pet.image && (
              <img
                src={pet.image}
                alt="pet"
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
              />
            )}
            <h2 className="mt-5 text-4xl font-bold text-blue-700">
              {pet.name}
            </h2>
            <p className="text-lg italic text-blue-500">{pet.breed}</p>
            <div>
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
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-7 space-y-8 text-blue-800">
            {/* About */}
            <section className="rounded-xl border border-blue-300 p-5 bg-blue-50 shadow-sm">
              <h3 className="text-2xl font-semibold mb-3 border-b border-blue-300 pb-2">
                About
              </h3>
              <p className="leading-relaxed">{pet.about}</p>
            </section>

            {/* Owner Info */}
            <section className="rounded-xl border border-blue-300 p-5 bg-blue-50 shadow-sm">
              <h4 className="text-xl font-semibold mb-3 border-b border-blue-300 pb-2">
                Owner Information
              </h4>
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {pet.owner?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Contact:</span>{" "}
                {pet.owner?.contactNumber || "N/A"}
              </p>
            </section>

            {/* pet Details Grid */}
            <section className="rounded-xl border border-blue-300 p-5 bg-blue-50 shadow-sm">
              <div className="grid grid-cols-2 gap-6 text-blue-700">
                <div>
                  <p className="font-semibold">Gender</p>
                  <p>{pet.gender || "Unknown"}</p>
                </div>
                <div>
                  <p className="font-semibold">Weight</p>
                  <p>{pet.weight ? `${pet.weight} kg` : "Unknown"}</p>
                </div>
                <div>
                  <p className="font-semibold">Color</p>
                  <p>{pet.color || "Unknown"}</p>
                </div>
                <div>
                  <p className="font-semibold">DOB</p>
                  <p>{formatDate(pet.DOB)}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold">Vaccinated</p>
                  <p>{pet.vaccinated ? "Yes" : "No"}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* QR model */}
      {qrModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-semibold">Pet QR Code</h5>
              <button
                className="text-red-500 hover:text-red-700 font-bold"
                onClick={() => setQrModalVisible(false)}
              >
                ×
              </button>
            </div>
            <div className="text-center">
              <img
                src={qrData.qrUrl}
                alt="QR Code"
                className="mx-auto mb-3"
                style={{ maxWidth: "200px" }}
              />
              <p className="text-sm text-gray-500">{`${qrData.name}'s QR: ${qrData.link}`}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicpetCard;
