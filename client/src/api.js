// src/api.js
import axios from "axios";

export const getAllPets = async () => {
    const response = await axios.get("http://localhost:3000/pet");
    return response.data;
};
