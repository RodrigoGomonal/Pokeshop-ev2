import CardProdH from "../atoms/CardProdH";
import '../../App.css';

export default function ProductGrid({ productos }) {
  // Filtrar solo los productos activos y tomar los últimos 8
  const productosActivos = productos
    .filter((p) => p.active && p.stock_actual > 0) // solo activos con stock
    .slice(-8);                                    // últimos 8 agregados(del final del arreglo)
  if (productosActivos.length === 0) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        ¡¡¡ Inventario Vacio, verificar conexion !!!
      </div>
    );
  }
  return (
    <div className="pokeMartBackground rounded-4 pt-4 pb-3">
      <h2 className="text-center fw-bold mb-4 adminTitle">Novedades</h2>
      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 p-3">
        {productosActivos.map((p) => (
          <CardProdH key={p.id} producto={p} />
        ))}
      </div>
    </div>
  );
}