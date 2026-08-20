import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, Clock, CheckCircle2, TrendingUp, Package, ShieldCheck, LogOut, ArrowRight, MessageSquare, AlertCircle, Calculator } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StatusBadge } from '../../components/StatusBadge';

export const AdminDashboard = () => {
  const { products, orders, posSales, customers, isAdminLoggedIn, adminLogout, settings } = useStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  // Calculate Metrics
  const totalCustomersCount = customers.length;
  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter(o => o.status === 'New Order').length;
  const pendingOrdersCount = orders.filter(o => ['Confirmed', 'Payment Pending', 'Processing', 'Ready', 'Shipped'].includes(o.status)).length;
  const completedOrdersCount = orders.filter(o => ['Delivered', 'Payment Received'].includes(o.status)).length;

  const websiteSalesSum = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const posSalesSum = posSales.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalSalesRevenue = websiteSalesSum + posSalesSum;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-gray-900 via-brand-950 to-purple-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-purple-200">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" /> Admin Control Center
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Store Dashboard</h1>
          <p className="text-xs text-purple-200">
            Managing <strong className="text-white">{settings.storeName}</strong> • Owner WhatsApp: {settings.ownerPhone}
          </p>
        </div>

        {/* Quick Nav & Logout */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/billing"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Calculator className="w-4 h-4" /> POS Billing Counter
          </Link>
          <Link
            to="/admin/products"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
          >
            Products ({products.length})
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Orders ({orders.length})
          </Link>
          <button
            onClick={() => {
              adminLogout();
              navigate('/admin/login');
            }}
            className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Customers</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{totalCustomersCount}</div>
          <p className="text-[10px] text-gray-400">Total Unique Buyers</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Total Orders</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{totalOrdersCount}</div>
          <p className="text-[10px] text-gray-400">Website Order Submissions</p>
        </div>

        {/* New Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">New Orders</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{newOrdersCount}</div>
          <p className="text-[10px] text-gray-400">Requires Review</p>
        </div>

        {/* POS Sales Count */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">POS Sales</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{posSales.length}</div>
          <p className="text-[10px] text-gray-400">Counter Bills Issued</p>
        </div>

        {/* Completed Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Completed</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600">{completedOrdersCount}</div>
          <p className="text-[10px] text-gray-400">Delivered Orders</p>
        </div>

        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Total Sales</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">
            ₹{totalSalesRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-gray-400">Website + POS Total Sum</p>
        </div>

      </div>

      {/* Admin Section Tabs & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-lg font-extrabold text-gray-900">Recent Customer Orders</h2>
            <Link to="/admin/orders" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
              View All Orders ({orders.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-extrabold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Products</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-black text-brand-600">#{order.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{order.customerName}</div>
                      <div className="text-[10px] text-gray-400">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-700">{order.products.length} Items</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {order.total > 0 ? `₹${order.total}` : 'Contact us'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/admin/orders"
                        className="px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg font-bold hover:bg-brand-100 transition-colors"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">Admin Quick Menu</h3>
            
            <div className="space-y-2 text-xs">
              <Link
                to="/admin/billing"
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold transition-all border border-emerald-100"
              >
                <span className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4 text-emerald-600" /> POS Counter & Billing
                </span>
                <span className="text-emerald-700">{posSales.length} Bills</span>
              </Link>

              <Link
                to="/admin/products"
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-brand-50 text-gray-800 hover:text-brand-700 font-bold transition-all border border-gray-100"
              >
                <span className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-brand-600" /> Product & Stock Management
                </span>
                <span className="text-gray-400">{products.length} Products</span>
              </Link>

              <Link
                to="/admin/orders"
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-brand-50 text-gray-800 hover:text-brand-700 font-bold transition-all border border-gray-100"
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-purple-600" /> Order Management
                </span>
                <span className="text-gray-400">{orders.length} Orders</span>
              </Link>

              <Link
                to="/admin/customers"
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-brand-50 text-gray-800 hover:text-brand-700 font-bold transition-all border border-gray-100"
              >
                <span className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-blue-600" /> Customer Database
                </span>
                <span className="text-gray-400">{customers.length} Buyers</span>
              </Link>

              <Link
                to="/admin/settings"
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-brand-50 text-gray-800 hover:text-brand-700 font-bold transition-all border border-gray-100"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Store & Instagram Settings
                </span>
                <span className="text-gray-400">Settings</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
