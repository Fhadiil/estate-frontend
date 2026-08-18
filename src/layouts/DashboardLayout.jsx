import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, LogOut, Home, MessageSquare, Users, Building } from 'lucide-react';

const DashboardLayout = ({ isAdmin = false }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const adminLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Manage Properties', path: '/admin/properties', icon: <Building size={20} /> },
        { name: 'View Enquiries', path: '/admin/enquiries', icon: <MessageSquare size={20} /> },
    ];

    const clientLinks = [
        { name: 'Dashboard', path: '/client/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'My Enquiries', path: '/client/enquiries', icon: <MessageSquare size={20} /> },
        { name: 'Profile', path: '/client/profile', icon: <Users size={20} /> },
    ];

    const links = isAdmin ? adminLinks : clientLinks;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
                <div className="p-6">
                    <Link to="/" className="text-primary-600 font-bold text-2xl tracking-tight flex items-center gap-2">
                        <Building size={24} /> EstatePro
                    </Link>
                </div>
                <nav className="flex-grow px-4 space-y-2 mt-6">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 md:justify-end">
                    <div className="md:hidden">
                        <Link to="/" className="text-primary-600 font-bold text-xl">EstatePro</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, <strong>{user?.full_name}</strong></span>
                        <Link to="/" className="text-gray-500 hover:text-primary-600" title="Go to Website">
                            <Home size={20} />
                        </Link>
                    </div>
                </header>
                <div className="p-8 flex-1 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
