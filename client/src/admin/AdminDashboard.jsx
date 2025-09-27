import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const URL = import.meta.env.VITE_API_URL;
  const [qrList, setQrList] = useState([]);
  const [count, setCount] = useState(1); // Number of QR codes to generate
  const token = localStorage.getItem("token");

  // Fetch all QR codes
  const fetchQRs = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${URL}/adminqr/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQrList(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch QR codes");
    }
  };

  // Generate QR bundle
  const handleGenerate = async () => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${URL}/adminqr/generate/${count}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("QR bundle generated!");
      setQrList((prev) => [...res.data.qrList, ...prev]); // append new QR codes
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to generate QR codes");
    }
  };

  useEffect(() => {
    fetchQRs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Admin QR Dashboard
      </h2>

      <div className="flex gap-2 mb-6 justify-center">
        <input
          type="number"
          min="1"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="px-3 py-2 border rounded w-24"
        />
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate QR Bundle
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {qrList.map((qr) => (
          <div
            key={qr.code}
            className="border p-3 rounded shadow flex flex-col items-center"
          >
            <img
              src={qr.qrImage}
              alt={`QR ${qr.code}`}
              className="mb-2 w-32 h-32"
            />
            <p className="text-sm font-mono">{qr.code}</p>
            <a
              href={qr.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-xs truncate"
            >
              {qr.shortUrl}
            </a>
            <p className="text-xs mt-1">
              {qr.isActivated ? "Activated ✅" : "Not Activated ❌"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
