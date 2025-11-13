import ButtonAction from "../atoms/ButtonAction";
import UserTable from "../molecules/UserTable";
import { resetUsers } from "../../utils/UserUtils";

export default function InventorySection() {
  
  return (
    <section className="p-4">
      <div className="align-items-center mb-3">
        <ButtonAction icon="bi-arrow-clockwise" label="Recargar" variant="danger"
          onClick={() => {
            if (window.confirm("¿Deseas recargar la base de usuarios?")) {
              resetUsers();
            }
          }}
        />
      </div>
      <UserTable />
    </section>
  );          
}