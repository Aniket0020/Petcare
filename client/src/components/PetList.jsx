import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Spinner Component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
    </div>
);

// Decode JWT Role
const getUserRole = () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const payload = jwtDecode(token);
        return payload.role;
    } catch (err) {
        console.error("Failed to decode token:", err);
        return null;
    }
};

const PetList = () => {
    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Debounce Timer
    const [debounceTimer, setDebounceTimer] = useState(null);

    const fetchPets = async (retryCount = 3) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found. Please log in.");

            const role = getUserRole();
            setUserRole(role);

            const res = await axios.get("http://localhost:3000/pet", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPets(res.data);
            setFilteredPets(res.data);
            setLoading(false);
        } catch (error) {
            if (retryCount > 0) {
                setTimeout(() => fetchPets(retryCount - 1), 2000);
            } else {
                setError("Failed to fetch pets. Please try again later.");
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    // Debounced Search
    useEffect(() => {
        if (debounceTimer) clearTimeout(debounceTimer);

        const timer = setTimeout(() => {
            const filtered = pets.filter((pet) =>
                pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (pet.owner?.name &&
                    pet.owner.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredPets(filtered);
        }, 300);

        setDebounceTimer(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, pets]);

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center text-red-500">
                <p>{error}</p>
                <button
                    onClick={() => fetchPets()}
                    className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
                >
                    Retry
                </button>
            </div>
        );
    }


  





    return (
        <div className="p-6 h-[100vh] max-w-8xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50">
            <h2 className="text-3xl font-bold mb-6 text-center">
                {userRole === "doctor" ? "All Registered Pets" : "Your Pets"}
            </h2>

            {userRole === "doctor" && (
                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search by pet name or owner name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}


            <div
                className={`grid gap-6 ${filteredPets?.length === 1
                    ? "place-items-center"
                    : "md:grid-cols-2 lg:grid-cols-3"
                    }`}
            >
                {Array.isArray(filteredPets) && filteredPets.length === 0 ? (
                    <div className="text-center col-span-full text-lg font-medium text-gray-500">
                        No pets found.
                    </div>
                ) : (
                    filteredPets.map((pet) => (
                        <div>

                            <Link key={pet._id} to={`/pets/${pet._id}`} className="block">
                                <div className="bg-white min-w-[300px] p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
                                    <div className="flex justify-center mb-4">
                                        <img
                                            src={pet.image || "/img/petss.png"}
                                            alt=""
                                            className="w-32 h-32 object-cover rounded-full border-4 border-zinc-700"
                                        />
                                    </div>
                                    <h3 className="text-xl font-semibold text-center text-gray-800">
                                        {pet.name} ({pet.breed})
                                    </h3>
                                    <p className="text-center text-sm text-gray-500">
                                        Gender: {pet.gender}
                                    </p>
                                    <p className="text-center text-sm text-gray-500">
                                        Weight: {pet.weight} kg
                                    </p>
                                </div>


                            </Link>
                            
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PetList;
