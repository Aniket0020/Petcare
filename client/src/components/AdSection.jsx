import React, { useEffect, useState } from "react";
import adsData from "../data/ad.json";

const AdSection = () => {
  const [currentAd, setCurrentAd] = useState(adsData[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => {
        const nextIndex =
          (adsData.findIndex((ad) => ad.id === prev.id) + 1) % adsData.length;
        return adsData[nextIndex];
      });
    }, 8000); // Rotate every 8 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500">
      <a
        href={currentAd.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col md:flex-row items-center gap-4"
      >
        <img
          src={currentAd.image}
          alt={currentAd.title}
          className="w-full md:w-48 h-48 object-cover rounded-xl border border-gray-200"
        />
        <div>
          <h3 className="text-xl font-semibold text-blue-700">
            {currentAd.title}
          </h3>
          <p className="text-gray-600 mt-2">{currentAd.description}</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Learn More
          </button>
        </div>
      </a>
    </div>
  );
};

export default AdSection;
