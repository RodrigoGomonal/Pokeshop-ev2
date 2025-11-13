export default function InputCantidad({ value, onChange }) {
  return (
    <input
      id="txt_cantidad"
      type="number"
      className="form-control text-center"
      value={value}
      min="1"
      required
      onChange={onChange}
    />
  );
}