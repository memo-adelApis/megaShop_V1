import Drawer from "@/components/home/Drawer";
import BrandForm from "./BrandForm";

const BrandFormDrawer = ({ open, onClose, mode = "add", initialData }) => (
  <Drawer
    open={open}
    onClose={onClose}
    side="left"
    title={mode === "edit" ? "تعديل الماركة" : "إضافة ماركة جديدة"}
  >
    <BrandForm onSuccess={onClose} mode={mode} initialData={initialData} />
  </Drawer>
);

export default BrandFormDrawer;
