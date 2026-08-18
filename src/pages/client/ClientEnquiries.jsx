import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ClientEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const res = await api.get('enquiries/');
                setEnquiries(res.data.results || res.data);
            } catch (err) {
                console.error("Error fetching enquiries", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEnquiries();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Enquiries</h1>
                <p className="text-gray-600 mt-1">Track the status of properties you've inquired about.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                                <th className="px-6 py-4 font-medium">Property</th>
                                <th className="px-6 py-4 font-medium">My Message</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Date Submitted</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {enquiries.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        You haven't made any enquiries yet.
                                    </td>
                                </tr>
                            )}
                            {enquiries.map((enq) => (
                                <tr key={enq.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-primary-600">{enq.property?.title}</p>
                                        <p className="text-gray-500 text-xs mt-1">{enq.property?.location}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="max-w-md break-words whitespace-pre-wrap">{enq.message}</div>
                                        {enq.admin_response && (
                                            <div className="mt-3 text-sm bg-primary-50 p-4 rounded-lg text-gray-800 border-l-4 border-primary-500 shadow-sm">
                                                <p className="font-bold text-primary-700 mb-1 text-xs uppercase tracking-wider">Admin Response:</p>
                                                <p className="whitespace-pre-wrap">{enq.admin_response}</p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            enq.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                            {enq.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(enq.created_at).toLocaleDateString()} at {new Date(enq.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClientEnquiries;
