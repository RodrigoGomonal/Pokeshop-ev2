import InputCantidad from "../atoms/InputCantidad";

export default function QuantitySelector({ cantidad, setCantidad }) {
  const incrementar = () => setCantidad(prev => prev + 1);
  const decrementar = () => setCantidad(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="input-group mb-3">
      <button className="btn btn-outline-primary" type="button" onClick={decrementar}>-</button>
      <InputCantidad value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
      <button className="btn btn-outline-primary" type="button" onClick={incrementar}>+</button>
    </div>
  );
}