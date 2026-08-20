// Initial Catalog for SS Trendy Mart with Color Variant Stock Breakdown
// Categories: Mobile Charm, Bracelet, Toys, Miniature, Keychain, Watch

export const OFFICIAL_CATEGORIES = [
  'Mobile Charm',
  'Bracelet',
  'Toys',
  'Miniature',
  'Keychain',
  'Watch'
];

export const generateProductSvg = (id, color1 = '#5C3A21', color2 = '#D4A373', categoryName = 'Miniature') => {
  const num = id < 10 ? `0${id}` : `${id}`;
  
  let categoryIcon = '🎨';
  if (categoryName === 'Mobile Charm') categoryIcon = '📱';
  else if (categoryName === 'Bracelet') categoryIcon = '📿';
  else if (categoryName === 'Toys') categoryIcon = '🧸';
  else if (categoryName === 'Miniature') categoryIcon = '🎨';
  else if (categoryName === 'Keychain') categoryIcon = '🔑';
  else if (categoryName === 'Watch') categoryIcon = '⌚';

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="bgGrad${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23FDF8F2" />
        <stop offset="50%" stop-color="%23F5EBE1" />
        <stop offset="100%" stop-color="%23EADBC8" />
      </linearGradient>
      <linearGradient id="itemGrad${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${encodeURIComponent(color1)}" />
        <stop offset="100%" stop-color="${encodeURIComponent(color2)}" />
      </linearGradient>
      <filter id="shadow${id}" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="%235C3A21" flood-opacity="0.18" />
      </filter>
    </defs>
    
    <rect width="600" height="600" fill="url(%23bgGrad${id})" />
    <rect x="50" y="50" width="500" height="500" rx="40" fill="%23FFFDF9" stroke="%235C3A21" stroke-width="5" stroke-dasharray="10 8" filter="url(%23shadow${id})"/>
    <circle cx="300" cy="270" r="150" fill="%23F5EBE1" opacity="0.6"/>

    <ellipse cx="300" cy="360" rx="140" ry="60" fill="url(%23itemGrad${id})" filter="url(%23shadow${id})"/>
    <ellipse cx="300" cy="345" rx="120" ry="45" fill="%23FFFFFF" opacity="0.3"/>

    <circle cx="300" cy="240" r="85" fill="url(%23itemGrad${id})" filter="url(%23shadow${id})"/>
    <circle cx="280" cy="215" r="22" fill="%23FFFFFF" opacity="0.25"/>
    
    <text x="300" y="260" font-family="sans-serif" font-size="65" text-anchor="middle">${categoryIcon}</text>
    
    <path d="M 180 430 Q 300 420 420 430 L 400 475 Q 300 465 200 475 Z" fill="%235C3A21" />
    <text x="300" y="458" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="%23FDF8F2" text-anchor="middle">Product ${num}</text>
  </svg>`;
};

// Initial PDF catalog items (44 products + updated screenshot items with color variant stock)
export const initialProducts = [
  // Screenshot Products
  {
    id: 'prod_39',
    pdfCode: 'PDF-39',
    name: 'dolphin',
    category: 'Miniature',
    price: 25,
    variants: [
      { color: 'green', qty: 3 },
      { color: 'purple', qty: 2 },
      { color: 'Peach', qty: 2 },
      { color: 'blue', qty: 1 },
      { color: 'orange', qty: 3 },
      { color: 'yellow', qty: 3 },
      { color: 'white', qty: 2 }
    ],
    stock: 16,
    soldCount: 0,
    image: generateProductSvg(39, '#5C3A21', '#D4A373', 'Miniature'),
    description: 'Miniature translucent dolphin craft figures in multiple pastel colors.',
    available: true
  },
  {
    id: 'prod_40',
    pdfCode: 'PDF-40',
    name: 'sleeping panda(radian)',
    category: 'Miniature',
    price: 40,
    variants: [
      { color: 'white', qty: 1 },
      { color: 'yellow', qty: 1 }
    ],
    stock: 2,
    soldCount: 0,
    image: generateProductSvg(40, '#3D2314', '#C49A6C', 'Miniature'),
    description: 'Cute sleeping panda figurine with radian finish.',
    available: true
  },
  {
    id: 'prod_41',
    pdfCode: 'PDF-41',
    name: 'panda (radian)',
    category: 'Toys',
    price: 35,
    variants: [
      { color: 'Blue', qty: 2 },
      { color: 'Pink', qty: 2 },
      { color: 'green', qty: 3 },
      { color: 'yellow', qty: 4 },
      { color: 'purple', qty: 3 },
      { color: 'peach', qty: 2 }
    ],
    stock: 16,
    soldCount: 0,
    image: generateProductSvg(41, '#8C5221', '#E0A96D', 'Toys'),
    description: 'Adorable panda figures holding bamboo with radian glow.',
    available: true
  },
  {
    id: 'prod_42',
    pdfCode: 'PDF-42',
    name: 'mini dogs (radian)',
    category: 'Toys',
    price: 20,
    variants: [
      { color: 'Yellow', qty: 2 },
      { color: 'Orange', qty: 1 },
      { color: 'Green', qty: 2 },
      { color: 'light green', qty: 3 },
      { color: 'purple', qty: 2 },
      { color: 'blue', qty: 1 },
      { color: 'white', qty: 1 },
      { color: 'pink', qty: 1 }
    ],
    stock: 13,
    soldCount: 0,
    image: generateProductSvg(42, '#6B4423', '#D9B48F', 'Toys'),
    description: 'Cute mini pomeranian & bulldog puppy figurines in colorful variants.',
    available: true
  },
  {
    id: 'prod_43',
    pdfCode: 'PDF-43',
    name: 'chubby rabbits(radian)',
    category: 'Mobile Charm',
    price: 25,
    variants: [
      { color: 'Pink', qty: 1 },
      { color: 'Blue', qty: 1 },
      { color: 'green', qty: 3 },
      { color: 'orange', qty: 3 },
      { color: 'purple', qty: 2 },
      { color: 'peach', qty: 1 }
    ],
    stock: 11,
    soldCount: 0,
    image: generateProductSvg(43, '#4A2E1B', '#B8860B', 'Mobile Charm'),
    description: 'Chubby translucent jelly bunny figurines holding carrots.',
    available: true
  },
  {
    id: 'prod_44',
    pdfCode: 'PDF-44',
    name: 'fish (radian)',
    category: 'Keychain',
    price: 25,
    variants: [
      { color: 'pink', qty: 4 },
      { color: 'blue', qty: 2 },
      { color: 'light purple', qty: 3 },
      { color: 'green', qty: 2 },
      { color: 'yellow', qty: 3 },
      { color: 'orange', qty: 3 }
    ],
    stock: 17,
    soldCount: 0,
    image: generateProductSvg(44, '#7A4B29', '#E6C280', 'Keychain'),
    description: 'Colorful aquatic fish figurines with crystal sheen.',
    available: true
  },
  {
    id: 'prod_46',
    pdfCode: 'PDF-46',
    name: 'Car dashboard',
    category: 'Watch',
    price: 130,
    variants: [
      { color: 'clear', qty: 2 },
      { color: 'frosted', qty: 2 }
    ],
    stock: 4,
    soldCount: 0,
    image: generateProductSvg(46, '#5C3A21', '#D4A373', 'Watch'),
    description: 'Car dashboard miniature decor accessory set.',
    available: true
  },

  // Remaining catalog items (Product 01 to Product 38)
  ...Array.from({ length: 38 }, (_, i) => {
    const idNum = i + 1;
    const formattedId = idNum < 10 ? `0${idNum}` : `${idNum}`;
    const categoryIndex = i % OFFICIAL_CATEGORIES.length;
    const category = OFFICIAL_CATEGORIES[categoryIndex];

    const colors = [
      ['#5C3A21', '#D4A373'],
      ['#8C5221', '#E0A96D'],
      ['#3D2314', '#C49A6C'],
      ['#6B4423', '#D9B48F'],
      ['#4A2E1B', '#B8860B'],
      ['#7A4B29', '#E6C280']
    ];
    const colorPair = colors[i % colors.length];

    return {
      id: `prod_${formattedId}`,
      pdfCode: `PDF-${formattedId}`,
      name: `Product ${formattedId}`,
      category: category,
      price: 150 + (i % 8) * 40,
      variants: [
        { color: 'pink', qty: 5 },
        { color: 'blue', qty: 5 },
        { color: 'yellow', qty: 5 },
        { color: 'green', qty: 5 }
      ],
      stock: 20,
      soldCount: 0,
      image: generateProductSvg(idNum, colorPair[0], colorPair[1], category),
      video: null,
      instagramVideoUrl: '',
      description: `Official ${category} item from SS Trendy Mart catalog (Page ${idNum}). Hand crafted design.`,
      available: true,
      featured: [1, 2, 5, 8, 12, 18, 24, 30].includes(idNum),
      createdAt: new Date(Date.now() - i * 3600000).toISOString()
    };
  })
];
