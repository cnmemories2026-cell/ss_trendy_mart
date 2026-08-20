import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, MessageSquare, Phone, MapPin, Calendar, Clock, Filter, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StatusBadge } from '../../components/StatusBadge';
import { getCustomerWhatsAppLink } from '../../utils/whatsapp';

export const AdminOrders = () => {
  const { orders, updateOrderStatus, isAdminLoggedIn } = useStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  React.useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  const statuses = [
    'All',
    'New Order',
    'Confirmed',
    'Payment Pending',
    'Payment Received',
    'Processing',
    'Ready',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            View all incoming customer orders, update delivery/payment statuses, and launch direct WhatsApp chats with buyers.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by Order ID, Name, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 custom-scrollbar">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedStatus === st ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Cards */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => {
            const isExpanded = expandedOrderId === order.id;
            const whatsappLink = getCustomerWhatsAppLink(
              order.customerWhatsApp || order.customerPhone,
              `Hi ${order.customerName}, regarding your Order #${order.id} at SS Trendy Mart:`
            );

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all"
              >
                {/* Main Summary Bar */}
                <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                  
                  {/* Order ID & Customer */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-brand-600">#{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="text-sm font-bold text-gray-900">{order.customerName}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-brand-500" /> {order.customerPhone}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Status Dropdown & Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Status Update Dropdown */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Update Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-brand-500 cursor-pointer"
                      >
                        {statuses.filter(s => s !== 'All').map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* WhatsApp Direct Contact Button */}
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors mt-4 md:mt-0"
                    >
                      <MessageSquare className="w-4 h-4" /> Direct WhatsApp
                    </a>

                    {/* Expand Details Toggle */}
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors mt-4 md:mt-0"
                      title="View Details"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-6">
                    {/* Delivery Address & Notes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-4 rounded-2xl border border-gray-100">
                      <div>
                        <span className="text-gray-400 font-bold uppercase block mb-1">Delivery Address</span>
                        <p className="text-gray-900 leading-relaxed font-medium">{order.deliveryAddress}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold uppercase block mb-1">Customer Notes</span>
                        <p className="text-gray-900 leading-relaxed font-medium">{order.notes || 'No special notes provided'}</p>
                      </div>
                    </div>

                    {/* Purchased Products List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Ordered Products</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.products.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl text-xs">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-50 border" />
                              <div>
                                <h5 className="font-extrabold text-gray-900 text-sm">{item.name}</h5>
                                <div className="flex items-center gap-2 text-gray-500">
                                  <span>Qty: {item.quantity}</span>
                                  {item.selectedColor && (
                                    <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                                      🎨 {item.selectedColor}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="font-black text-gray-900 text-sm">
                              {item.price && item.price > 0 ? `₹${item.price * item.quantity}` : 'Contact us'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Summary */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 text-sm">
                      <span className="font-bold text-gray-700">Total Order Value:</span>
                      <span className="text-xl font-black text-brand-600">
                        {order.total > 0 ? `₹${order.total.toLocaleString('en-IN')}` : 'Price – Contact us'}
                      </span>
                    </div>

                  </div>
                )}

              </div>
            );
          })
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">No Orders Found</h3>
            <p className="text-xs text-gray-500">No orders match your filter criteria.</p>
          </div>
        )}
      </div>

    </div>
  );
};
