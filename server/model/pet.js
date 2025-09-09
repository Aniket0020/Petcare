const mongoose = require("mongoose");

// Owner sub-schema
const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Owner's name is required"],
        trim: true,
    },
    contactNumber: {
        type: String,
        required: [true, "Owner's contact number is required"],
        match: [/^\d{10}$/, "Must be a valid 10-digit number"],
    },
});

// Medical record sub-schema
const medicalRecordSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        trim: true,
    },
    vet: {
        type: String,
        trim: true,
    },
});

// Pet schema
const petSchema = new mongoose.Schema(
    {
       


        about: {
            type: String,
            required: [false, "About section is required"],
            trim: true,
            minlength: [2, "About must be at least 2 characters long"],
            maxlength: [100, "About must not exceed 100 characters"],
        },
        name: {
            type: String,
            required: [true, "Pet name is required"],
            trim: true,
            minlength: 2,
        },
        breed: {
            type: String,
            required: [true, "Breed is required"],
            trim: true,
        },
        DOB: {
            type: Date,
            required: [true, "Date of Birth is required"],
        },
        gender: {
            type: String,
            required: [true, "Gender is required"],
            enum: ["male", "female", "other"],
        },
        template: {
            type: String,
            enum: ['template1', 'template2', 'template3'],
            default: 'template1',
        },
        weight: {
            type: Number,
            required: [true, "Weight is required"],
            min: [0, "Weight cannot be negative"],
        },
        color: {
            type: String,
            trim: true,
            default: "Unknown",
        },
        owner: {
            type: ownerSchema,
            required: true,
        },
        vaccinated: {
            type: Boolean,
            default: false,
        },
        medicalRecords: [medicalRecordSchema],
        image: {
            type: String, // Base64 image
            required: [false, "Pet image is required"],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true

        },
        activationCode: String,
        isActivated: { type: Boolean, default: false },
      
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual to calculate age from DOB
petSchema.virtual('age').get(function () {
    if (!this.DOB) return null;
    const today = new Date();
    const birthDate = new Date(this.DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

module.exports = mongoose.model("Pet", petSchema);
