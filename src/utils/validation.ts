/**
 * Validation utilities for forms and business logic
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Indian phone number validation (10 digits)
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const validateProductName = (name: string): boolean => {
  return name.trim().length > 0 && name.trim().length <= 100;
};

export const validateCustomerName = (name: string): boolean => {
  return name.trim().length > 0 && name.trim().length <= 100;
};

export const validateQuantity = (quantity: string): boolean => {
  const num = parseInt(quantity);
  return !isNaN(num) && num > 0 && num <= 10000;
};

export const validatePrice = (price: string): boolean => {
  const num = parseFloat(price);
  return !isNaN(num) && num > 0 && num <= 1000000;
};

export const validateStock = (stock: string): boolean => {
  const num = parseInt(stock);
  return !isNaN(num) && num >= 0 && num <= 1000000;
};

/**
 * Get error message for validation
 */
export const getValidationError = (field: string, type: string): string => {
  const errors: { [key: string]: string } = {
    name_invalid: 'कृपया वैध नाम दर्ज करें',
    email_invalid: 'कृपया वैध ईमेल दर्ज करें',
    phone_invalid: 'कृपया वैध फोन नंबर दर्ज करें',
    amount_invalid: 'कृपया वैध राशि दर्ज करें',
    quantity_invalid: 'कृपया वैध मात्रा दर्ज करें',
    price_invalid: 'कृपया वैध कीमत दर्ज करें',
    stock_invalid: 'कृपया वैध स्टॉक दर्ज करें',
  };
  return errors[`${field}_${type}`] || 'अमान्य मान';
};
