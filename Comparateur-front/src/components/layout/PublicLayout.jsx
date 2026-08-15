// src/components/layout/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <PublicNavbar />
            <Outlet />
        </div>
    );
}