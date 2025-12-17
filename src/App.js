import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Páginas de la tienda
import Home from './components/pages/Shop/Home';
import Productos from './components/pages/Shop/Productos';
import Nosotros from './components/pages/Shop/Nosotros';
import Blogs from './components/pages/Shop/Blogs';
import CarritoCompra from './components/pages/Shop/CarritoCompra';
import Login from './components/pages/Shop/Login';
import RegisterUsu from './components/pages/Shop/RegisterUsu';
import DetalleProducto from './components/pages/Shop/DetalleProducto';
import Contacto from './components/pages/Shop/Contacto';
// Páginas de administración
import AdHome from './components/pages/Admin/Home';
import Inventory from './components/pages/Admin/Inventory';
import UserList from './components/pages/Admin/UserList';
import Boletas from './components/pages/Admin/Boletas';
// Páginas de vendedor
import VendHome from './components/pages/Vendedor/Home';
import VendInventory from './components/pages/Vendedor/Inventory';


export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* La ruta con path="/" es la página principal (Home) */}
          <Route path="/" element={<Home/>} />
          {/* Otras paginas */}
          {/* Tienda */}
          <Route path="/productos" element={<Productos />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/carritoCompra" element={<CarritoCompra />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registerUsu" element={<RegisterUsu />} />
          <Route path="/detalleProducto" element={<DetalleProducto />} />
          <Route path="/detalleProducto/:id" element={<DetalleProducto />} />
          <Route path="/contacto" element={<Contacto />} />
          {/* Admin */}
          <Route path="/admin/home" element={<AdHome />} />
          <Route path="/admin/inventario" element={<Inventory />} />
          <Route path="/admin/userlist" element={<UserList />} />
          <Route path="/admin/boletas" element={<Boletas />} />
          {/* Vendedor */}
          <Route path="/vendedor/home" element={<VendHome />} />
          <Route path="/vendedor/inventario" element={<VendInventory />} />
        </Routes>
      </Router>
    </div>
  );
}