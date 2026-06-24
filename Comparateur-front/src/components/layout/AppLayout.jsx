import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
    return (
        <div className="
            min-h-screen flex
            bg-slate-50 dark:bg-slate-950
        ">
            <Sidebar />

            <div className="flex flex-col flex-1 min-w-0">

                <Topbar />

                <main className="flex-1 p-6 md:p-8 overflow-y-auto">

                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>

                </main>

            </div>
        </div>
    );
}