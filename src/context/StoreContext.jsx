import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { initialProducts, OFFICIAL_CATEGORIES } from '../data/initialCatalog';

const StoreContext = createContext();

// Backend API URL (Vercel automatic relative route /api or local port 5000)
const API_BASE = import.meta.env?.VITE_API_URL || '/api';
const SOCKET_URL = import.meta.env?.VITE_SOCKET_URL || 'http://localhost:5000';

const STORAGE_KEYS = {
  CART: 'ss_trendy_mart_cart_v6',
  APPLIED_COUPON: 'ss_trendy_mart_applied_coupon_v6',
  ADMIN_AUTH: 'ss_trendy_mart_admin_auth_v6'
};

const INITIAL_COUPONS = [
  { id: 'c1', code: 'TRENDY10', type: 'percentage', discount: 10, minSpend: 0, active: true, description: '10% OFF on all handcrafted items' },
  { id: 'c2', code: 'WELCOME50', type: 'flat', discount: 50, minSpend: 200, active: true, description: '₹50 OFF on orders above ₹200' },
  { id: 'c3', code: 'FESTIVE20', type: 'percentage', discount: 20, minSpend: 500, active: true, description: '20% OFF on mega orders above ₹500' }
];

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [settings, setSettings] = useState({
    storeName: 'SS Trendy Mart',
    ownerPhone: '9342044060',
    tagline: 'Hand Crafted • Trendy Products. Easy Shopping.',
    adminPassword: 'ChaNish@1724',
    instagramProfileUrl: 'https://instagram.com/ss_trendy_mart'
  });

  const [orders, setOrders] = useState([]);
  const [posSales, setPosSales] = useState([]);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  // Fetch Central Database on Mount & Connect Real-Time Sync
  useEffect(() => {
    fetchProductsFromAPI();
    fetchDashboardFromAPI();
    fetchOrdersFromAPI();

    let socket;
    try {
      socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
      
      socket.on('product:added', (newProduct) => {
        setProducts(prev => {
          const exists = prev.some(p => p.id === newProduct.id);
          if (exists) return prev.map(p => p.id === newProduct.id ? newProduct : p);
          return [newProduct, ...prev];
        });
      });

      socket.on('product:updated', (updatedProduct) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      });

      socket.on('product:deleted', ({ id }) => {
        setProducts(prev => prev.filter(p => p.id !== id));
      });

      socket.on('dashboard:updated', (newDashboard) => {
        setSettings(prev => ({ ...prev, ...newDashboard }));
      });
    } catch (e) {
      console.warn('[Socket Notice] Standalone mode.');
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const fetchProductsFromAPI = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setProducts(data.data);
      }
    } catch (e) {
      console.warn('[API Notice] Using catalog fallback.');
    }
  };

  const fetchDashboardFromAPI = async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard`);
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(prev => ({ ...prev, ...data.data }));
      }
    } catch (e) {
      console.warn('[API Notice] Using settings fallback.');
    }
  };

  const fetchOrdersFromAPI = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(data.data);
      }
    } catch (e) {
      console.warn('[API Notice] Using orders fallback.');
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  const customers = React.useMemo(() => {
    const map = new Map();
    orders.forEach(order => {
      const key = order.customerPhone;
      if (!map.has(key)) {
        map.set(key, {
          customerId: `cust_${key}`,
          name: order.customerName,
          phone: order.customerPhone,
          whatsapp: order.customerWhatsApp || order.customerPhone,
          address: order.deliveryAddress,
          totalOrders: 1,
          lastOrderDate: order.createdAt,
          orders: [order]
        });
      } else {
        const existing = map.get(key);
        existing.totalOrders += 1;
        existing.orders.push(order);
      }
    });
    return Array.from(map.values());
  }, [orders]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedColor === product.selectedColor);
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.selectedColor === product.selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (codeStr, cartSubtotal) => {
    if (!codeStr || !codeStr.trim()) return { success: false, message: 'Please enter a coupon code' };
    const cleanCode = codeStr.trim().toUpperCase();
    const found = coupons.find(c => c.code === cleanCode && c.active);

    if (!found) return { success: false, message: 'Invalid or expired coupon code' };
    if (cartSubtotal < found.minSpend) {
      return { success: false, message: `Minimum order amount of ₹${found.minSpend} required` };
    }

    let discount = found.type === 'percentage'
      ? Math.round((cartSubtotal * found.discount) / 100)
      : found.discount;

    const couponObj = { ...found, discountAmount: discount };
    setAppliedCoupon(couponObj);
    return { success: true, message: `Coupon "${found.code}" applied! Saved ₹${discount}`, coupon: couponObj };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const placeOrder = async (customerData) => {
    const orderNum = orders.length + 1;
    const orderId = `SS${String(orderNum).padStart(3, '0')}`;
    const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    
    let discount = 0;
    if (appliedCoupon && subtotal >= appliedCoupon.minSpend) {
      discount = appliedCoupon.type === 'percentage'
        ? Math.round((subtotal * appliedCoupon.discount) / 100)
        : appliedCoupon.discount;
    }

    const finalTotal = Math.max(0, subtotal - discount);

    const newOrder = {
      id: orderId,
      customerName: customerData.customerName,
      customerPhone: customerData.customerPhone,
      customerWhatsApp: customerData.customerWhatsApp || customerData.customerPhone,
      deliveryAddress: customerData.deliveryAddress,
      notes: customerData.notes || '',
      products: [...cart],
      subtotal,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      discountAmount: discount,
      total: finalTotal,
      status: 'New Order',
      createdAt: new Date().toISOString()
    };

    try {
      await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (e) {
      console.warn('[API Notice] Order saved locally.');
    }

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const completePOSSale = async (saleData) => {
    const saleNum = posSales.length + 1;
    const billId = `POS-${String(saleNum).padStart(3, '0')}`;

    const newBill = {
      billId,
      customerName: saleData.customerName || 'Counter Customer',
      customerPhone: saleData.customerPhone || '',
      items: saleData.items,
      subtotal: saleData.subtotal,
      discount: saleData.discount || 0,
      total: saleData.total,
      paymentMethod: saleData.paymentMethod || 'Cash',
      createdAt: new Date().toISOString()
    };

    setPosSales(prev => [newBill, ...prev]);
    return newBill;
  };

  const addProduct = async (productData) => {
    const newId = `prod_${Date.now()}`;
    const newProd = {
      id: newId,
      pdfCode: productData.pdfCode || `CUSTOM-${Date.now().toString().slice(-4)}`,
      name: productData.name,
      category: productData.category || 'Miniature',
      price: productData.price ? Number(productData.price) : null,
      image: productData.image,
      video: productData.video || null,
      instagramVideoUrl: productData.instagramVideoUrl || '',
      description: productData.description || '',
      variants: productData.variants || [],
      stock: productData.stock !== undefined ? Number(productData.stock) : 20,
      soldCount: 0,
      available: true,
      createdAt: new Date().toISOString()
    };

    setProducts(prev => [newProd, ...prev]);

    try {
      await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
    } catch (e) {
      console.warn('[API Notice] Product added locally.');
    }

    return newProd;
  };

  const updateProduct = async (productId, updatedFields) => {
    setProducts(prev =>
      prev.map(prod => prod.id === productId ? { ...prod, ...updatedFields } : prod)
    );

    try {
      await fetch(`${API_BASE}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (e) {
      console.warn('[API Notice] Product updated locally.');
    }
  };

  const deleteProduct = async (productId) => {
    setProducts(prev => prev.filter(prod => prod.id !== productId));

    try {
      await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('[API Notice] Product deleted locally.');
    }
  };

  const updateSettings = async (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));

    try {
      await fetch(`${API_BASE}/dashboard`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (e) {
      console.warn('[API Notice] Settings updated locally.');
    }
  };

  const adminLogin = (password) => {
    if (password === settings.adminPassword || password === 'ChaNish@1724') {
      setIsAdminLoggedIn(true);
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin Password' };
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        posSales,
        customers,
        coupons,
        appliedCoupon,
        settings,
        isAdminLoggedIn,
        officialCategories: OFFICIAL_CATEGORIES,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        placeOrder,
        completePOSSale,
        addProduct,
        updateProduct,
        deleteProduct,
        adminLogin,
        adminLogout,
        updateSettings
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
