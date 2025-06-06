  import React ,{useState}from "react";
  import Sidebar from "./sidebar";
  import Header from "./header";

  const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Toggle Sidebar Visibility
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
    return (
      <div className="employee_dashboard">
  <Sidebar isSidebarOpen={isSidebarOpen} />
  <main className={`dashboard_right_block ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
  <Header toggleSidebar={toggleSidebar} />

    {children}</main>
      </div>
    );
  };

  export default Layout;
