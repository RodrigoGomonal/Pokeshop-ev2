import MainLayout from "../../templates/MainLayout";
import HomeSection from "../../organisms/HomeSection";
import '../../../App.css';

export default function Home(){
  return (
    <>  
      <MainLayout>
        <main className="container mt-4">
          <HomeSection />
        </main>
      </MainLayout>
      
    </>
  );
}