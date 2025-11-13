// components/admin/CouponFormDrawer.js
import Drawer from "@/components/home/Drawer";
import CouponForm from "./couponForm";

const CouponFormDrawer = ({ open, onClose, mode = "add", initialData }) => (
  <Drawer
    open={open}
    onClose={onClose}
    side="left"
    title={mode === "edit" ? "تعديل الكوبون" : "إضافة كوبون جديد"}
  >
    <CouponForm 
      onSuccess={onClose} 
      mode={mode} 
      initialData={initialData} 
    />
  </Drawer>
);

export default CouponFormDrawer;