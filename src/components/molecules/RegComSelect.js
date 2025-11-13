import { useState } from "react";
import SelectField from "../atoms/SelectField";
import regionesYComunas from "../../data/regionesYComunas";

export default function RegionComunaSelect() {
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setComuna(""); // reset comuna cuando cambia la región
  };

  const regionSeleccionada = regionesYComunas.find((r) => r.nombre === region);
  const comunas = regionSeleccionada ? regionSeleccionada.comunas : [];

  return (
    <div className="row justify-content-center pt-2">
      <div className="col-md-5">
        <SelectField
          label="Región"
          id="sel_region"
          value={region}
          onChange={handleRegionChange}
          options={regionesYComunas.map((r) => r.nombre)}
          required
        />
      </div>
      <div className="col-md-5">
        <SelectField
          label="Comuna"
          id="sel_comuna"
          value={comuna}
          onChange={(e) => setComuna(e.target.value)}
          options={comunas}
          disabled={!region}
          required
        />
      </div>
    </div>
  );
}
