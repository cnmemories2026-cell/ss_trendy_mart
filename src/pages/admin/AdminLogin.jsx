import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Sparkles, Phone } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const LOGO_SRC = "file:///C:/Users/chand/.gemini/antigravity/brain/a34f9639-09bb-4036-8430-167eb5d2a829/.user_uploaded/media_1787203872270.jpg";

export const AdminLogin = () => {
  const { adminLogin, isAdminLoggedIn, settings } = useStore();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/admin/dashboard');
    }
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = adminLogin(password);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Invalid Admin Password');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#FFFDF9] rounded-3xl p-8 sm:p-10 border border-brand-200 shadow-2xl space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <img
            src={LOGO_SRC}
            alt="SS Trendy Mart Logo"
            className="w-20 h-20 rounded-full object-contain mx-auto shadow-md border-2 border-brand-400 bg-[#FAF5EE]"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1 className="text-2xl font-black text-brand-900 tracking-tight font-serif">Admin Authentication</h1>
          <p className="text-xs text-brand-700">
            Authorized portal for SS Trendy Mart store owner (Phone: <strong>{settings.ownerPhone}</strong>).
          </p>
        </div>

        {/* Password Notice */}
        <div className="p-3 bg-brand-50 text-brand-900 rounded-2xl text-xs border border-brand-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
          <span>Admin Phone: <strong>9342044060</strong> • Secure Credentials Configured</span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-1.5">
              Admin Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-brand-200 rounded-xl focus:border-brand-600 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-brand-400 absolute left-3.5 top-3.5" />
            </div>
            {error && (
              <p className="text-xs text-red-600 mt-1.5 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" /> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-600/25 active:scale-95 transition-all"
          >
            Access Admin Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
