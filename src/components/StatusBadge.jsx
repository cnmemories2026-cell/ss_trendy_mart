import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStatusStyle = (st) => {
    switch (st) {
      case 'New Order':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Confirmed':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Payment Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Payment Received':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Ready':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Shipped':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status}
    </span>
  );
};
