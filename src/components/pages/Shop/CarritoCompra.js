import MainLayout from "../../templates/MainLayout";
import CarritoCompraSection from "../../organisms/CarritoSection";

export default function CarritoCompra(){
  return (
    <MainLayout>
        <div className="container mt-4">
            <CarritoCompraSection />
        </div>      
    </MainLayout>
  );
}