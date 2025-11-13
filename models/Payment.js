// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  amount: Number,
  status: {
    type: String,
    enum: ['قيد المعالجة', 'مكتملة', 'مرفوضة'],
    default: 'قيد المعالجة',
  },
  method: {
    type: String,
    enum: ['بطاقة', 'تحويل بنكي', 'كاش'],
  },
  invoice: String, // مسار ملف الفاتورة PDF
}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default Payment;
