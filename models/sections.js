import mongoose from "mongoose";

const sectiosSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
     description: { type: String },
  },
  { timestamps: true }
);

const Sections =
  mongoose.models.Sections ||
  mongoose.model("Sections", sectiosSchema);

export default Sections;
