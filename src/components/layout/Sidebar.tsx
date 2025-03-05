
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building, 
  Car, 
  ClipboardList, 
  DollarSign, 
  Ticket, 
  Users, 
  Settings,
  BarChart2,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  PieChart,
  Truck,
  UserCheck
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  children?: Omit<NavItem, 'children'>[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Studios", icon: Building, path: "/studios" },
  { label: "Drivers", icon: Car, path: "/drivers" },
  { label: "Orders", icon: ClipboardList, path: "/orders" },
  { 
    label: "Analytics", 
    icon: BarChart2, 
    path: "/analytics",
    children: [
      { label: "Studio Analytics", icon: Building, path: "/studios/overall-analytics" },
      { label: "User Analytics", icon: UserCheck, path: "/user-analytics" },
      { label: "Services Analytics", icon: PieChart, path: "/services-analytics" },
      { label: "Revenue Analytics", icon: TrendingUp, path: "/revenue" },
      { label: "Delivery Analytics", icon: Truck, path: "/delivery-analytics" },
    ] 
  },
  { label: "Revenue", icon: DollarSign, path: "/revenue" },
  { label: "Tickets", icon: Ticket, path: "/tickets" },
  { label: "Users", icon: Users, path: "/users" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const toggleItem = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label) 
        : [...prev, label]
    );
  };

  const isItemActive = (item: NavItem) => {
    if (item.path === '/' && location.pathname === '/') return true;
    if (item.path !== '/' && location.pathname.startsWith(item.path)) return true;
    if (item.children?.some(child => location.pathname.startsWith(child.path))) return true;
    return false;
  };
  
  return (
    <aside
      className={`bg-white shadow-subtle overflow-y-auto z-20 transition-all duration-300 ease-in-out ${
        isOpen ? "w-60" : "w-16"
      } flex flex-col`}
    >
      <div className={`flex items-center justify-center h-16 border-b ${isOpen ? "px-4" : "px-0"}`}>
        {isOpen ? (
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-admin-primary">Laundry Link</span>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <span className="font-bold text-xl text-admin-primary">LL</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 pt-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = isItemActive(item);
            const isExpanded = expandedItems.includes(item.label);
            const hasChildren = item.children && item.children.length > 0;
            
            return (
              <li key={item.label} className={hasChildren ? "mb-1" : ""}>
                {hasChildren ? (
                  <div className="flex flex-col">
                    <button
                      onClick={() => toggleItem(item.label)}
                      className={`flex items-center justify-between py-2 px-3 rounded-lg transition-all duration-200 w-full ${
                        isActive
                          ? "bg-admin-primary text-white shadow-subtle"
                          : "text-gray-700 hover:bg-admin-light"
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                        {isOpen && (
                          <span className={`ml-3 font-medium ${isActive ? "text-white" : ""}`}>
                            {item.label}
                          </span>
                        )}
                      </div>
                      {isOpen && hasChildren && (
                        isExpanded 
                          ? <ChevronDown className="h-4 w-4" /> 
                          : <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {isOpen && isExpanded && hasChildren && (
                      <ul className="pl-4 mt-1 space-y-1 animate-fade-in">
                        {item.children.map((child) => {
                          const isChildActive = location.pathname === child.path || 
                            (child.path !== "/" && location.pathname.startsWith(child.path));
                          
                          return (
                            <li key={child.label}>
                              <Link
                                to={child.path}
                                className={`flex items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                                  isChildActive
                                    ? "bg-admin-primary/90 text-white shadow-subtle"
                                    : "text-gray-700 hover:bg-admin-light"
                                }`}
                              >
                                <child.icon className={`h-4 w-4 ${isChildActive ? "text-white" : "text-gray-500"}`} />
                                <span className={`ml-3 font-medium text-sm ${isChildActive ? "text-white" : ""}`}>
                                  {child.label}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-admin-primary text-white shadow-subtle"
                        : "text-gray-700 hover:bg-admin-light"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                    {isOpen && (
                      <span className={`ml-3 font-medium ${isActive ? "text-white" : ""}`}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        {isOpen ? (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-admin-primary flex items-center justify-center text-white font-medium shadow-subtle">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-admin-primary flex items-center justify-center text-white font-medium shadow-subtle">
              A
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
