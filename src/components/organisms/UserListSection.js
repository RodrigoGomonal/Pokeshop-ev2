import UserTable from "../molecules/UserTable";

export default function InventorySection() {
  
  return (
    <section className="p-4">
      <div className="align-items-center mb-3">
          <h1>Lista de Usuarios</h1>
      </div>
      <UserTable />
    </section>
  );          
}