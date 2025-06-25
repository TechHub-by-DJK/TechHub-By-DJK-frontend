/**
 * Image Utilities
 * Helper functions for image handling and validation
 */

/**
 * Check if an image URL is too large to be stored safely
 * @param {string} imageUrl - Image URL to check
 * @returns {boolean} - True if the URL is safe to store
 */
export const isImageUrlSafe = (imageUrl) => {
  // Check URL length (MySQL TEXT field can store ~65KB)
  // Base64 images can be very large, so we limit them
  const MAX_URL_LENGTH = 50000; // 50KB to be safe
  
  if (!imageUrl || typeof imageUrl !== 'string') {
    return true; // Empty or invalid URLs are safe
  }
  
  return imageUrl.length <= MAX_URL_LENGTH;
};

/**
 * Filter and validate image URLs for database storage
 * @param {string[]} imageUrls - Array of image URLs
 * @returns {string[]} - Filtered array of safe URLs
 */
export const filterSafeImageUrls = (imageUrls) => {
  if (!Array.isArray(imageUrls)) {
    return [];
  }
  
  return imageUrls.filter(url => {
    if (!url || typeof url !== 'string') {
      return false;
    }
    
    // Check URL length
    if (!isImageUrlSafe(url)) {
      console.warn('Image URL too large for database storage, skipping:', url.substring(0, 100) + '...');
      return false;
    }
    
    return true;
  });
};

/**
 * Validate image array before sending to backend
 * @param {string[]} images - Array of image URLs
 * @returns {Object} - Validation result with filtered images and warnings
 */
export const validateImagesForBackend = (images) => {
  const result = {
    validImages: [],
    warnings: [],
    hasIssues: false
  };
  
  if (!Array.isArray(images)) {
    result.validImages = [];
    return result;
  }
  
  const filteredImages = filterSafeImageUrls(images);
  
  if (filteredImages.length !== images.length) {
    result.hasIssues = true;
    result.warnings.push(`${images.length - filteredImages.length} image(s) were too large and excluded`);
  }
  
  // Limit total number of images
  const MAX_IMAGES = 5;
  if (filteredImages.length > MAX_IMAGES) {
    result.validImages = filteredImages.slice(0, MAX_IMAGES);
    result.hasIssues = true;
    result.warnings.push(`Only first ${MAX_IMAGES} images will be saved`);
  } else {
    result.validImages = filteredImages;
  }
  
  return result;
};

/**
 * Show user-friendly message about image validation
 * @param {Object} validationResult - Result from validateImagesForBackend
 * @returns {string} - User-friendly message
 */
export const getImageValidationMessage = (validationResult) => {
  if (!validationResult.hasIssues) {
    return '';
  }
  
  const messages = [
    'Image upload note:',
    ...validationResult.warnings,
    'Tip: Use the automatic upload feature for better compatibility.'
  ];
  
  return messages.join(' ');
};

const imageUtils = {
  isImageUrlSafe,
  filterSafeImageUrls,
  validateImagesForBackend,
  getImageValidationMessage
};

export default imageUtils;
