// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    invoiceId: String,
    invoiceDate: Date,
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    totleInvoice : { type: Number, default: 0 },
    stockSold : { type: Number, default: 0 },
    stockRemaining: { type: Number, default: 0 },
    unit: { type: String, default: "قطعة" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    images: [String],
    section : { type: mongoose.Schema.Types.ObjectId, ref: "Sections" },
    imageIds: [String],
    rating: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    discountRate: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    priceAfterDiscount: { type: Number, default: 0 },
    discountOnProduct : { type: Number, default: 0 },
    additionalOnProduct : { type: Number, default: 0 },
    productPriceAfterDiscount : { type: Number, default: 0 },
    sellingPrice : { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    attributes: [{
      key : String,
      value: [String]
  }],
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    soldOut: { type: Boolean, default: false },
  },
  
  { timestamps: true }
);


productSchema.pre("save", function (next) {
  this.soldOut = this.stock === 0;
  this.stockRemaining = this.stock - this.stockSold;
  if (this.stockRemaining < 0) this.stockRemaining = 0;
  if (this.stock < 0) this.stock = 0;
  if (this.stockSold < 0) this.stockSold = 0;
  if (this.discountRate < 0) this.discountRate = 0;
  if (this.discountRate > 100) this.discountRate = 100;
  
  next();
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);

