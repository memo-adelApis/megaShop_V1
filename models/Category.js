// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String, 
    section : { type: mongoose.Schema.Types.ObjectId, ref: 'Sections' },

  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", categorySchema);
