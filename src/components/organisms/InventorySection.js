import ButtonAction from "../atoms/ButtonAction";
import InventoryTable from "../molecules/InventoryTable";
import { resetInventory } from "../../utils/CartUtils";

export default function InventorySection() {
  
  return (
    <section className="p-4">
      <div className="align-items-center mb-3">
        <ButtonAction icon="bi-arrow-clockwise" label="Recargar" variant="danger"
          onClick={() => {
            if (window.confirm("¿Deseas recargar el inventario?")) {
              resetInventory(); // 🔹 Restaura, guarda y actualiza React
            }
          }}
        />
      </div>
      <InventoryTable />
    </section>
  );          
}
