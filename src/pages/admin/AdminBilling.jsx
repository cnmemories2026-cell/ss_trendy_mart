import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Plus, Minus, Trash2, Printer, CheckCircle2, DollarSign, Calculator, Box, History, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

import { getNormalizedColors, getColorStock, getProductTotalStock } from '../../utils/stockUtils';

export const AdminBilling = () => {
  const { products, completePOSSale, posSales, isAdminLoggedIn } = useStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  
  // Completed receipt modal state
  const [completedBill, setCompletedBill] = useState(null);

  React.useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  // Filter products for POS search
  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.pdfCode && p.pdfCode.toLowerCase().includes(q));
  });

  // Add product to POS bill (with Colour support)
  const handleAddToBill = (product, colorName = null) => {
    const normColors = getNormalizedColors(product);
    const itemColor = colorName || (normColors.length > 0 ? normColors.find(c => c.stock > 0)?.name || normColors[0].name : null);
    const availableStock = getColorStock(product, itemColor);

    if (availableStock <= 0) {
      alert(`${product.name}${itemColor ? ` (${itemColor})` : ''} is Out of Stock!`);
      return;
    }

    const cartItemId = itemColor ? `${product.id}-${itemColor}` : product.id;

    setBillItems(prev => {
      const existing = prev.find(item => (item.cartItemId || item.productId) === cartItemId);
      if (existing) {
        if (existing.quantity + 1 > availableStock) {
          alert(`Cannot add more. Available stock for ${itemColor || product.name} is ${availableStock}`);
          return prev;
        }
        return prev.map(item =>
          (item.cartItemId || item.productId) === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId: product.id, cartItemId, name: product.name, selectedColor: itemColor, price: product.price || 150, quantity: 1, image: product.image, stock: availableStock }];
    });
  };

  const updateItemQty = (cartItemId, quantity) => {
    if (quantity <= 0) {
      setBillItems(prev => prev.filter(item => (item.cartItemId || item.productId) !== cartItemId));
      return;
    }

    setBillItems(prev =>
      prev.map(item => {
        if ((item.cartItemId || item.productId) === cartItemId) {
          const liveProd = products.find(p => p.id === item.productId);
          const maxStock = liveProd ? getColorStock(liveProd, item.selectedColor) : (item.stock || 20);
          if (quantity > maxStock) {
            alert(`Maximum available stock for ${item.selectedColor || item.name} is ${maxStock}`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const subtotal = billItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = Math.max(0, subtotal - Number(discountAmount));

  const handleCompleteSale = () => {
    if (billItems.length === 0) {
      alert('Please add at least one product to the bill!');
      return;
    }

    const bill = completePOSSale({
      customerName: customerName || 'Counter Customer',
      customerPhone: customerPhone,
      items: billItems,
      subtotal: subtotal,
      discount: Number(discountAmount),
      total: grandTotal,
      paymentMethod: paymentMethod
    });

    setCompletedBill(bill);
    setBillItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscountAmount(0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Calculator className="w-8 h-8 text-brand-600" /> POS Billing & Counter System
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Generate instant bill receipts. Every completed sale automatically reduces stock in real time!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Product Search & Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search product by name or PDF code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredProducts.map(prod => {
              const currentStock = prod.stock !== undefined ? prod.stock : 20;
              const isOut = currentStock <= 0;

              return (
                <div
                  key={prod.id}
                  onClick={() => !isOut && handleAddToBill(prod)}
                  className={`bg-white p-3 rounded-2xl border border-gray-100 shadow-sm transition-all flex flex-col justify-between ${
                    isOut ? 'opacity-50 cursor-not-allowed' : 'hover:border-brand-500 hover:shadow-md cursor-pointer active:scale-95'
                  }`}
                >
                  <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-2 relative">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    <span className="absolute top-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {prod.pdfCode}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-gray-900 text-xs line-clamp-1">{prod.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-black text-brand-600 text-xs">₹{prod.price || 150}</span>
                      <span className={`text-[10px] font-bold ${currentStock > 5 ? 'text-gray-500' : currentStock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                        {currentStock} left
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Current POS Bill Cart */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-lg font-extrabold text-gray-900">Active Bill</h2>
            <span className="text-xs text-gray-400">{billItems.length} items</span>
          </div>

          {/* Customer Inputs */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Customer Name (Optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Customer Mobile (Optional)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          {/* Bill Items List */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            {billItems.length > 0 ? (
              billItems.map(item => {
                const itemKey = item.cartItemId || item.productId;
                return (
                  <div key={itemKey} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                    <div className="flex-1 pr-2">
                      <h5 className="font-bold text-gray-900 line-clamp-1">{item.name}</h5>
                      <div className="flex items-center gap-1.5 text-gray-500 text-[10px]">
                        <span>₹{item.price} each</span>
                        {item.selectedColor && (
                          <span className="font-bold text-purple-700 bg-purple-100 px-1 rounded">🎨 {item.selectedColor}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white rounded-lg border px-1">
                        <button onClick={() => updateItemQty(itemKey, item.quantity - 1)} className="p-1 hover:text-brand-600">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold">{item.quantity}</span>
                        <button onClick={() => updateItemQty(itemKey, item.quantity + 1)} className="p-1 hover:text-brand-600">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-extrabold text-gray-900 w-12 text-right">₹{item.price * item.quantity}</span>

                      <button onClick={() => updateItemQty(itemKey, 0)} className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-gray-400 text-xs">
                Click products on the left to add them to this bill.
              </div>
            )}
          </div>

          {/* Totals & Discounts */}
          <div className="space-y-3 pt-3 border-t border-gray-100 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-extrabold text-gray-900">₹{subtotal}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-600">Discount (₹):</span>
              <input
                type="number"
                min="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="w-24 px-2 py-1 text-right text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-600">Payment Method:</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="px-2 py-1 text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI Transfer</option>
                <option value="Card">Card</option>
                <option value="WhatsApp Manual">WhatsApp Manual</option>
              </select>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <span className="text-sm font-black text-gray-900">Final Total:</span>
              <span className="text-2xl font-black text-brand-600">₹{grandTotal}</span>
            </div>
          </div>

          {/* Complete Sale Button */}
          <button
            onClick={handleCompleteSale}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" /> Complete Sale & Print Bill
          </button>
        </div>

      </div>

      {/* Printable Receipt Modal */}
      {completedBill && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-fade-in print:shadow-none">
            
            <div className="flex items-center justify-between border-b pb-3 print:hidden">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Sale Completed & Stock Updated!
              </span>
              <button onClick={() => setCompletedBill(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Printable Content */}
            <div className="space-y-4 text-xs font-mono">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black tracking-wider">SS TRENDY MART</h3>
                <p className="text-[10px] text-gray-500">Official Sales Receipt</p>
                <p className="text-[10px] text-gray-500">Bill ID: #{completedBill.billId}</p>
                <p className="text-[10px] text-gray-500">{new Date(completedBill.createdAt).toLocaleString()}</p>
              </div>

              <div className="border-t border-b border-dashed py-2 space-y-1">
                <p>Customer: {completedBill.customerName}</p>
                {completedBill.customerPhone && <p>Phone: {completedBill.customerPhone}</p>}
                <p>Payment: {completedBill.paymentMethod}</p>
              </div>

              <div className="space-y-1">
                {completedBill.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed pt-2 space-y-1 text-right">
                <p>Subtotal: ₹{completedBill.subtotal}</p>
                {completedBill.discount > 0 && <p>Discount: -₹{completedBill.discount}</p>}
                <p className="text-sm font-black">TOTAL: ₹{completedBill.total}</p>
              </div>

              <div className="text-center pt-2 text-[10px] text-gray-400">
                Thank you for shopping at SS Trendy Mart!
              </div>
            </div>

            {/* Print & Close */}
            <div className="flex gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                <Printer className="w-4 h-4" /> Print Bill
              </button>
              <button
                onClick={() => setCompletedBill(null)}
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
