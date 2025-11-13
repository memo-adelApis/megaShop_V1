import Drawer from "@/components/home/Drawer";
import UserForm from "./UserForm";

const UserFormDrawer = ({ open, onClose, mode = "add", initialData }) => (
  <Drawer
    open={open}
    onClose={onClose}
    side="left"
    title={mode === "edit" ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
  >
    <UserForm onSuccess={onClose} mode={mode} initialData={initialData} />
  </Drawer>
);

export default UserFormDrawer;
