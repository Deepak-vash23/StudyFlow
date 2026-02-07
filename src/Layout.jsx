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
import Grainient from './components/Grainient';

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
        <div className="flex h-screen relative overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Grainient
                    color1="#FF9FFC"
                    color2="#5227FF"
                    color3="#B19EEF"
                    timeSpeed={0.25}
                    colorBalance={0}
                    warpStrength={1}
                    warpFrequency={5}
                    warpSpeed={2}
                    warpAmplitude={50}
                    blendAngle={0}
                    blendSoftness={0.05}
                    rotationAmount={500}
                    noiseScale={2}
                    grainAmount={0.1}
                    grainScale={2}
                    grainAnimated={false}
                    contrast={1.5}
                    gamma={1}
                    saturation={1}
                    centerX={0}
                    centerY={0}
                    zoom={0.9}
                />
            </div>

            {/* Content Layer (on top of background) */}
            <div className="flex w-full h-full z-10 relative">
                {/* Sidebar for Desktop */}
                <aside className="hidden md:flex flex-col w-64 bg-white/70 border-r border-white/20 backdrop-blur-xl rounded-r-3xl mr-4">
                    <div className="p-6 border-b border-white/20 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            S
                        </div>
                        <span className="text-xl font-bold text-gray-800">StudyFlow</span>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                        isActive
                                            ? "bg-white/60 text-primary-600 font-medium shadow-sm border border-white/40"
                                            : "text-gray-600 hover:bg-white/40 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className={clsx("w-5 h-5", isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600")} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-white/20">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full shadow-sm" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-red-600 hover:bg-red-50/50 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Mobile Header & Overlay */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <header className="md:hidden flex items-center justify-between p-4 bg-white/70 border-b border-white/20 z-40 backdrop-blur-xl">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold shadow-sm">S</div>
                            <span className="font-bold text-gray-800">StudyFlow</span>
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </header>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden fixed inset-0 z-50 bg-gray-900/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className="fixed inset-y-0 left-0 w-64 bg-white/90 backdrop-blur-xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <span className="text-xl font-bold text-gray-800">Menu</span>
                                    <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
                                </div>
                                <nav className="flex-1 p-4 space-y-1">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={clsx(
                                                "flex items-center gap-3 px-4 py-3 rounded-lg",
                                                location.pathname === item.path ? "bg-primary-50 text-primary-600" : "text-gray-600"
                                            )}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="p-4 border-t border-gray-100/50 bg-white/50 backdrop-blur-sm">
                                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                                        <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full shadow-sm" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-2 w-full text-sm text-red-600 hover:bg-red-50/50 rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <main className="flex-1 overflow-y-auto p-4 md:p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
