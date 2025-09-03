import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfileList = () => {
     const URL = import.meta.env.VITE_API_URL;
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProfiles = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${URL}/user/all`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setProfiles(response.data);
            console.log(response.data);

        } catch (err) {
            console.error("Failed to fetch profiles:", err);
            setError("Failed to fetch profiles. You may not have permission.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    if (loading) return <p className="text-center">Loading...</p>;

    if (error) {
        return (
            <div className="text-center text-red-500">
                {error}
                <button
                    onClick={fetchProfiles}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-6 p-4">
            <h2 className="text-3xl font-bold mb-6 text-[#2c3e50] text-center">All User Profiles</h2>
            {profiles.length === 0 ? (
                <p className="text-center text-gray-600">No profiles found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profiles.map((profile) => (
                        <div key={profile._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="bg-[#3498db] p-4">
                                <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
                            </div>
                            <div className="p-4 space-y-2">
                                <p className="text-gray-600">
                                    <i className="fas fa-envelope mr-2"></i>
                                    {profile.email}
                                </p>
                                <p className="text-gray-600">
                                    <i className="fas fa-phone mr-2"></i>
                                    {profile.phone || "N/A"}
                                </p>
                                <p className="text-gray-600">
                                    <i className="fas fa-map-marker-alt mr-2"></i>
                                    {profile.city}, {profile.state}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfileList;
