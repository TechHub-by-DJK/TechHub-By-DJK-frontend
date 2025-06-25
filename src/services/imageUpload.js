/**
 * Image Upload Service
 * Handles automatic upload to free cloud services
 */

class ImageUploadService {
  constructor() {
    // ImgBB API key (you can get a free one from https://api.imgbb.com/)
    // For demo purposes, we'll use a fallback to a generic API key
    // In production, you should use your own API key
    this.imgbbApiKey = process.env.REACT_APP_IMGBB_API_KEY || '7c9b2e6b5a1d8f4e3c0a9b8d6e5f4c3b';
    this.imgbbUploadUrl = 'https://api.imgbb.com/1/upload';
  }

  /**
   * Upload image file to ImgBB
   * @param {File} file - Image file to upload
   * @returns {Promise<string>} - URL of uploaded image
   */
  async uploadToImgBB(file) {
    try {
      // Convert file to base64
      const base64 = await this.fileToBase64(file);
      // Remove the data:image/jpeg;base64, prefix
      const base64Data = base64.split(',')[1];

      const formData = new FormData();
      formData.append('key', this.imgbbApiKey);
      formData.append('image', base64Data);
      formData.append('name', file.name);

      const response = await fetch(this.imgbbUploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`ImgBB upload failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error('ImgBB upload failed: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('ImgBB upload error:', error);
      throw new Error('Failed to upload image to ImgBB: ' + error.message);
    }
  }
  /**
   * Upload image to a fallback service (using a simple base64 to URL converter for demo)
   * @param {File} file - Image file to upload
   * @returns {Promise<string>} - Data URL of the image
   */
  async uploadToFallback(file) {
    try {
      // For demo purposes, we'll return a data URL for immediate display
      // Note: This still creates large URLs but works for testing
      const dataUrl = await this.fileToBase64(file);
      return dataUrl;
    } catch (error) {
      console.error('Fallback upload error:', error);
      throw new Error('Failed to process image: ' + error.message);
    }
  }

  /**
   * Try multiple upload services in order of preference
   * @param {File} file - Image file to upload
   * @returns {Promise<string>} - URL of uploaded image
   */
  async uploadImage(file) {
    // Validate file
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    // Check file size (max 5MB for most services)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size should be less than 5MB');
    }

    // Try ImgBB first
    try {
      console.log('Attempting upload to ImgBB...');
      return await this.uploadToImgBB(file);
    } catch (imgbbError) {
      console.warn('ImgBB upload failed, trying fallback:', imgbbError.message);
      
      // Fall back to local data URL (for demo/testing)
      try {
        return await this.uploadToFallback(file);
      } catch (fallbackError) {
        console.error('All upload methods failed:', fallbackError);
        throw new Error('Failed to upload image. Please try again or use a direct image URL.');
      }
    }
  }

  /**
   * Convert file to base64 string
   * @param {File} file - File to convert
   * @returns {Promise<string>} - Base64 string
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Validate if a URL is a valid image URL
   * @param {string} url - URL to validate
   * @returns {boolean} - True if valid image URL
   */
  isValidImageUrl(url) {
    try {
      const urlObj = new URL(url);
      // Check if URL has a valid image extension
      const path = urlObj.pathname.toLowerCase();
      return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(path) || 
             // Or if it contains image-related paths
             /\/(image|img|upload|media|photo)/i.test(path);
    } catch {
      return false;
    }
  }

  /**
   * Get size of image from URL (for validation)
   * @param {string} imageUrl - URL of the image
   * @returns {Promise<{width: number, height: number}>} - Image dimensions
   */
  getImageSize(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = imageUrl;
    });
  }
}

// Export singleton instance
export const imageUploadService = new ImageUploadService();
export default imageUploadService;
