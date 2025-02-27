
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building, 
  Car, 
  ClipboardList, 
  DollarSign, 
  Ticket, 
  Users, 
  Settings 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Studios", icon: Building, path: "/studios" },
  { label: "Drivers", icon: Car, path: "/drivers" },
  { label: "Orders", icon: ClipboardList, path: "/orders" },
  { label: "Revenue", icon: DollarSign, path: "/revenue" },
  { label: "Tickets", icon: Ticket, path: "/tickets" },
  { label: "Users", icon: Users, path: "/users" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  return (
    <aside
      className={`bg-white shadow-subtle overflow-y-auto z-20 transition-all duration-300 ease-in-out ${
        isOpen ? "w-60" : "w-16"
      } flex flex-col`}
    >
      <div className={`flex items-center justify-center h-16 border-b ${isOpen ? "px-4" : "px-0"}`}>
        {isOpen ? (
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-admin-primary">Laundry Admin</span>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <span className="font-bold text-xl text-admin-primary">LA</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 pt-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`flex items-center py-2 px-3 rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-admin-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                  {isOpen && (
                    <span className={`ml-3 font-medium ${isActive ? "text-white" : ""}`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        {isOpen ? (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-admin-primary flex items-center justify-center text-white font-medium">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-admin-primary flex items-center justify-center text-white font-medium">
              A
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
