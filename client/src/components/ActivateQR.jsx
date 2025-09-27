import { useState } from "react";
import axios from "axios";

const ActivateQR = () => {
  const URL = import.meta.env.VITE_API_URL;
  const [code, setCode] = useState("");
  const [petId, setPetId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleActivate = async (e) => {
    e.preventDefault(); // prevent form reload

    if (!code || !petId) {
      setMessage("❌ Please enter both Activation Code and Pet ID");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${URL}/qr/activate`, {
        code,
        petId,
      });

      // Axios automatically throws on non-2xx status
      setMessage(`✅ Activated! Pet Profile: ${res.data.petProfileUrl}`);
      setCode("");
      setPetId("");
    } catch (err) {
      console.error(err);

      // Axios error handling
      if (err.response) {
        // Server responded with status other than 2xx
        setMessage(`❌ ${err.response.data.message || "Error activating QR"}`);
      } else if (err.request) {
        // Request was made but no response
        setMessage("❌ No response from server");
      } else {
        // Something else happened
        setMessage("❌ Request error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Activate Pet Tag</h2>

      <form onSubmit={handleActivate} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Enter Activation Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <input
          type="text"
          placeholder="Enter Pet ID"
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Activating..." : "Activate QR"}
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-center">{message}</p>}
    </div>
  );
};

export default ActivateQR;
