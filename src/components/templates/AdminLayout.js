import Sidebar from "../molecules/Sidebar";
import '../../App.css';

export default function AdminLayout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1 Adminmain" >{children}</main>{/*  */}
    </div>
  );
}
