import Drawer from "@/components/home/Drawer";
import OfferForm from "./OfferForm";

const OfferFormDrawer = ({ open, onClose, mode = "add", initialData }) => (
  <Drawer
    open={open}
    onClose={onClose}
    side="left"
    title={mode === "edit" ? "تعديل العرض" : "إضافة عرض جديد"}
  >
    <OfferForm onSuccess={onClose} mode={mode} initialData={initialData} />
  </Drawer>
);

export default OfferFormDrawer;
