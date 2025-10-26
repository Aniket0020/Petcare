import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminQR = () => {
  const URL = import.meta.env.VITE_API_URL;
  const [qrList, setQrList] = useState([]);
  const [count, setCount] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    activated: 0,
    notActivated: 0,
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch all QR codes
  const fetchQRs = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${URL}/adminqr/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQrList(data);

      // Compute stats
      const activatedCount = data.filter((qr) => qr.isActivated).length;
      const notActivatedCount = data.length - activatedCount;
      setStats({
        total: data.length,
        activated: activatedCount,
        notActivated: notActivatedCount,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch QR codes");
    }
  };

  // Generate QR bundle
  const handleGenerate = async () => {
    if (!token) return;
    if (count < 1) return toast.warn("Please enter a valid count!");

    try {
      const { data } = await axios.post(
        `${URL}/adminqr/generate/${count}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`${count} QR code(s) generated successfully!`);
      const newList = [...data.qrList, ...qrList];
      setQrList(newList);

      // Update stats
      const activatedCount = newList.filter((qr) => qr.isActivated).length;
      setStats({
        total: newList.length,
        activated: activatedCount,
        notActivated: newList.length - activatedCount,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to generate QR codes");
    }
  };

  // Logout

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchQRs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <AdminNavbar />

      {/* Main content */}
      <div className="max-w-6xl mx-auto mt-10 p-6">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Manage & Monitor QR Bundles
        </h2>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-center">
          <div className="bg-white border shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Total QR Codes</p>
            <h3 className="text-2xl font-bold">{stats.total}</h3>
          </div>
          <div className="bg-green-100 border border-green-300 shadow rounded-lg p-4">
            <p className="text-gray-600 text-sm">Activated</p>
            <h3 className="text-2xl font-bold text-green-700">
              {stats.activated}
            </h3>
          </div>
          <div className="bg-red-100 border border-red-300 shadow rounded-lg p-4">
            <p className="text-gray-600 text-sm">Not Activated</p>
            <h3 className="text-2xl font-bold text-red-700">
              {stats.notActivated}
            </h3>
          </div>
        </div>

        {/* Generate QR Section */}
        <div className="flex gap-3 mb-8 justify-center">
          <input
            type="number"
            min="1"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="px-3 py-2 border rounded w-28 text-center"
          />
          <button
            onClick={handleGenerate}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
          >
            Generate QR
          </button>
        </div>

        {/* QR List */}
        {qrList.length === 0 ? (
          <p className="text-center text-gray-500">No QR codes found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {qrList.map((qr) => (
              <div
                key={qr.code}
                className="border p-3 rounded-xl shadow-sm bg-white flex flex-col items-center hover:shadow-md transition"
              >
                <img
                  src={qr.qrImage}
                  alt={`QR ${qr.code}`}
                  className="mb-2 w-32 h-32 object-contain"
                />
                <p className="text-sm font-mono break-all">{qr.code}</p>
                <a
                  href={qr.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-xs truncate max-w-[100px]"
                >
                  {qr.shortUrl}
                </a>
                <p
                  className={`text-xs mt-1 ${
                    qr.isActivated ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {qr.isActivated ? "Activated ✅" : "Not Activated ❌"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQR;
