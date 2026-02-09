import { Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Settings, User, History, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";

export default function Layout() {
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight">PERN App</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/onboarding" icon={<CheckCircle size={20} />} label="Onboarding" />
          <NavItem to="/history" icon={<History size={20} />} label="History" />
          <NavItem to="/users" icon={<User size={20} />} label="Users" />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
             <UserButton afterSignOutUrl="/sign-in" />
             <span className="text-sm font-medium">Account</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
