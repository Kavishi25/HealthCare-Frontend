import React, { useState } from 'react';
import CardService from '../services/cardService';
import { getRandomValidCard, formatCardNumber } from '../utils/cardGenerator';
import './AddCardModal.css';

const AddCardModal = ({ isOpen, onClose, onCardAdded, isEdit = false, editCard = null }) => {
  const [formData, setFormData] = useState({
    cardNumber: editCard?.cardNumber || '',
    cardHolderName: editCard?.cardHolderName || '',
    expiryMonth: editCard?.expiryMonth || '',
    expiryYear: editCard?.expiryYear || '',
    cvv: editCard?.cvv || '',
    cardType: editCard?.cardType || '',
    isDefault: editCard?.isDefault || false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes or edit card changes
  React.useEffect(() => {
    if (isOpen) {
      if (isEdit && editCard) {
        setFormData({
          cardNumber: editCard.cardNumber || '',
          cardHolderName: editCard.cardHolderName || '',
          expiryMonth: editCard.expiryMonth || '',
          expiryYear: editCard.expiryYear || '',
          cvv: editCard.cvv || '',
          cardType: editCard.cardType || '',
          isDefault: editCard.isDefault || false
        });
      } else {
        setFormData({
          cardNumber: '',
          cardHolderName: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          cardType: '',
          isDefault: false
        });
      }
      setErrors({});
    }
  }, [isOpen, isEdit, editCard]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  const generateTestCard = () => {
    const validCardNumber = getRandomValidCard('visa');
    const formattedNumber = formatCardNumber(validCardNumber);
    
    setFormData(prev => ({
      ...prev,
      cardNumber: formattedNumber,
      cardHolderName: 'Test User',
      expiryMonth: 12,
      expiryYear: new Date().getFullYear() + 2,
      cvv: '123'
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Card number validation - basic format check only
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else {
      const cleanNumber = formData.cardNumber.replace(/\s/g, '');
      if (cleanNumber.length < 13 || cleanNumber.length > 19) {
        newErrors.cardNumber = 'Card number must be between 13-19 digits';
      }
    }

    // Card holder name validation
    if (!formData.cardHolderName.trim()) {
      newErrors.cardHolderName = 'Card holder name is required';
    } else if (formData.cardHolderName.trim().length < 2) {
      newErrors.cardHolderName = 'Card holder name must be at least 2 characters';
    } else if (formData.cardHolderName.trim().length > 50) {
      newErrors.cardHolderName = 'Card holder name cannot exceed 50 characters';
    }

    // Expiry month validation
    if (!formData.expiryMonth) {
      newErrors.expiryMonth = 'Expiry month is required';
    } else if (formData.expiryMonth < 1 || formData.expiryMonth > 12) {
      newErrors.expiryMonth = 'Expiry month must be between 1 and 12';
    }

    // Expiry year validation
    if (!formData.expiryYear) {
      newErrors.expiryYear = 'Expiry year is required';
    } else {
      const currentYear = new Date().getFullYear();
      if (formData.expiryYear < currentYear) {
        newErrors.expiryYear = 'Card has expired';
      } else if (formData.expiryYear > currentYear + 20) {
        newErrors.expiryYear = 'Expiry year cannot be more than 20 years in the future';
      }
    }

    // CVV validation
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }

    // Card type validation
    if (!formData.cardType) {
      newErrors.cardType = 'Card type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const cardData = {
        cardNumber: formData.cardNumber.replace(/\s/g, ''), // Remove spaces
        cardHolderName: formData.cardHolderName.trim(),
        expiryMonth: parseInt(formData.expiryMonth),
        expiryYear: parseInt(formData.expiryYear),
        cvv: formData.cvv,
        cardType: formData.cardType,
        isDefault: formData.isDefault
      };

      let result;
      if (isEdit && editCard) {
        // Update existing card
        result = await CardService.updateCard(editCard.id, cardData);
      } else {
        // Create new card
        result = await CardService.createCard(cardData);
      }

      onCardAdded(result.data);
      onClose();
    } catch (error) {
      console.error('Error saving card:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to save card';
      if (error.message.includes('Invalid card number')) {
        errorMessage = 'Invalid card number. Please check the number and try again.';
      } else if (error.message.includes('Card already exists')) {
        errorMessage = 'This card is already saved.';
      } else if (error.message.includes('Card has expired')) {
        errorMessage = 'This card has expired. Please use a valid expiry date.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      cardNumber: '',
      cardHolderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardType: '',
      isDefault: false
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? 'Edit Card' : 'Add New Card'}
          </h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className={`form-input ${errors.cardNumber ? 'error' : ''}`}
              disabled={isEdit} // Don't allow editing card number
            />
            {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
            
          </div>

          <div className="form-group">
            <label className="form-label">Card Holder Name</label>
            <input
              type="text"
              name="cardHolderName"
              value={formData.cardHolderName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={`form-input ${errors.cardHolderName ? 'error' : ''}`}
            />
            {errors.cardHolderName && <span className="error-message">{errors.cardHolderName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group-half">
              <label className="form-label">Expiry Month</label>
              <select
                name="expiryMonth"
                value={formData.expiryMonth}
                onChange={handleInputChange}
                className={`form-input ${errors.expiryMonth ? 'error' : ''}`}
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {String(i + 1).padStart(2, '0')}
                  </option>
                ))}
              </select>
              {errors.expiryMonth && <span className="error-message">{errors.expiryMonth}</span>}
            </div>

            <div className="form-group-half">
              <label className="form-label">Expiry Year</label>
              <select
                name="expiryYear"
                value={formData.expiryYear}
                onChange={handleInputChange}
                className={`form-input ${errors.expiryYear ? 'error' : ''}`}
              >
                <option value="">Year</option>
                {Array.from({ length: 21 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
              {errors.expiryYear && <span className="error-message">{errors.expiryYear}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">CVV</label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              placeholder="123"
              maxLength="4"
              className={`form-input ${errors.cvv ? 'error' : ''}`}
            />
            {errors.cvv && <span className="error-message">{errors.cvv}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Card Type</label>
            <div className="card-type-selection">
              {['Visa', 'MasterCard', 'American Express', 'Discover', 'Other'].map((type) => (
                <label key={type} className="card-type-option">
                  <input
                    type="radio"
                    name="cardType"
                    value={type}
                    checked={formData.cardType === type}
                    onChange={handleInputChange}
                    className="card-type-radio"
                  />
                  <span className="card-type-label">{type}</span>
                </label>
              ))}
            </div>
            {errors.cardType && <span className="error-message">{errors.cardType}</span>}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <span className="checkbox-text">Set as default card</span>
            </label>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (isEdit ? 'Update Card' : 'Add Card')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;
