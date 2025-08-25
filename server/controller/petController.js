const Pet = require("../model/pet");
const upload = require("../middleware/upload");

// Create a new pet
const createPet = [upload.single("image"), async (req, res) => {
    try {
        const userId = req.user?.id; // Extract user ID from JWT
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User not found in token" });
        }

        // Check if image is uploaded, and if so, convert to Base64 if necessary
        const image = req.file ? req.file.buffer.toString("base64") : null;

        // Log received pet data for debugging
        console.log("Pet Data Received:", req.body);
        console.log("Image Data (Base64):", image);

        const petData = {
            ...req.body,
            createdBy: userId, // Add user ID as creator
            image: image, // Include image data as Base64 string if available
        };

        const newPet = new Pet(petData);
        await newPet.save();

        res.status(201).json({ message: "Pet created successfully", pet: newPet });
    } catch (error) {
        console.error("Error creating pet:", error);
        res.status(400).json({ message: "Error creating pet", error: error.message });
    }
}]



const getAllPets = async (req, res) => {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token" });
        }

        let pets;

        if (userRole === "doctor") {
            // Doctor can view all pets
            pets = await Pet.find({ isDeleted: false });
        } else {
            // Regular user sees only their pets
            pets = await Pet.find({ isDeleted: false, createdBy: userId });
        }

        return res.status(200).json(pets);
    } catch (error) {
        console.error("Error fetching pets:", error);
        return res.status(500).json({ message: "Error fetching pets", error: error.message });
    }
};





// Fetch a pet by ID
const getPetById = async (req, res) => {
    const { petId } = req.params;
    // console.log('Fetching pet with ID:', petId); // Log petId
    try {
        const pet = await Pet.findOne({ _id: petId, isDeleted: false });
        // console.log('Pet found:', pet); // Log pet object
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }
        res.status(200).json(pet);
    } catch (error) {
        console.log(error); // Log error to see details in the console
        res.status(500).json({ message: "Error fetching pet", error: error.message });
    }
};



// Update a pet's information
const updatePet = async (req, res) => {
    const { petId } = req.params;
    const updateData = req.body;

    try {
        const updatedPet = await Pet.findByIdAndUpdate(petId, updateData, { new: true });
        if (!updatedPet) {
            return res.status(404).json({ message: "Pet not found" });
        }
        res.status(200).json({ message: "Pet updated successfully", pet: updatedPet });
    } catch (error) {
        res.status(400).json({ message: "Error updating pet", error: error.message });
    }
};

const deletePet = async (req, res) => {
    const { petId } = req.params;

    try {
        const deletedPet = await Pet.findByIdAndUpdate(
            petId,
            { isDeleted: true },
            { new: true }
        );
        if (!deletedPet) {
            return res.status(404).json({ message: "Pet not found" });
        }
        res.status(200).json({ message: "Pet deleted successfully", pet: deletedPet });
    } catch (error) {
        res.status(500).json({ message: "Error deleting pet", error: error.message });
    }
};

module.exports = {
    createPet,
    getAllPets,
    getPetById,
    updatePet,
    deletePet
};
