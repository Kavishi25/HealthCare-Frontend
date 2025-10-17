// Generate valid test card numbers using Luhn algorithm

/**
 * Generate a valid card number using Luhn algorithm
 * @param {string} prefix - The prefix for the card (e.g., "4111" for Visa)
 * @param {number} length - Total length of the card number (default: 16)
 * @returns {string} Valid card number
 */
export function generateValidCardNumber(prefix = "4111", length = 16) {
  // Create base number with prefix
  let baseNumber = prefix;
  
  // Fill with random digits to reach length - 1 (last digit will be check digit)
  while (baseNumber.length < length - 1) {
    baseNumber += Math.floor(Math.random() * 10).toString();
  }
  
  // Calculate check digit using Luhn algorithm
  const checkDigit = calculateCheckDigit(baseNumber);
  
  return baseNumber + checkDigit;
}

/**
 * Calculate the check digit for a card number using Luhn algorithm
 * @param {string} number - Card number without check digit
 * @returns {string} Check digit
 */
function calculateCheckDigit(number) {
  let sum = 0;
  let isEven = false;
  
  // Process digits from right to left
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  // Calculate check digit
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit.toString();
}

/**
 * Get predefined valid test card numbers
 */
export const VALID_TEST_CARDS = {
  visa: [
    "4111111111111111",
    "4000000000000002",
    "4000000000000069"
  ],
  mastercard: [
    "5555555555554444",
    "5200000000000007",
    "5100000000000008"
  ],
  amex: [
    "378282246310005",
    "371449635398431"
  ],
  discover: [
    "6011111111111117",
    "6011000990139424"
  ]
};

/**
 * Get a random valid test card
 * @param {string} type - Card type (visa, mastercard, amex, discover)
 * @returns {string} Valid card number
 */
export function getRandomValidCard(type = 'visa') {
  const cards = VALID_TEST_CARDS[type.toLowerCase()];
  if (!cards) {
    return VALID_TEST_CARDS.visa[0]; // Default to Visa
  }
  
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}

/**
 * Format card number with spaces
 * @param {string} cardNumber - Card number without spaces
 * @returns {string} Formatted card number
 */
export function formatCardNumber(cardNumber) {
  return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
}
