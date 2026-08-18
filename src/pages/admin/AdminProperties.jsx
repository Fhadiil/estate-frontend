import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

const AdminProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', price: '', property_type: 'HOUSE',
        location: '', bedrooms: '', bathrooms: '', square_meter: '', status: 'AVAILABLE', image: null
    });
    
    const [previewImage, setPreviewImage] = useState(null);

    const fetchProperties = async () => {
        try {
            const res = await api.get('properties/');
            setProperties(res.data.results);
        } catch (err) {
            console.error("Error fetching properties", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const openModal = (prop = null) => {
        if (prop) {
            setIsEditing(true);
            setCurrentId(prop.id);
            setFormData({
                title: prop.title,
                description: prop.description,
                price: prop.price,
                property_type: prop.property_type,
                location: prop.location,
                bedrooms: prop.bedrooms,
                bathrooms: prop.bathrooms,
                square_meter: prop.square_meter,
                status: prop.status,
                image: null
            });
            setPreviewImage(prop.image);
        } else {
            setIsEditing(false);
            setCurrentId(null);
            setFormData({
                title: '', description: '', price: '', property_type: 'HOUSE',
                location: '', bedrooms: '', bathrooms: '', square_meter: '', status: 'AVAILABLE', image: null
            });
            setPreviewImage(null);
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, image: files[0] });
            if (files[0]) {
                setPreviewImage(URL.createObjectURL(files[0]));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        });

        try {
            if (isEditing) {
                await api.put(`properties/${currentId}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('properties/', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setIsModalOpen(false);
            fetchProperties();
        } catch (err) {
            console.error("Error saving property", err);
            alert("Error saving property. Please check inputs.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this property?")) {
            try {
                await api.delete(`properties/${id}/`);
                fetchProperties();
            } catch (err) {
                console.error("Error deleting property", err);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Properties</h1>
                <button 
                    onClick={() => openModal()} 
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2 font-medium"
                >
                    <Plus size={20} /> Add Property
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm">
                                    <th className="px-6 py-4 font-medium">Image</th>
                                    <th className="px-6 py-4 font-medium">Title</th>
                                    <th className="px-6 py-4 font-medium">Price</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {properties.map((prop) => (
                                    <tr key={prop.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="w-16 h-12 rounded overflow-hidden bg-gray-200">
                                                {prop.image ? (
                                                    <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-6 h-6 m-auto mt-3 text-gray-400" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{prop.title}</td>
                                        <td className="px-6 py-4 text-gray-600">${parseFloat(prop.price).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-semibold">{prop.property_type}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                prop.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : prop.status === 'SOLD' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {prop.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <button onClick={() => openModal(prop)} className="text-blue-600 hover:text-blue-800 transition-colors">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(prop.id)} className="text-red-600 hover:text-red-800 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl my-8">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Property' : 'Add New Property'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                        <input type="number" step="0.01" name="price" required value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                                        <select name="property_type" required value={formData.property_type} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                                            <option value="HOUSE">House</option>
                                            <option value="APARTMENT">Apartment</option>
                                            <option value="CONDO">Condo</option>
                                            <option value="LAND">Land</option>
                                            <option value="COMMERCIAL">Commercial</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select name="status" required value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                                            <option value="AVAILABLE">Available</option>
                                            <option value="SOLD">Sold</option>
                                            <option value="RENTED">Rented</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input type="text" name="location" required value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                                        <input type="number" name="bedrooms" required value={formData.bedrooms} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                                        <input type="number" name="bathrooms" required value={formData.bathrooms} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Square Meters</label>
                                        <input type="number" name="square_meter" required value={formData.square_meter} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea name="description" rows="3" required value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"></textarea>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                        <input type="file" name="image" accept="image/*" onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                                        {previewImage && (
                                            <div className="mt-4 w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                                        {isEditing ? 'Save Changes' : 'Create Property'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProperties;
