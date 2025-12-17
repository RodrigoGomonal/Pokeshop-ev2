import InventoryTable from "../molecules/InventoryTable";

export default function InventorySection() {
  return (
    <section className="p-4">
      <div className="align-items-center mb-3">
        <h1> Inventario</h1>
      </div>
      <InventoryTable />
    </section>
  );          
}
