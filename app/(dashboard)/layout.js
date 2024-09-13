import Sidebar from "@/components/layout/Sidebar";
import './styles.css';

export default function Layout({ children }) {
  return (
    <div className="wrapper">
      <Sidebar />
      {children}
    </div>
  );
}
