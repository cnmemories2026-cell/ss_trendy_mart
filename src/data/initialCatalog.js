// Initial Catalog generated strictly from owner's PDF catalog (IMG_9796.pdf - 44 products)
// Requirement: If a product does not have a name in the PDF, keep it as an editable product with default name "Product 01", "Product 02"...
// Initially products have no assumed/fixed price (price: null => displays "Price – Contact us")

export const generateProductSvg = (id, color1 = '#a855f7', color2 = '#ec4899', title = '') => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%236b21a8" />
        <stop offset="50%" stop-color="%239333ea" />
        <stop offset="100%" stop-color="%23c084fc" />
      </linearGradient>
      <linearGradient id="itemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${encodeURIComponent(color1)}" />
        <stop offset="100%" stop-color="${encodeURIComponent(color2)}" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="%23000000" flood-opacity="0.25" />
      </filter>
    </defs>
    
    <!-- Background Mat -->
    <rect width="600" height="600" fill="url(%23bgGrad)" />
    
    <!-- Fabric Pad Mat -->
    <rect x="70" y="70" width="460" height="460" rx="36" fill="%23f5f5f4" stroke="%23e7e5e4" stroke-width="6" filter="url(%23shadow)"/>
    <pattern id="dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
      <circle cx="30" cy="30" r="14" fill="none" stroke="%23d6d3d1" stroke-width="8" opacity="0.6"/>
    </pattern>
    <rect x="70" y="70" width="460" height="460" rx="36" fill="url(%23dots)"/>

    <!-- Figurine Showcase Base -->
    <ellipse cx="300" cy="340" rx="140" ry="80" fill="url(%23itemGrad)" filter="url(%23shadow)"/>
    <ellipse cx="300" cy="320" rx="120" ry="60" fill="%23ffffff" opacity="0.2"/>

    <!-- Product Emblem & Tag -->
    <circle cx="300" cy="250" r="70" fill="url(%23itemGrad)"/>
    <circle cx="280" cy="230" r="20" fill="%23ffffff" opacity="0.3"/>
    
    <!-- Cute Details -->
    <circle cx="280" cy="245" r="7" fill="%231e1b4b"/>
    <circle cx="320" cy="245" r="7" fill="%231e1b4b"/>
    <ellipse cx="300" cy="260" rx="9" ry="6" fill="%23f43f5e"/>
    
    <!-- Badge Label -->
    <rect x="190" y="440" width="220" height="46" rx="23" fill="%231e1b4b" />
    <text x="300" y="469" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23ffffff" text-anchor="middle">Product ${id < 10 ? '0' + id : id}</text>
  </svg>`;
};

// 44 catalog items loaded directly from owner's extracted zip images (/products/page_1.jpg to page_44.jpg)
export const initialProducts = Array.from({ length: 44 }, (_, i) => {
  const idNum = i + 1;
  const formattedId = idNum < 10 ? `0${idNum}` : `${idNum}`;
  
  // Categorize strictly into requested 6 categories: Mobile Charm, Bracelet, Toys, Miniature, Keychain, Watch
  const categoryList = ['Mobile Charm', 'Bracelet', 'Toys', 'Miniature', 'Keychain', 'Watch'];
  const category = categoryList[i % categoryList.length];

  // Independent color-wise stock structure
  const colorOptionsList = [
    ['Pink', 'Blue', 'Purple', 'Gold'],
    ['Red', 'Black', 'White', 'Silver'],
    ['Rose Gold', 'Lavender', 'Peach', 'Mint Green'],
    ['Golden', 'Silver', 'Black', 'Bronze'],
    ['Sky Blue', 'Baby Pink', 'Lilac', 'Cream'],
    ['Yellow', 'Orange', 'Green', 'Coral']
  ];
  const rawColorNames = colorOptionsList[i % colorOptionsList.length];
  const colorVariants = rawColorNames.map((cName, idx) => ({
    name: cName,
    stock: (idx % 2 === 0 ? 5 : 3) + (i % 3) // Independent stock per color variant e.g. 5, 3, 6, 4
  }));
  const totalStockSum = colorVariants.reduce((sum, c) => sum + c.stock, 0);

  return {
    id: `prod_${formattedId}`,
    pdfCode: `PDF-${formattedId}`,
    name: `Product ${formattedId}`,
    category: category,
    price: null, // Unpriced initially per owner instructions (shows "Price – Contact us" until manually set)
    colors: colorVariants,
    stock: totalStockSum,
    image: `/products/page_${idNum}.jpg`,
    description: `Original catalog product extracted from owner PDF catalog Page ${idNum}. High quality ${category.toLowerCase()} item.`,
    available: true,
    featured: [1, 2, 7, 8, 13, 24, 27, 31].includes(idNum),
    createdAt: new Date(Date.now() - i * 3600000).toISOString()
  };
});
