import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, MapPin, Bed, Bath, Square, ArrowRight, Star, Users, Building } from 'lucide-react';

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await api.get('properties/');
                setFeatured(res.data.results.slice(0, 3));
            } catch (err) {
                console.error(err);
            }
        };
        fetchProperties();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/properties?search=${searchQuery}`);
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80" alt="Hero" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Find Your Dream Home Today</h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10">Discover the perfect property from our extensive collection of premium real estate listings.</p>
                    
                    {/* Search Bar */}
                    <div className="bg-white p-2 rounded-lg shadow-xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
                        <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-md">
                            <Search className="text-gray-400 mr-2" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search by location, title, or keyword..." 
                                className="w-full py-3 bg-transparent border-none focus:outline-none text-gray-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button onClick={handleSearch} className="bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 transition-colors font-medium">
                            Search Properties
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Properties */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Explore some of our most exclusive and sought-after properties currently on the market.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featured.map((prop) => (
                            <div key={prop.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
                                <div className="relative h-64 overflow-hidden">
                                    <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {prop.status}
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg font-bold text-gray-900">
                                        ${parseFloat(prop.price).toLocaleString()}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-1">{prop.title}</h3>
                                    <p className="flex items-center text-gray-500 mb-4 text-sm"><MapPin size={16} className="mr-1" /> {prop.location}</p>
                                    
                                    <div className="flex justify-between items-center py-4 border-y border-gray-100 mb-4">
                                        <div className="flex items-center gap-1 text-gray-600"><Bed size={18}/> <span>{prop.bedrooms}</span></div>
                                        <div className="flex items-center gap-1 text-gray-600"><Bath size={18}/> <span>{prop.bathrooms}</span></div>
                                        <div className="flex items-center gap-1 text-gray-600"><Square size={18}/> <span>{prop.square_meter}m²</span></div>
                                    </div>
                                    
                                    <Link to={`/properties/${prop.id}`} className="block w-full text-center bg-gray-50 text-primary-600 font-medium py-2 rounded-md hover:bg-primary-50 transition-colors">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/properties" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700">
                            View All Properties <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">We provide a seamless and professional experience for finding your perfect home.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="p-6 rounded-2xl bg-primary-50 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Star size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Premium Properties</h3>
                            <p className="text-gray-600">We carefully curate our property listings to ensure we only offer the best to our clients.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-primary-50 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Expert Agents</h3>
                            <p className="text-gray-600">Our team of experienced real estate agents is dedicated to finding exactly what you need.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-primary-50 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Building size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Seamless Process</h3>
                            <p className="text-gray-600">From browsing to closing, we make the entire property buying or renting process hassle-free.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call To Action */}
            <section className="py-20 bg-primary-600 text-white">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find your dream home?</h2>
                    <p className="text-xl text-primary-100 mb-8">Join thousands of satisfied clients who found their perfect property with us.</p>
                    <Link to="/register" className="inline-block bg-white text-primary-600 font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-gray-50 transition-colors transform hover:scale-105 duration-200">
                        Get Started Today
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
