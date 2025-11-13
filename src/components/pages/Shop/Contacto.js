import MainLayout from "../../templates/MainLayout";
import ContactoSection from "../../organisms/ContactoSection";

export default function Contacto(){
  return (
    <MainLayout>
        <div className="container mt-4">
            <ContactoSection />
        </div>
    </MainLayout>
  );
}