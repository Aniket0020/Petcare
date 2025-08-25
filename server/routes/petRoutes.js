const express = require("express");
const Pet = require("../model/pet");
const {
    createPet,
    getAllPets,
    getPetById,
    updatePet,
    deletePet,
} = require("../controller/petController");
const authenticateToken = require("../middleware/authenticateToken"); // Import the authenticateToken middleware

const router = express.Router();

// Protect routes with the authentication middleware
router.post("/", authenticateToken, createPet); // Only authorized users can create a pet
router.get("/", authenticateToken, getAllPets,); // Only authorized users can view pets
router.get("/:petId", authenticateToken, getPetById); // Only authorized users can view a specific pet
router.put("/:petId", authenticateToken, updatePet); // Only authorized users can update a pet
router.delete("/:petId", authenticateToken, deletePet); // Only authorized users can delete a pet
router.get("/public/:petId", async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.petId);
        if (!pet) return res.status(404).json({ message: "Pet not found" });

        res.json(pet);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
