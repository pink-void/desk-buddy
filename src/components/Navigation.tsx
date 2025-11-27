import { NavLink } from "@/components/NavLink";
import { LayoutGrid, Calendar, Map } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutGrid },
    { to: "/calendar", label: "Calendar", icon: Calendar },
    { to: "/floor-plan", label: "Floor Plan", icon: Map },
  ];

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">DeskCheck</span>
          </div>
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                  activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
