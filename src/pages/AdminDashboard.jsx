import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Building, Users, MessageSquare, CheckCircle, Tag, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('dashboard/admin/stats/');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mt-20"></div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                        <Building size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Properties</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.total_properties || 0}</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Available Properties</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.available_properties || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                        <Tag size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Sold Properties</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.sold_properties || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Rented Properties</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.rented_properties || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Clients</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.total_clients || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Enquiries</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.total_enquiries || 0}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Recent Enquiries</h2>
                </div>
                {stats?.recent_enquiries?.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No recent enquiries.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm">
                                    <th className="px-6 py-3 font-medium">Client</th>
                                    <th className="px-6 py-3 font-medium">Property</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {stats?.recent_enquiries?.map((enq) => (
                                    <tr key={enq.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{enq.user__full_name}</td>
                                        <td className="px-6 py-4 text-gray-500">{enq.property__title}</td>
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

export default AdminDashboard;
