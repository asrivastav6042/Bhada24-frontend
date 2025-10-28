import { User, Calendar, Star, Settings, LogOut, Menu } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { useState } from "react";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userName");
    toast.success("Logged out successfully");
    navigate("/");
    setOpen(false);
  };

  const menuItems = [
    { title: "My Profile", path: "/dashboard/profile", icon: User },
    { title: "My Bookings", path: "/dashboard/bookings", icon: Calendar },
    { title: "Rating", path: "/dashboard/rating", icon: Star },
    { title: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">bhada24</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome, {userName}</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50 safe-area-inset-bottom">
        <div className="flex justify-around items-center py-2 px-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.title.replace("My ", "")}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-destructive"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-card border-r min-h-screen p-4 md:p-6 hidden md:block">
        <SidebarContent />
      </aside>
    </>
  );
};

export default DashboardSidebar;
