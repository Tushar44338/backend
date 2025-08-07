import mongoose from 'mongoose'

const medical_reportSchema = new mongoose.Schema({
    patientName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
        
}, {timestamps: true})

export const Medical_Report = mongoose.model("Madical_Report", medical_reportSchema)