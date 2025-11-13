import Drawer from "@/components/home/Drawer";
import CategoryForm from "./CategoryForm";

const CategoryFormDrawer = ({ open, onClose, mode = "add", initialData }) => (
  <Drawer
    open={open}
    onClose={onClose}
    side="left"
    title={mode === "edit" ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
  >
    <CategoryForm onSuccess={onClose} mode={mode} initialData={initialData} />
  </Drawer>
);

export default CategoryFormDrawer;
