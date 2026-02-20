import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import {
    LayoutDashboard,
    CheckSquare,
    CalendarDays,
    Clock,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function Layout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/tasks', label: 'Tasks', icon: CheckSquare },
        { path: '/planner', label: 'Planner', icon: Clock },
        { path: '/calendar', label: 'Calendar', icon: CalendarDays },
    ];

    return (
        <div className="flex h-screen bg-background text-primary-text font-sans selection:bg-primary-500/30">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-card border-r border-white/5 h-full">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                        S
                    </div>
                    <span className="text-xl font-bold text-gray-100 tracking-tight">StudyFlow</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-primary-500/10 text-primary-400 font-medium"
                                        : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
                                )}
                                <Icon className={clsx("w-5 h-5", isActive ? "text-primary-400" : "text-gray-500 group-hover:text-gray-300")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <img src={user?.avatar || "https://ui-avatars.com/api/?name=" + user?.name} alt={user?.name} className="w-8 h-8 rounded-full bg-gray-700" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-200 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 w-full text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-card border-b border-white/5 z-20">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">S</div>
                        <span className="font-bold text-gray-100">StudyFlow</span>
                    </div>
                    {/* User Profile for Mobile */}
                    <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                        <img src={user?.avatar || "https://ui-avatars.com/api/?name=" + user?.name} alt={user?.name} className="w-full h-full object-cover" />
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                    {/* Spacer for bottom nav on mobile */}
                    <div className="h-20 md:hidden"></div>
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-white/5 px-6 py-3 z-30 flex justify-between items-center safe-area-bottom">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="flex flex-col items-center gap-1 min-w-[64px]"
                            >
                                <div className={clsx(
                                    "p-2 rounded-xl transition-all duration-200",
                                    isActive ? "bg-primary-500/20 text-primary-400" : "text-gray-500"
                                )}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                {/* <span className={clsx("text-[10px] font-medium", isActive ? "text-primary-400" : "text-gray-500")}>
                                    {item.label}
                                </span> */}
                            </Link>
                        );
                    })}
                </nav>
            </main>
        </div>
    );
}
