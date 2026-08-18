import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, Home, Building2, Info, Phone, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';

const MainLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
                                <Building2 size={28} />
                                <span className="font-bold text-xl tracking-tight">EstatePro</span>
                            </Link>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-1"><Home size={18}/> Home</Link>
                            <Link to="/properties" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-1"><Building2 size={18}/> Properties</Link>
                            <Link to="/about" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-1"><Info size={18}/> About</Link>
                            <Link to="/contact" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-1"><Phone size={18}/> Contact</Link>
                        </nav>

                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                <>
                                    <Link to={user.role === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard'} className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-1">
                                        <LayoutDashboard size={18} /> Dashboard
                                    </Link>
                                    <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                                        <LogOut size={18} /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-1"><LogIn size={18}/> Login</Link>
                                    <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors font-medium flex items-center gap-1"><UserPlus size={18}/> Register</Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-primary-600 focus:outline-none">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Home</Link>
                            <Link to="/properties" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Properties</Link>
                            <Link to="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>About</Link>
                            <Link to="/contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                            
                            {user ? (
                                <>
                                    <Link to={user.role === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard'} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                    <Link to="/register" className="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 size={28} className="text-primary-500" />
                                <span className="font-bold text-xl tracking-tight">EstatePro</span>
                            </div>
                            <p className="text-gray-400">Finding your dream home has never been easier. We offer a wide range of properties to suit every lifestyle and budget.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
                                <li><Link to="/properties" className="hover:text-primary-500 transition-colors">Properties</Link></li>
                                <li><Link to="/about" className="hover:text-primary-500 transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="hover:text-primary-500 transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li className="flex items-center gap-2"><Phone size={16} /> +1 (555) 123-4567</li>
                                <li className="flex items-center gap-2"><span>✉</span> info@estatepro.com</li>
                                <li className="flex items-center gap-2"><span>📍</span> 123 Real Estate Blvd, NY</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} EstatePro. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
