import React from 'react';
import { Phone, MessageSquare, MapPin, Clock, ShieldCheck, Mail, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-extrabold text-brand-600 uppercase tracking-widest">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Contact SS Trendy Mart
        </h1>
        <p className="text-sm text-gray-600">
          Have questions about our PDF product catalog, pricing, or orders? We are here to assist you personally on WhatsApp!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Info Cards */}
        <div className="space-y-6 lg:col-span-1">
          {/* WhatsApp Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-200 uppercase">Primary WhatsApp</span>
              <h3 className="text-2xl font-black text-white mt-1">{settings.ownerPhone}</h3>
              <p className="text-xs text-emerald-100 mt-2">
                Click below to start an instant WhatsApp chat with our store manager.
              </p>
            </div>
            <a
              href={`https://wa.me/91${settings.ownerPhone}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold text-xs rounded-xl shadow-md transition-all w-full justify-center"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" /> Start WhatsApp Chat
            </a>
          </div>

          {/* Call Us Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Phone Support</h4>
              <p className="text-sm font-extrabold text-gray-800 mt-1">{settings.ownerPhone}</p>
              <p className="text-xs text-gray-500 mt-1">Mon - Sat: 9:00 AM - 8:00 PM</p>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Store Address</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                SS Trendy Mart Headquarters,<br />Tamil Nadu, India.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Message Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-extrabold text-gray-900">Send an Inquiry</h2>
            <p className="text-xs text-gray-500 mt-1">
              Fill out the message below to launch a pre-formatted WhatsApp chat with the owner.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = e.target.name.value;
              const msg = e.target.message.value;
              const text = `Hi SS Trendy Mart, my name is ${name}. ${msg}`;
              window.open(`https://wa.me/91${settings.ownerPhone}?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter your name"
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Your Message / Product Inquiry</label>
              <textarea
                name="message"
                required
                rows="5"
                placeholder="Ask about product availability, prices, or wholesale orders..."
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-500/25 transition-all"
            >
              <Send className="w-4 h-4" /> Send via WhatsApp
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
