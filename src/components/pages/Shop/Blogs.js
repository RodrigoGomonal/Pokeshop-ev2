import MainLayout from "../../templates/MainLayout";
import BlogSection from "../../organisms/BlogSection";

export default function Blogs(){
  return (
    <MainLayout>
        <div className="container mt-4">
            <BlogSection />
        </div>
    </MainLayout>
  );
}