import { Outlet } from "react-router-dom";
import Sidebar from "../component/SideBar/sidebar";

function AppLayout() {
  return (
    <div id="app">
      <Sidebar />

      <Outlet />
    </div>
  );
}

export default AppLayout;