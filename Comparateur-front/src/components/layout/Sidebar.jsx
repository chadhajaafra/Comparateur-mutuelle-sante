import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    Activity,
} from "lucide-react";

const links = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/utilisateurs", icon: Users, label: "Utilisateurs" },
    { to: "/mutuelles", icon: Activity, label: "Mutuelles" },
    { to: "/devis", icon: FileText, label: "Devis" },
    { to: "/parametres", icon: Settings, label: "Paramètres" },
];

export default function Sidebar() {
    return (
        <aside
            className="
      w-20 hover:w-64 transition-all duration-300
      bg-white/70 dark:bg-slate-900/60
      backdrop-blur-xl
      border-r border-slate-200 dark:border-slate-800
      flex flex-col items-center hover:items-start
      py-6
      group
    "
        >
            <div className="text-violet-600 font-bold mb-10">
                ⚡
            </div>

            <nav className="flex flex-col gap-2 w-full px-2">
                {links.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `
              flex items-center gap-3
              px-3 py-3 rounded-xl
              transition-all
              relative
              ${isActive
                                ? "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }
            `
                        }
                    >
                        <Icon size={20} />

                        <span
                            className="
              text-sm font-medium
              opacity-0 group-hover:opacity-100
              transition
              whitespace-nowrap
            "
                        >
                            {label}
                        </span>

                        {/* active glow */}
                        <span className="absolute left-0 w-1 h-6 bg-violet-500 rounded-r-full opacity-0 group-hover:opacity-100" />
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}