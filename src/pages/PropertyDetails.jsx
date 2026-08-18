import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Bed, Bath, Square, ArrowLeft, Calendar, Send, CheckCircle2 } from 'lucide-react';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [enquiryStatus, setEnquiryStatus] = useState(null); // null, 'loading', 'success', 'error'

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await api.get(`properties/${id}/`);
                setProperty(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleEnquiry = async (e) => {
        e.preventDefault();
        if (!user) {
            setEnquiryStatus('auth_error');
            return;
        }
        setEnquiryStatus('loading');
        try {
            await api.post('enquiries/', {
                property: id,
                message: message
            });
            setEnquiryStatus('success');
            setMessage('');
        } catch (err) {
            setEnquiryStatus('error');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
                <Link to="/properties" className="text-primary-600 hover:underline flex items-center gap-2"><ArrowLeft size={16} /> Back to properties</Link>
            </div>
        );
    }

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/properties" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors">
                    <ArrowLeft size={20} /> Back to Listings
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                            <div className="relative h-[400px] md:h-[500px]">
                                <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                                <div className={`absolute top-4 right-4 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg ${
                                    property.status === 'AVAILABLE' ? 'bg-green-500' : property.status === 'SOLD' ? 'bg-red-500' : 'bg-blue-500'
                                }`}>
                                    {property.status}
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-md text-sm font-medium mb-3">
                                        {property.property_type}
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                                    <p className="flex items-center text-gray-500 text-lg"><MapPin size={20} className="mr-2 text-primary-500" /> {property.location}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-gray-900">${parseFloat(property.price).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-8 py-6 border-y border-gray-100 my-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600"><Bed size={24}/></div>
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{property.bedrooms}</p>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Bedrooms</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600"><Bath size={24}/></div>
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{property.bathrooms}</p>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Bathrooms</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600"><Square size={24}/></div>
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{property.square_meter}</p>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Square Meters</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600"><Calendar size={24}/></div>
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{new Date(property.created_at).getFullYear()}</p>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Listed</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                                <div className="text-gray-600 leading-relaxed space-y-4">
                                    {property.description.split('\n').map((para, idx) => (
                                        <p key={idx}>{para}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Enquiry Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-2xl shadow-sm sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Interested in this property?</h3>
                            
                            {enquiryStatus === 'success' ? (
                                <div className="bg-green-50 text-green-700 p-6 rounded-xl flex flex-col items-center text-center">
                                    <CheckCircle2 size={48} className="mb-4 text-green-500" />
                                    <h4 className="font-bold text-lg mb-2">Enquiry Sent!</h4>
                                    <p>We've received your message and an agent will contact you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleEnquiry} className="space-y-4">
                                    {enquiryStatus === 'error' && (
                                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">Failed to send enquiry. Please try again.</div>
                                    )}
                                    {enquiryStatus === 'auth_error' && (
                                        <div className="bg-orange-50 text-orange-600 p-3 rounded-lg text-sm">You must be logged in to send an enquiry. <Link to="/login" className="underline font-bold">Log in here</Link>.</div>
                                    )}
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                                        <textarea 
                                            rows="5" 
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" 
                                            placeholder="I would like to schedule a viewing or get more information..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={enquiryStatus === 'loading'}
                                        className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {enquiryStatus === 'loading' ? 'Sending...' : <><Send size={18} /> Send Enquiry</>}
                                    </button>
                                </form>
                            )}

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h4 className="font-medium text-gray-900 mb-4">Contact Agent Directly</h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                        <img src="https://i.pravatar.cc/150?img=11" alt="Agent" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Sarah Jenkins</p>
                                        <p className="text-sm text-gray-500">Senior Property Consultant</p>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <button className="text-sm bg-gray-50 text-gray-700 py-2 rounded font-medium hover:bg-gray-100">Call Now</button>
                                    <button className="text-sm bg-gray-50 text-gray-700 py-2 rounded font-medium hover:bg-gray-100">Email Agent</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
