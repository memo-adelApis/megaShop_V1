import Drawer from "@/components/home/Drawer";
import ProductForm from "@/components/admin/ProductForm";

const ProductFormDrawer = ({ open, onClose, mode = "add", initialData }) => (
  <Drawer
    open={open}
    onClose={onClose}
    side="left"
    title={mode === "edit" ? "تعديل المنتج" : "إضافة منتج جديد"}
  >
    <ProductForm onSuccess={onClose} mode={mode} initialData={initialData} />
  </Drawer>
);

export default ProductFormDrawer;
