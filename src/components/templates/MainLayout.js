import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
import '../../App.css';

export default function MainLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container flex-grow-1 mt-4 mb-5">{children}</main>
      <Footer />
    </div>
  );
}