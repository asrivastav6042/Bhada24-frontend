import { Outlet, Navigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import Header from "@/components/Header";

const Dashboard = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen w-full">
      <Header />
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
