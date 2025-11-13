import MainLayout from "../../templates/MainLayout";
import ProductosSection from "../../organisms/ProductosSection";

export default function Productos() {
  return (
    <>
      <MainLayout>
        <div className="text-center mb-4">
          <h1 className="fw-bold">Nuestros Productos</h1>
          <p className="text-muted">Explora la colección de artículos Pokémon disponibles en PokeShop.</p>
        </div>
        <ProductosSection />
      </MainLayout>
    </>
  );
}
