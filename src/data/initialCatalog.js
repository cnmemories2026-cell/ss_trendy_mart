// Initial Catalog for SS Trendy Mart with Extracted Product Images & Color Variant Stock Breakdown
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
    <rect width="600" height="600" fill="%23FDF8F2" />
    <rect x="50" y="50" width="500" height="500" rx="40" fill="%23FFFDF9" stroke="%235C3A21" stroke-width="5" stroke-dasharray="10 8"/>
    <circle cx="300" cy="270" r="150" fill="%23F5EBE1" opacity="0.6"/>
    <ellipse cx="300" cy="360" rx="140" ry="60" fill="%235C3A21" />
    <circle cx="300" cy="240" r="85" fill="%23D4A373" />
    <text x="300" y="260" font-family="sans-serif" font-size="65" text-anchor="middle">${categoryIcon}</text>
    <path d="M 180 430 Q 300 420 420 430 L 400 475 Q 300 465 200 475 Z" fill="%235C3A21" />
    <text x="300" y="458" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="%23FDF8F2" text-anchor="middle">Product ${num}</text>
  </svg>`;
};

// Initial Catalog Items mapped to extracted image files (page_1.jpg to page_80.jpg)
export const initialProducts = [
  // Screenshot Items
  {
    id: 'prod_39',
    pdfCode: 'PDF-39',
    name: 'dolphin',
    category: 'Miniature',
    price: 25,
    variants: [
      { color: 'green', qty: 3 },
      { color: 'purple', qty: 2 },
      { color: 'peach', qty: 2 },
      { color: 'blue', qty: 1 },
      { color: 'orange', qty: 3 },
      { color: 'yellow', qty: 3 },
      { color: 'white', qty: 2 }
    ],
    stock: 16,
    soldCount: 0,
    image: '/products/page_39.jpg',
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
    image: '/products/page_40.jpg',
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
    image: '/products/page_41.jpg',
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
    image: '/products/page_42.jpg',
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
    image: '/products/page_43.jpg',
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
    image: '/products/page_44.jpg',
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
    image: '/products/page_46.jpg',
    description: 'Car dashboard miniature decor accessory set.',
    available: true
  },

  // 80 Extracted PDF Items mapped directly to extracted image paths
  ...Array.from({ length: 80 }, (_, i) => {
    const idNum = i + 1;
    const formattedId = idNum < 10 ? `0${idNum}` : `${idNum}`;
    const categoryIndex = i % OFFICIAL_CATEGORIES.length;
    const category = OFFICIAL_CATEGORIES[categoryIndex];

    return {
      id: `prod_page_${formattedId}`,
      pdfCode: `PDF-${formattedId}`,
      name: `Catalog Product ${formattedId}`,
      category: category,
      price: 120 + (i % 10) * 35,
      variants: [
        { color: 'pink', qty: 4 },
        { color: 'blue', qty: 4 },
        { color: 'yellow', qty: 4 },
        { color: 'green', qty: 4 }
      ],
      stock: 16,
      soldCount: 0,
      image: `/products/page_${idNum}.jpg`,
      video: null,
      instagramVideoUrl: '',
      description: `Official ${category} item from SS Trendy Mart catalog (Page ${idNum}). Hand crafted design.`,
      available: true,
      featured: [1, 3, 5, 8, 12, 18, 24, 30, 45, 60].includes(idNum),
      createdAt: new Date(Date.now() - i * 3600000).toISOString()
    };
  })
];
