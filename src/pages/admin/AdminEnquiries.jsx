import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CheckCircle, Trash2, Mail, MessageSquare, X } from 'lucide-react';

const AdminEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [responseText, setResponseText] = useState('');

    const fetchEnquiries = async () => {
        try {
            const res = await api.get('enquiries/');
            setEnquiries(res.data.results || res.data); // Adjusting based on pagination
        } catch (err) {
            console.error("Error fetching enquiries", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const openResponseModal = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setResponseText(enquiry.admin_response || '');
        setIsModalOpen(true);
    };

    const handleResponseSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`enquiries/${selectedEnquiry.id}/`, { 
                status: 'RESPONDED',
                admin_response: responseText
            });
            setIsModalOpen(false);
            fetchEnquiries();
        } catch (err) {
            console.error("Error updating enquiry", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this enquiry?")) {
            try {
                await api.delete(`enquiries/${id}/`);
                fetchEnquiries();
            } catch (err) {
                console.error("Error deleting enquiry", err);
            }
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">View Enquiries</h1>
                <p className="text-gray-600 mt-1">Manage client messages and responses.</p>
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
                                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                                    <th className="px-6 py-4 font-medium">Client Info</th>
                                    <th className="px-6 py-4 font-medium">Property</th>
                                    <th className="px-6 py-4 font-medium">Message</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {enquiries.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            No enquiries found.
                                        </td>
                                    </tr>
                                )}
                                {enquiries.map((enq) => (
                                    <tr key={enq.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{enq.user?.full_name}</p>
                                            <a href={`mailto:${enq.user?.email}`} className="text-gray-500 flex items-center gap-1 text-xs hover:text-primary-600">
                                                <Mail size={12} /> {enq.user?.email}
                                            </a>
                                            <p className="text-gray-500 text-xs mt-1">{enq.user?.phone}</p>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-primary-600">{enq.property?.title}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="max-w-xs break-words whitespace-pre-wrap">{enq.message}</div>
                                            {enq.admin_response && (
                                                <div className="mt-2 text-xs bg-gray-100 p-2 rounded text-gray-700 italic border-l-2 border-primary-500">
                                                    <strong>You:</strong> {enq.admin_response}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(enq.created_at).toLocaleDateString()}<br/>
                                            <span className="text-xs">{new Date(enq.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                enq.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {enq.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                {enq.status === 'PENDING' && (
                                                    <button 
                                                        onClick={() => openResponseModal(enq)} 
                                                        className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                                                        title="Respond to Client"
                                                    >
                                                        <MessageSquare size={18} />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleDelete(enq.id)} 
                                                    className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                                                    title="Delete Enquiry"
                                                >
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

            {/* Response Modal */}
            {isModalOpen && selectedEnquiry && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Respond to Enquiry</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Client Message:</p>
                                <p className="text-gray-900 text-sm whitespace-pre-wrap">{selectedEnquiry.message}</p>
                            </div>
                            <form onSubmit={handleResponseSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                                    <textarea 
                                        rows="4" 
                                        required
                                        value={responseText}
                                        onChange={(e) => setResponseText(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="Type your reply here..."
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                                    <button type="submit" className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">Send Response</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEnquiries;
