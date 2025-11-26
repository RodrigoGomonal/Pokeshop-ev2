import CardProd from "../atoms/CardProd";

export default function ProductGrid({ productos, onAddToCart }) {
  // Mostrar solo los productos activos
  const productosActivos = productos
    .filter((p) => p.active && p.stock_actual > 0); // solo activos con stock
  if (productosActivos.length === 0) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        ¡¡¡ Inventario Vacio, verificar conexion !!!
      </div>
    );
  }
  return (
    <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
      {productosActivos.map((p) => (
        <CardProd key={p.id} producto={p} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}