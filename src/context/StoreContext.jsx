import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/initialCatalog';
import { getNormalizedColors, getProductTotalStock, getColorStock } from '../utils/stockUtils';

const StoreContext = createContext();

const STORAGE_KEYS = {
  PRODUCTS: 'ss_trendy_mart_products_v5',
  CART: 'ss_trendy_mart_cart_v5',
  ORDERS: 'ss_trendy_mart_orders_v5',
  COUPONS: 'ss_trendy_mart_coupons_v5',
  APPLIED_COUPON: 'ss_trendy_mart_applied_coupon_v5',
  POS_SALES: 'ss_trendy_mart_pos_sales_v5',
  ADMIN_AUTH: 'ss_trendy_mart_admin_auth_v5',
  SETTINGS: 'ss_trendy_mart_settings_v5',
  CATEGORIES: 'ss_trendy_mart_categories_v5'
};

const INITIAL_COUPONS = [
  { id: 'c1', code: 'TRENDY10', type: 'percentage', discount: 10, minSpend: 0, active: true, description: '10% OFF on all trendy orders' },
  { id: 'c2', code: 'WELCOME50', type: 'flat', discount: 50, minSpend: 200, active: true, description: '₹50 OFF on orders above ₹200' },
  { id: 'c3', code: 'FESTIVE20', type: 'percentage', discount: 20, minSpend: 500, active: true, description: '20% OFF on mega orders above ₹500' }
];

export const StoreProvider = ({ children }) => {
  const DEFAULT_CATEGORIES = ['Mobile Charm', 'Bracelet', 'Toys', 'Miniature', 'Keychain', 'Watch'];

  // Clean legacy local storage cache keys (v1, v2, v3, v4) to prevent old mobile browser cache conflicts
  useEffect(() => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('ss_trendy_mart_') && !key.endsWith('_v5')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error('Error clearing old cache keys:', e);
    }
  }, []);

  // 1. Products State (Loaded with extracted product images page_1.jpg to page_44.jpg)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p, idx) => {
            const pageNum = (idx % 44) + 1;
            const normColors = getNormalizedColors(p);
            const imgPath = (!p.image || p.image.includes('data:image/svg') || p.image.includes('placeholder'))
              ? `/products/page_${pageNum}.jpg`
              : p.image;
            return {
              ...p,
              image: imgPath,
              colors: normColors
            };
          });
        }
      } catch (e) { console.error(e); }
    }
    return initialProducts;
  });

  // Dynamic Store Categories State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  const addCategory = (name) => {
    if (!name || !name.trim()) return;
    const cleanName = name.trim();
    if (!categories.includes(cleanName)) {
      setCategories(prev => [...prev, cleanName]);
    }
  };

  const deleteCategory = (name) => {
    if (categories.length <= 1) {
      alert('Must keep at least one category!');
      return;
    }
    setCategories(prev => prev.filter(c => c !== name));
  };

  // 2. Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // 3. Coupons State
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_COUPONS;
  });

  // 4. Applied Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLIED_COUPON);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  // 5. Orders State (Website Orders)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // 6. POS Sales History State
  const [posSales, setPosSales] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POS_SALES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // 7. Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  // 8. Store Settings State (with Instagram profile link support)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      storeName: 'SS Trendy Mart',
      ownerPhone: '9342044060',
      tagline: 'Hand Crafted • Trendy Products. Easy Shopping.',
      adminPassword: 'ChaNish@1724',
      instagramProfileUrl: 'https://instagram.com/sstrendymart'
    };
  });

  // Persist State
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLIED_COUPON, JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POS_SALES, JSON.stringify(posSales));
  }, [posSales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Derived Customer Database
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
        if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.createdAt;
          existing.name = order.customerName;
          existing.address = order.deliveryAddress;
        }
      }
    });
    return Array.from(map.values());
  }, [orders]);

  // Cart Actions (with strict colour-wise stock validation)
  const addToCart = (product, quantity = 1, selectedColor = null) => {
    const normColors = getNormalizedColors(product);

    // Requirement 1 & 3: If product has colors, customer MUST select a color before adding to cart
    if (normColors.length > 0 && !selectedColor) {
      return { success: false, message: 'Please select a colour' };
    }

    const itemColor = selectedColor || null;
    const cartItemId = itemColor ? `${product.id}-${itemColor}` : product.id;
    const availableStock = getColorStock(product, itemColor);

    // Requirement 8: Out of stock color cannot be added to cart
    if (availableStock <= 0) {
      return { success: false, message: itemColor ? `Colour "${itemColor}" is Out of Stock!` : 'Product is Out of Stock!' };
    }

    // Requirement 4: Stock validation before adding to cart
    const existingCartItem = cart.find(item => (item.cartItemId || item.id) === cartItemId);
    const existingQty = existingCartItem ? existingCartItem.quantity : 0;
    const newQty = existingQty + quantity;

    if (newQty > availableStock) {
      return {
        success: false,
        message: itemColor
          ? `Cannot add more than ${availableStock} units available for ${itemColor}.`
          : `Cannot add more than ${availableStock} units available.`
      };
    }

    setCart(prev => {
      const existing = prev.find(item => (item.cartItemId || item.id) === cartItemId);
      if (existing) {
        return prev.map(item =>
          (item.cartItemId || item.id) === cartItemId
            ? { ...item, quantity: newQty, variantStock: availableStock }
            : item
        );
      }
      return [...prev, { ...product, cartItemId, selectedColor: itemColor, quantity: newQty, variantStock: availableStock }];
    });

    return { success: true, message: 'Item added to cart successfully!' };
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if ((item.cartItemId || item.id) === cartItemId) {
          // Re-validate against fresh product stock if product exists
          const liveProduct = products.find(p => p.id === item.id);
          const maxStock = liveProduct
            ? getColorStock(liveProduct, item.selectedColor)
            : (item.variantStock || 20);

          const cappedQty = Math.min(newQty, maxStock);
          return { ...item, quantity: cappedQty, variantStock: maxStock };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => (item.cartItemId || item.id) !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupon Actions
  const applyCoupon = (codeStr, cartSubtotal) => {
    if (!codeStr || !codeStr.trim()) {
      return { success: false, message: 'Please enter a coupon code' };
    }
    const cleanCode = codeStr.trim().toUpperCase();
    const found = coupons.find(c => c.code === cleanCode && c.active);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }

    if (cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `Minimum order amount of ₹${found.minSpend} required for coupon ${found.code}`
      };
    }

    let discount = 0;
    if (found.type === 'percentage') {
      discount = Math.round((cartSubtotal * found.discount) / 100);
    } else {
      discount = found.discount;
    }

    const couponObj = { ...found, discountAmount: discount };
    setAppliedCoupon(couponObj);
    return { success: true, message: `Coupon "${found.code}" applied successfully! Saved ₹${discount}`, coupon: couponObj };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addCoupon = (newCoupon) => {
    const couponItem = {
      id: `c_${Date.now()}`,
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type || 'percentage',
      discount: Number(newCoupon.discount),
      minSpend: Number(newCoupon.minSpend || 0),
      active: true,
      description: newCoupon.description || ''
    };
    setCoupons(prev => [couponItem, ...prev]);
  };

  const deleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const toggleCouponStatus = (id) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  // Website Order Actions (With Automatic Stock Reduction)
  const placeOrder = (customerData) => {
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
      subtotal: subtotal,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      discountAmount: discount,
      total: finalTotal,
      status: 'New Order',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Automatic Colour-Wise Stock Reduction
    setProducts(prevProducts =>
      prevProducts.map(prod => {
        const cartItemsForProd = cart.filter(c => c.id === prod.id);
        if (cartItemsForProd.length === 0) return prod;

        const normColors = getNormalizedColors(prod);
        let totalSoldForProd = 0;

        if (normColors.length > 0) {
          // Independent Color-wise stock deduction
          const updatedColors = normColors.map(colorObj => {
            const itemsInColor = cartItemsForProd.filter(c => c.selectedColor === colorObj.name);
            const soldQty = itemsInColor.reduce((sum, item) => sum + item.quantity, 0);
            totalSoldForProd += soldQty;
            const newColorStock = Math.max(0, (Number(colorObj.stock) || 0) - soldQty);
            return { name: colorObj.name, stock: newColorStock };
          });

          const newTotalStock = updatedColors.reduce((sum, c) => sum + c.stock, 0);
          return {
            ...prod,
            colors: updatedColors,
            stock: newTotalStock,
            soldCount: (prod.soldCount || 0) + totalSoldForProd,
            available: newTotalStock > 0
          };
        } else {
          // No color variants: general product stock reduction
          const soldQty = cartItemsForProd.reduce((sum, item) => sum + item.quantity, 0);
          const currentStock = prod.stock !== undefined ? prod.stock : 20;
          const newStock = Math.max(0, currentStock - soldQty);
          return {
            ...prod,
            stock: newStock,
            soldCount: (prod.soldCount || 0) + soldQty,
            available: newStock > 0
          };
        }
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  // POS Billing Sale Completion (With Automatic Colour-Wise Stock Reduction)
  const completePOSSale = (saleData) => {
    const saleNum = posSales.length + 1;
    const billId = `POS-${String(saleNum).padStart(3, '0')}`;

    const newBill = {
      billId: billId,
      customerName: saleData.customerName || 'Counter Customer',
      customerPhone: saleData.customerPhone || '',
      items: saleData.items,
      subtotal: saleData.subtotal,
      discount: saleData.discount || 0,
      total: saleData.total,
      paymentMethod: saleData.paymentMethod || 'Cash',
      createdAt: new Date().toISOString()
    };

    // Automatic Colour-Wise Stock Reduction for POS Sales
    setProducts(prevProducts =>
      prevProducts.map(prod => {
        const soldItemsForProd = saleData.items.filter(i => (i.productId || i.id) === prod.id);
        if (soldItemsForProd.length === 0) return prod;

        const normColors = getNormalizedColors(prod);
        let totalSoldForProd = 0;

        if (normColors.length > 0) {
          const updatedColors = normColors.map(colorObj => {
            const itemsInColor = soldItemsForProd.filter(i => (i.selectedColor || i.color) === colorObj.name);
            const soldQty = itemsInColor.reduce((sum, item) => sum + item.quantity, 0);
            totalSoldForProd += soldQty;
            const newColorStock = Math.max(0, (Number(colorObj.stock) || 0) - soldQty);
            return { name: colorObj.name, stock: newColorStock };
          });

          const newTotalStock = updatedColors.reduce((sum, c) => sum + c.stock, 0);
          return {
            ...prod,
            colors: updatedColors,
            stock: newTotalStock,
            soldCount: (prod.soldCount || 0) + totalSoldForProd,
            available: newTotalStock > 0
          };
        } else {
          const soldQty = soldItemsForProd.reduce((sum, item) => sum + item.quantity, 0);
          const currentStock = prod.stock !== undefined ? prod.stock : 20;
          const newStock = Math.max(0, currentStock - soldQty);
          return {
            ...prod,
            stock: newStock,
            soldCount: (prod.soldCount || 0) + soldQty,
            available: newStock > 0
          };
        }
      })
    );

    setPosSales(prev => [newBill, ...prev]);
    return newBill;
  };

  // Product Management Actions (Admin)
  const addProduct = (productData) => {
    const newId = `prod_${Date.now()}`;
    const newProd = {
      id: newId,
      pdfCode: productData.pdfCode || `CUSTOM-${Date.now().toString().slice(-4)}`,
      name: productData.name,
      category: productData.category || 'General',
      price: productData.price ? Number(productData.price) : null,
      colors: productData.colors || [],
      image: productData.image, // Base64 data URL or URL
      video: productData.video || null, // Base64 video data URL or URL
      instagramVideoUrl: productData.instagramVideoUrl || '',
      description: productData.description || '',
      stock: productData.stock !== undefined ? Number(productData.stock) : 20,
      soldCount: 0,
      available: productData.available !== undefined ? productData.available : true,
      featured: productData.featured || false,
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (productId, updatedFields) => {
    setProducts(prev =>
      prev.map(prod =>
        prod.id === productId ? { ...prod, ...updatedFields } : prod
      )
    );
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(prod => prod.id !== productId));
  };

  const clearAllProducts = () => {
    setProducts([]);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
  };

  const resetToDefaultCatalog = () => {
    setProducts(initialProducts.map(p => ({
      ...p,
      stock: 20,
      soldCount: 0,
      video: null,
      instagramVideoUrl: ''
    })));
  };

  // Admin Auth Actions
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

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
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
        categories,
        addCategory,
        deleteCategory,
        settings,
        isAdminLoggedIn,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,
        toggleCouponStatus,
        placeOrder,
        updateOrderStatus,
        completePOSSale,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        resetToDefaultCatalog,
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
