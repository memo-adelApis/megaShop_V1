// models/Brand.js
import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    logo: String,
    logoId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);
export default mongoose.models.Brand || mongoose.model("Brand", brandSchema);
