import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Search, MapPin, Bed, Bath, Square, Filter } from 'lucide-react';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Filters state
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [propertyType, setPropertyType] = useState(searchParams.get('type') || '');
    const [status, setStatus] = useState(searchParams.get('status') || '');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            let query = `properties/?page=${currentPage}`;
            if (searchTerm) query += `&search=${searchTerm}`;
            if (propertyType) query += `&property_type=${propertyType}`;
            if (status) query += `&status=${status}`;

            const res = await api.get(query);
            setProperties(res.data.results);
            setTotalPages(Math.ceil(res.data.count / 10)); // Assuming PAGE_SIZE is 10
        } catch (err) {
            console.error("Error fetching properties", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
        // Update URL params
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (propertyType) params.type = propertyType;
        if (status) params.status = status;
        setSearchParams(params);
    }, [currentPage, searchTerm, propertyType, status]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProperties();
    };

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Property Listings</h1>
                    <p className="text-gray-600 mt-2">Find your perfect property from our extensive catalog.</p>
                </div>

                {/* Filter Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search location, title..." 
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <select 
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                                value={propertyType}
                                onChange={(e) => { setPropertyType(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="">All Types</option>
                                <option value="HOUSE">House</option>
                                <option value="APARTMENT">Apartment</option>
                                <option value="CONDO">Condo</option>
                                <option value="COMMERCIAL">Commercial</option>
                            </select>
                        </div>
                        <div>
                            <select 
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                                value={status}
                                onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="">All Status</option>
                                <option value="AVAILABLE">Available</option>
                                <option value="SOLD">Sold</option>
                                <option value="RENTED">Rented</option>
                            </select>
                        </div>
                    </form>
                </div>

                {/* Listings */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No properties found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {properties.map((prop) => (
                                <div key={prop.id} className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-all group border border-gray-100">
                                    <div className="relative h-64 overflow-hidden bg-gray-200">
                                        <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            prop.status === 'AVAILABLE' ? 'bg-green-500' : prop.status === 'SOLD' ? 'bg-red-500' : 'bg-blue-500'
                                        }`}>
                                            {prop.status}
                                        </div>
                                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-lg font-bold text-gray-900 shadow-sm text-lg">
                                            ${parseFloat(prop.price).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">{prop.property_type}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-1">{prop.title}</h3>
                                        <p className="flex items-center text-gray-500 mb-4 text-sm"><MapPin size={16} className="mr-1 flex-shrink-0" /> <span className="truncate">{prop.location}</span></p>
                                        
                                        <div className="flex justify-between items-center py-4 border-y border-gray-100 mb-4">
                                            <div className="flex flex-col items-center"><div className="flex items-center gap-1 text-gray-700 font-medium"><Bed size={18} className="text-gray-400"/> {prop.bedrooms}</div><span className="text-xs text-gray-400">Beds</span></div>
                                            <div className="w-px h-8 bg-gray-100"></div>
                                            <div className="flex flex-col items-center"><div className="flex items-center gap-1 text-gray-700 font-medium"><Bath size={18} className="text-gray-400"/> {prop.bathrooms}</div><span className="text-xs text-gray-400">Baths</span></div>
                                            <div className="w-px h-8 bg-gray-100"></div>
                                            <div className="flex flex-col items-center"><div className="flex items-center gap-1 text-gray-700 font-medium"><Square size={18} className="text-gray-400"/> {prop.square_meter}</div><span className="text-xs text-gray-400">Sq.m</span></div>
                                        </div>
                                        
                                        <Link to={`/properties/${prop.id}`} className="block w-full text-center bg-gray-50 hover:bg-primary-600 hover:text-white text-primary-600 font-medium py-3 rounded-lg transition-colors border border-primary-100 hover:border-transparent">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12 gap-2">
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 bg-white"
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-4 py-2 rounded-md ${currentPage === i + 1 ? 'bg-primary-600 text-white' : 'border bg-white hover:bg-gray-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 bg-white"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Properties;
