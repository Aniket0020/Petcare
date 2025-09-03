import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePet = () => {
     const URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate(); 
    const [pet, setPet] = useState({
        name: "",
        breed: "",
        DOB: "",
        gender: "male",
        weight: "",
        color: "",
        owner: {
            name: "",
            contactNumber: "",
        },
        vaccinated: false,
        medicalRecords: [],
        // image: "", // Add image state
    });

    // const [hasPet, setHasPet] = useState(false); // State to track if user has a pet

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "vaccinated") {
            setPet({ ...pet, vaccinated: checked });
        } else if (name.startsWith("owner.")) {
            const field = name.split(".")[1];
            setPet({
                ...pet,
                owner: { ...pet.owner, [field]: value },
            });
            // } else if (name === "image") {
            //     const file = file[0];
            //     if (file) {
            //         const reader = new FileReader();
            //         reader.onloadend = () => {
            //             setUpdatedPet((prev) => ({ ...prev, image: reader.result }));
            //         };
            //         reader.readAsDataURL(file);
            //     }
            // } 
        } else {
            setPet({ ...pet, [name]: value });
        }
    };

    const fetchUserPet = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to create a pet.");
                return;
            }

            const response = await axios.get(`${URL}/pet`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            // If the user already has a pet, set hasPet to true
            // if (response.data && response.data.length > 0) {
            //     setHasPet(true);
            // }
        } catch (error) {
            alert("Error fetching user's pet information: " + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        fetchUserPet();
    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();
        // if (hasPet) {
        //     alert("You can only create one pet .");
        //     return;
        // }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to create a pet.");
                return;
            }

            const formData = new FormData();
            formData.append("name", pet.name);
            formData.append("breed", pet.breed);
            formData.append("DOB", pet.DOB);
            formData.append("gender", pet.gender);
            formData.append("weight", pet.weight);
            formData.append("color", pet.color);
            formData.append("vaccinated", pet.vaccinated);
            formData.append("owner.name", pet.owner.name);
            formData.append("owner.contactNumber", pet.owner.contactNumber);
            // if (pet.image) formData.append("image", pet.image); // Append image file

            const response = await axios.post(`${URL}/pet`, formData, {
              headers: {
                "Content-Type": "multipart/form-data", // Make sure to set the correct content type
                Authorization: `Bearer ${token}`,
              },
            });

            alert(response.data.message);
            setPet({
                name: "",
                breed: "",
                DOB: "",
                gender: "male",
                weight: "",
                color: "",
                owner: {
                    name: "",
                    contactNumber: "",
                },
                vaccinated: false,
                medicalRecords: [],
                // image: null, // Reset image after submission
            });
            navigate("/petlist")
        } catch (error) {
            alert("Error creating pet: " + (error.response?.data?.message || error.message));
        }
    };

    // if (hasPet) {
    //     return (
    //         <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">

    //             <p className="text-center text-lg text-red-500">You already have a pet.</p>

    //         </div>
    //     );
    // }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 items-center justify-center p-10">
            <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md shadow-xl rounded-3xl p-10">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10">Create Pet Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-10" encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Basic Info */}
                        <div className="space-y-6">
                            {[
                                { label: "Pet Name", name: "name", type: "text", value: pet.name },
                                { label: "Breed", name: "breed", type: "text", value: pet.breed },
                                { label: "Date of Birth", name: "DOB", type: "date", value: pet.DOB }
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="text-sm text-gray-600">{field.label}</label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={field.value}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="text-sm text-gray-600">Gender</label>
                                <select
                                    name="gender"
                                    value={pet.gender}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm text-gray-600">Weight (kg)</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={pet.weight}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Color</label>
                                <input
                                    type="text"
                                    name="color"
                                    value={pet.color}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Owner Name</label>
                                <input
                                    type="text"
                                    name="owner.name"
                                    value={pet.owner.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Owner Contact</label>
                                <input
                                    type="text"
                                    name="owner.contactNumber"
                                    value={pet.owner.contactNumber}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            name="vaccinated"
                            checked={pet.vaccinated}
                            onChange={handleChange}
                            className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-400"
                        />
                        <label className="text-sm text-gray-700">Vaccinated</label>
                    </div>

                    {/* Image Upload */}
                    {/* <div>
                        <label className="text-sm text-gray-600">Pet Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            accept="image/*"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div> */}

                    {/* Submit */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-xl"
                        >
                            Create Pet Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default CreatePet;
