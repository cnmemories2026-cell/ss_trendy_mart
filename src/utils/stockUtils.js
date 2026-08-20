/**
 * Color-Wise Product Stock Utilities for SS Trendy Mart
 */

/**
 * Normalizes color options for a product.
 * Returns array of objects: [ { name: 'Green', stock: 2 }, { name: 'Blue', stock: 3 } ]
 */
export const getNormalizedColors = (product) => {
  if (!product || !product.colors || !Array.isArray(product.colors) || product.colors.length === 0) {
    return [];
  }
  return product.colors.map(c => {
    if (typeof c === 'string') {
      return { name: c, stock: product.stock !== undefined ? Number(product.stock) : 20 };
    }
    return {
      name: c && c.name ? String(c.name).trim() : '',
      stock: c && c.stock !== undefined && c.stock !== null ? Number(c.stock) : 0
    };
  }).filter(c => c.name.length > 0);
};

/**
 * Returns total stock of a product across all colors (or main product stock if no colors).
 */
export const getProductTotalStock = (product) => {
  if (!product) return 0;
  const normColors = getNormalizedColors(product);
  if (normColors.length > 0) {
    return normColors.reduce((sum, c) => sum + (Number(c.stock) || 0), 0);
  }
  return product.stock !== undefined ? Number(product.stock) : 0;
};

/**
 * Returns available stock for a specific color variant of a product.
 */
export const getColorStock = (product, colorName) => {
  if (!product) return 0;
  const normColors = getNormalizedColors(product);
  if (normColors.length > 0) {
    if (!colorName) return 0;
    const found = normColors.find(c => c.name === colorName);
    return found ? Number(found.stock) : 0;
  }
  return product.stock !== undefined ? Number(product.stock) : 0;
};
