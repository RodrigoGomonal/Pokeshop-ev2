import MainLayout from "../../templates/MainLayout";
import RegisterSection from "../../organisms/RegisterSection";

export default function RegisterUsu(){
  return (
    <MainLayout>
        <div className="container mt-4">
            <RegisterSection />
        </div>
    </MainLayout>
  );
}