import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, User, History, CheckCircle, CreditCard, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";

export default function Layout() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col shadow-sm">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">Next Action</h1>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/onboarding" icon={<CheckCircle size={20} />} label="Onboarding" />
          <NavItem to="/history" icon={<History size={20} />} label="History" />
          <NavItem to="/billing" icon={<CreditCard size={20} />} label="Billing" />
          <div className="my-4 h-px bg-border" />
          <NavItem to="/users" icon={<User size={20} />} label="Users" />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>
        <div className="p-4 border-t bg-secondary/10">
          <div className="flex items-center gap-3">
             <UserButton afterSignOutUrl="/sign-in" />
             <div className="flex flex-col">
               <span className="text-sm font-medium">My Account</span>
               <span className="text-xs text-muted-foreground">Manage profile</span>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-secondary/5 relative">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
        isActive 
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
          : "hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:translate-x-1"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
