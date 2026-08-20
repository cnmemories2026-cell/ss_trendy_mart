import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, MessageSquare, Phone, MapPin, Calendar, ShoppingBag, Eye, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getCustomerWhatsAppLink } from '../../utils/whatsapp';
import { StatusBadge } from '../../components/StatusBadge';

export const AdminCustomers = () => {
  const { customers, isAdminLoggedIn } = useStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  React.useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchName = c.name.toLowerCase().includes(q);
    const matchPhone = c.phone.includes(q);
    const matchWhatsApp = c.whatsapp.includes(q);
    const matchOrderId = c.orders.some(o => o.id.toLowerCase().includes(q));
    return matchName || matchPhone || matchWhatsApp || matchOrderId;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Customer Database</h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete customer database automatically aggregated from all submitted orders. Search by name, phone, or order ID.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by customer name, phone, WhatsApp, or Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-extrabold tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Phone / WhatsApp</th>
                <th className="py-3.5 px-4">Delivery Address</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Last Order Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(cust => (
                  <tr key={cust.customerId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-gray-900 text-sm">{cust.name}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-800">{cust.phone}</div>
                      <a
                        href={getCustomerWhatsAppLink(cust.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <MessageSquare className="w-3 h-3" /> WhatsApp
                      </a>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-gray-600 line-clamp-1 max-w-xs font-medium">{cust.address}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 rounded-full font-bold">
                        {cust.totalOrders} {cust.totalOrders === 1 ? 'Order' : 'Orders'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 font-medium">
                      {new Date(cust.lastOrderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-brand-50 text-gray-800 hover:text-brand-700 font-bold rounded-xl transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> History
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    No customers found matching "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-xl font-black text-gray-900">{selectedCustomer.name}</h3>
                <p className="text-xs text-gray-500">Phone: {selectedCustomer.phone}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
              <span className="text-gray-400 font-bold uppercase block mb-1">Primary Address</span>
              <p className="text-gray-900 font-medium">{selectedCustomer.address}</p>
            </div>

            {/* Order History */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Purchase Order History ({selectedCustomer.orders.length})
              </h4>
              <div className="space-y-3">
                {selectedCustomer.orders.map(order => (
                  <div key={order.id} className="p-4 bg-white border border-gray-100 rounded-2xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-brand-600 text-sm">#{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="space-y-1 text-xs">
                      {order.products.map((p, i) => (
                        <div key={i} className="flex justify-between text-gray-700">
                          <span>{p.name} × {p.quantity}</span>
                          <span className="font-bold">{p.price ? `₹${p.price * p.quantity}` : 'Contact us'}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs">
                      <span className="text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="font-extrabold text-gray-900">Total: ₹{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
