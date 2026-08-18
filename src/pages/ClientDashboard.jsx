import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [recentEnquiries, setRecentEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, enquiriesRes] = await Promise.all([
                    api.get('dashboard/client/stats/'),
                    api.get('enquiries/')
                ]);
                setStats(statsRes.data);
                setRecentEnquiries(enquiriesRes.data.results.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mt-20"></div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Enquiries</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.total_enquiries || 0}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Pending</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.pending_enquiries || 0}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Responded</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.responded_enquiries || 0}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Recent Enquiries</h2>
                </div>
                {recentEnquiries.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">You haven't made any enquiries yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm">
                                    <th className="px-6 py-3 font-medium">Property</th>
                                    <th className="px-6 py-3 font-medium">Message</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {recentEnquiries.map((enq) => (
                                    <tr key={enq.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{enq.property.title}</td>
                                        <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{enq.message}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                enq.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {enq.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(enq.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
