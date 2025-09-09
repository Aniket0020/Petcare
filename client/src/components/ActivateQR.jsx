// import { useState } from "react";

// const ActivateQR = () => {
//   const [code, setCode] = useState("");
//   const [petId, setPetId] = useState("");
//   const [message, setMessage] = useState("");

//   const handleActivate = async () => {
//     if (!code || !petId) {
//       return setMessage("Please enter both Activation Code and Pet ID");
//     }

//     try {
//       const res = await fetch("http://localhost:3000/QR/activate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code, petId }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage(`✅ Activated! Pet Profile: ${data.petProfileUrl}`);
//       } else {
//         setMessage(`❌ ${data.message}`);
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Server Error");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow">
//       <h2 className="text-xl font-bold mb-4">Activate Pet Tag</h2>

//       <input
//         type="text"
//         placeholder="Enter Activation Code"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//         className="w-full mb-3 px-3 py-2 border rounded"
//       />

//       <input
//         type="text"
//         placeholder="Enter Pet ID"
//         value={petId}
//         onChange={(e) => setPetId(e.target.value)}
//         className="w-full mb-3 px-3 py-2 border rounded"
//       />

//       <button
//         onClick={handleActivate}
//         className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//       >
//         Activate QR
//       </button>

//       {message && <p className="mt-4 text-sm text-center">{message}</p>}
//     </div>
//   );
// };

// export default ActivateQR;
