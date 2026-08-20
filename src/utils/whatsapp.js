// Owner WhatsApp Number: 9342044060
export const OWNER_WHATSAPP_NUMBER = '9342044060';

/**
 * Generates formatted WhatsApp order notification string
 */
export const formatOrderWhatsAppMessage = (order) => {
  const itemsText = order.products.map((item, index) => {
    const priceStr = item.price ? `₹${item.price}` : 'Price - Contact us';
    const colorStr = item.selectedColor ? ` [Color: ${item.selectedColor}]` : '';
    return `${index + 1}. ${item.name}${colorStr} – Qty ${item.quantity} (${priceStr})`;
  }).join('\n');

  const discountText = order.couponCode
    ? `\n*Applied Coupon:* ${order.couponCode} (-₹${order.discountAmount})`
    : '';

  const totalText = order.total > 0 ? `₹${order.total.toLocaleString('en-IN')}` : 'To be quoted by owner';

  return `*NEW ORDER – SS TRENDY MART*

*Order ID:* #${order.id}
*Date:* ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}

*Customer Name:* ${order.customerName}
*Phone:* ${order.customerPhone}
*WhatsApp:* ${order.customerWhatsApp || order.customerPhone}
*Address:* ${order.deliveryAddress}
${order.notes ? `*Notes:* ${order.notes}\n` : ''}
*Ordered Products:*
${itemsText}${discountText}

*Total Amount:* ${totalText}
*Status:* ${order.status || 'New Order'}

Thank you for choosing SS Trendy Mart!`;
};

/**
 * Creates direct wa.me link with encoded message for owner
 */
export const getOwnerWhatsAppLink = (order) => {
  const message = formatOrderWhatsAppMessage(order);
  const cleanPhone = OWNER_WHATSAPP_NUMBER.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
};

/**
 * Creates direct wa.me link for admin to contact customer
 */
export const getCustomerWhatsAppLink = (customerPhone, message = '') => {
  const cleanPhone = customerPhone.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedMsg = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${phoneWithCountry}${encodedMsg}`;
};
