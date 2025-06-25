/**
 * Utility functions for handling user roles in the application
 */

/**
 * Check if a user has the shop owner role
 * @param {Object} user - The user object 
 * @returns {Boolean} - True if the user is a shop owner, false otherwise
 */
export const isShopOwner = (user) => {
  if (!user) return false;
  
  // Check for both string role variants ('SHOP_OWNER', 'ROLE_SHOP_OWNER') or numeric role 1
  return user.role === 'SHOP_OWNER' || user.role === 'ROLE_SHOP_OWNER' || user.role === 1;
};

/**
 * Check if a user has the admin role
 * @param {Object} user - The user object
 * @returns {Boolean} - True if the user is an admin, false otherwise
 */
export const isAdmin = (user) => {
  if (!user) return false;
  
  // Check for both string role variants ('ADMIN', 'ROLE_ADMIN') or numeric role 2
  return user.role === 'ADMIN' || user.role === 'ROLE_ADMIN' || user.role === 2;
};

/**
 * Check if a user has the customer role
 * @param {Object} user - The user object
 * @returns {Boolean} - True if the user is a customer, false otherwise
 */
export const isCustomer = (user) => {
  if (!user) return false;
  
  // Basic customer check - not a shop owner or admin
  if (isShopOwner(user) || isAdmin(user)) {
    return false;
  }
  
  // Check for string role 'ROLE_CUSTOMER' or numeric role 0
  return user.role === 'ROLE_CUSTOMER' || user.role === 0;
};

/**
 * Map numeric role to string role
 * @param {Number|String} role - Numeric role (0, 1, 2) or string role
 * @returns {String} - String representation of the role
 */
export const mapRoleToString = (role) => {
  // If it's already a string and not a number disguised as a string
  if (typeof role === 'string' && isNaN(parseInt(role))) {
    return role;
  }
  
  // Convert to number if it's a string number
  const numericRole = typeof role === 'string' ? parseInt(role) : role;
  
  switch(numericRole) {
    case 0:
      return 'ROLE_CUSTOMER';
    case 1:
      return 'SHOP_OWNER';
    case 2:
      return 'ADMIN';
    default:
      return 'ROLE_CUSTOMER'; // Default to customer
  }
};

/**
 * Get the dashboard URL for the user based on their role
 * @param {Object} user - The user object
 * @returns {String} - URL of the appropriate dashboard
 */
export const getDashboardUrl = (user) => {
  if (!user) return '/';
  
  if (isAdmin(user)) {
    return '/admin-dashboard';
  } else if (isShopOwner(user)) {
    return '/dashboard/shop';
  } else {
    return '/'; // Regular customers go to home
  }
};
