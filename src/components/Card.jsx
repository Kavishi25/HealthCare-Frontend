import React, { useState } from 'react';
import CardService from '../services/cardService';
import './Card.css';

const Card = ({ card, onCardUpdated, onCardDeleted, onSetDefault }) => {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this card?')) {
      return;
    }

    setIsDeleting(true);
    try {
      console.log('🗑️ Deleting card:', card.id);
      const result = await CardService.deleteCard(card.id);
      console.log('✅ Delete result:', result);
      onCardDeleted(card.id);
    } catch (error) {
      console.error('❌ Error deleting card:', error);
      alert(`Failed to delete card: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async () => {
    try {
      console.log('⭐ Setting default card:', card.id);
      const result = await CardService.setDefaultCard(card.id);
      console.log('✅ Set default result:', result);
      onSetDefault(card.id);
    } catch (error) {
      console.error('❌ Error setting default card:', error);
      alert(`Failed to set default card: ${error.message}`);
    }
  };

  const getCardTypeIcon = (cardType) => {
    switch (cardType?.toLowerCase()) {
      case 'visa':
        return (
          <div className="card-type-icon visa">
            <span>VISA</span>
          </div>
        );
      case 'mastercard':
        return (
          <div className="card-type-icon mastercard">
            <div className="mastercard-circle1"></div>
            <div className="mastercard-circle2"></div>
          </div>
        );
      case 'american express':
        return (
          <div className="card-type-icon amex">
            <span>AMEX</span>
          </div>
        );
      case 'discover':
        return (
          <div className="card-type-icon discover">
            <span>DISCOVER</span>
          </div>
        );
      default:
        return (
          <div className="card-type-icon other">
            <span>••••</span>
          </div>
        );
    }
  };

  const getCardGradient = (cardType) => {
    switch (cardType?.toLowerCase()) {
      case 'visa':
        return 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'; // Purple to pink gradient
      case 'mastercard':
        return 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)'; // Red to orange gradient
      case 'american express':
        return 'linear-gradient(135deg, #059669 0%, #10b981 100%)'; // Green gradient
      case 'discover':
        return 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'; // Blue to purple gradient
      default:
        return 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)'; // Gray gradient
    }
  };

  return (
    <div 
      className={`card-item ${card.isDefault ? 'default' : ''}`}
      style={{ background: getCardGradient(card.cardType) }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="card-header">
       
        <div className="card-logos">
          {getCardTypeIcon(card.cardType)}
        </div>
      </div>

      <div className="card-number">
        {card.cardNumber || '**** **** **** ****'}
      </div>

      <div className="card-footer">
        <span className="card-holder">
          {card.cardHolderName?.toUpperCase() || 'CARD HOLDER'}
        </span>
        <span className="card-expiry">
          {card.expiryMonth && card.expiryYear 
            ? `${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}`
            : 'MM/YY'
          }
        </span>
      </div>

      {card.isDefault && <span className="default-badge">DEFAULT</span>}

      {showActions && (
        <div className="card-actions">
          <button
            className="action-btn edit-btn"
            onClick={() => onCardUpdated(card)}
            title="Edit card"
          >
            ✏️
          </button>
          {!card.isDefault && (
            <button
              className="action-btn default-btn"
              onClick={handleSetDefault}
              title="Set as default"
            >
              ⭐
            </button>
          )}
          <button
            className="action-btn delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete card"
          >
            {isDeleting ? '⏳' : '🗑️'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
