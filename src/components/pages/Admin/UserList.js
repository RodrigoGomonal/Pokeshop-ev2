import AdminLayout from "../../templates/AdminLayout";
import UserListSection from "../../organisms/UserListSection";

export default function AdminInventory() {
  return (
    <AdminLayout>
        <div className="container mt-4">
            <h2>Lista de Usuarios</h2>
            
        </div>
        <UserListSection />
    </AdminLayout>
  );
}