import React, { useState, useEffect } from "react";
import "../styles/Payment.css";
import AddCardModal from "../components/AddCardModal";
import Card from "../components/Card";
import CardService from "../services/cardService";
import PaymentService from "../services/paymentService";

const Payment = () => {
  const [activeTab, setActiveTab] = useState("card");
  const [selectedCard, setSelectedCard] = useState(null);
  const [savedCards, setSavedCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);

  // Load cards on component mount
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Loading cards from API...');
      const response = await CardService.getUserCards();
      console.log('📦 API Response:', response);
      
      if (response.success) {
        console.log('✅ Cards loaded successfully:', response.data.cards);
        setSavedCards(response.data.cards);
        // Auto-select the first card if none is selected
        if (response.data.cards.length > 0 && !selectedCard) {
          setSelectedCard(response.data.cards[0].id);
        }
      } else {
        console.error('❌ API returned success: false', response);
      }
    } catch (error) {
      console.error('❌ Error loading cards:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleCardAdded = (newCard) => {
    if (editingCard) {
      // Update existing card in the list
      setSavedCards(prev => 
        prev.map(card => 
          card.id === editingCard.id ? { ...card, ...newCard } : card
        )
      );
    } else {
      // Add new card to the list
      setSavedCards(prev => [newCard, ...prev]);
      // Auto-select the new card
      setSelectedCard(newCard.id);
    }
  };

  const handleCardDeleted = (cardId) => {
    setSavedCards(prev => prev.filter(card => card.id !== cardId));
    // If the deleted card was selected, select the first available card
    if (selectedCard === cardId) {
      const remainingCards = savedCards.filter(card => card.id !== cardId);
      setSelectedCard(remainingCards.length > 0 ? remainingCards[0].id : null);
    }
  };

  const handleSetDefault = (cardId) => {
    setSavedCards(prev => 
      prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    );
  };

  // Handle card selection and auto-fill form
  const handleCardSelection = (cardId) => {
    setSelectedCard(cardId);
    const selectedCardData = savedCards.find(card => card.id === cardId);
    
    if (selectedCardData) {
      // Auto-fill the payment form with selected card details
      setPaymentForm({
        cardNumber: selectedCardData.cardNumber || '',
        cardHolder: selectedCardData.cardHolderName || '',
        expiryDate: selectedCardData.expiryMonth && selectedCardData.expiryYear 
          ? `${selectedCardData.expiryMonth}/${selectedCardData.expiryYear.toString().slice(-2)}`
          : '',
        cvv: selectedCardData.cvv || '' // Auto-fill CVV from selected card
      });
    }
  };

  // Handle payment form input changes
  const handlePaymentFormChange = (field, value) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle payment processing
  const handlePayment = async () => {
    if (activeTab === "card") {
      await handleCardPayment();
    } else if (activeTab === "insurance") {
      await handleInsurancePayment();
    } else if (activeTab === "cash") {
      await handleCashPayment();
    }
  };

  // Handle card payment
  const handleCardPayment = async () => {
    if (!selectedCard) {
      alert('Please select a card or add a new card');
      return;
    }

    setIsProcessingPayment(true);
    try {
      const selectedCardData = savedCards.find(card => card.id === selectedCard);
      
      const paymentData = {
        paymentType: 'card',
        amount: parseFloat(appointmentDetails.total.replace(/[,$]/g, '')) || 120.00, // Parse amount from appointment details
        currency: 'USD',
        appointmentId: '64a1b2c3d4e5f67890123456', // Dummy appointment ID
        cardId: selectedCard,
        metadata: {
          ipAddress: '192.168.1.1',
          userAgent: navigator.userAgent,
          notes: 'Card payment for consultation'
        }
      };

      console.log('💳 Processing card payment:', paymentData);
      const result = await PaymentService.createPayment(paymentData);
      
      // Add 2-second loading delay before showing success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentResult(result.data);
      setShowPaymentConfirmation(true);
      
      // Automatically download receipt after showing success
      setTimeout(() => {
        downloadReceipt(result.data);
      }, 500);
      
    } catch (error) {
      console.error('❌ Card payment failed:', error);
      alert(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle insurance payment
  const handleInsurancePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const paymentData = {
        paymentType: 'insurance',
        amount: parseFloat(appointmentDetails.total.replace(/[,$]/g, '')) || 120.00,
        currency: 'USD',
        appointmentId: '64a1b2c3d4e5f67890123456', // Dummy appointment ID
        insuranceDetails: {
          provider: 'Blue Cross Blue Shield',
          policyNumber: 'BC123456789',
          policyHolderName: 'John Doe',
          coverageAmount: 1000.00,
          deductible: 100.00
        },
        metadata: {
          ipAddress: '192.168.1.1',
          userAgent: navigator.userAgent,
          notes: 'Insurance payment for consultation'
        }
      };

      console.log('🏥 Processing insurance payment:', paymentData);
      const result = await PaymentService.createPayment(paymentData);
      
      // Add 2-second loading delay before showing success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentResult(result.data);
      setShowPaymentConfirmation(true);
      
      // Automatically download receipt after showing success
      setTimeout(() => {
        downloadReceipt(result.data);
      }, 500);
      
    } catch (error) {
      console.error('❌ Insurance payment failed:', error);
      alert(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle cash payment
  const handleCashPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const paymentData = {
        paymentType: 'cash',
        amount: parseFloat(appointmentDetails.total.replace(/[,$]/g, '')) || 120.00,
        currency: 'USD',
        appointmentId: '64a1b2c3d4e5f67890123456', // Dummy appointment ID
        cashDetails: {
          paymentLocation: 'Ground Floor, Main Building, Payment Counter #1',
          paymentInstructions: 'Please arrive 15 minutes before your appointment time for payment processing'
        },
        metadata: {
          ipAddress: '192.168.1.1',
          userAgent: navigator.userAgent,
          notes: 'Cash payment at counter'
        }
      };

      console.log('💰 Processing cash payment:', paymentData);
      const result = await PaymentService.createPayment(paymentData);
      
      // Add 2-second loading delay before showing success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentResult(result.data);
      setShowPaymentConfirmation(true);
      
      // Automatically download receipt after showing success
      setTimeout(() => {
        downloadReceipt(result.data);
      }, 500);
      
    } catch (error) {
      console.error('❌ Cash payment failed:', error);
      alert(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle receipt download
  const handleDownloadReceipt = () => {
    if (!paymentResult) return;
    downloadReceipt(paymentResult);
  };

  // Download receipt function
  const downloadReceipt = (paymentData) => {
    // Create receipt content with only payment information
    const receiptContent = `
HEALTHCARE PAYMENT RECEIPT
========================

Transaction ID: ${paymentData.transactionId}
Payment Date: ${new Date(paymentData.createdAt).toLocaleString()}
Payment Type: ${paymentData.paymentType.toUpperCase()}
Amount: $${paymentData.amount.toFixed(2)} ${paymentData.currency}
Status: ${paymentData.status.toUpperCase()}
${paymentData.paymentMethodSummary ? `Payment Method: ${paymentData.paymentMethodSummary}` : ''}

========================
Thank you for your payment!
    `.trim();

    // Create and download the file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment-receipt-${paymentData.transactionId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Close payment confirmation
  const closePaymentConfirmation = () => {
    setShowPaymentConfirmation(false);
    setPaymentResult(null);
  };

  const appointmentDetails = {
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: "9 Jan 2023, 10:00 am",
    service: "Consultation",
    discount: "$40",
    subtotal: "120.00",
    vat: "$18.00",
    total: "$120.00",
    factory: "9 Jan 2023, 10:00 am",
    consultant: "$40.00",
    cic: "CIC-294 BMW AG",
  };

  return (
    <div className="kav-payment-page">
      <div className="kav-payment-header">
        <a href="/doctors" className="kav-back-btn">
          ← Back
        </a>
      </div>

      <div className="kav-payment-container">
        {/* Payment Section - 70% width */}
        <div className="kav-payment-section">
          <h2 className="kav-main-title">Select Payment method</h2>

          {/* Payment Tabs */}
          <div className="kav-payment-tabs">
            <button
              className={`kav-tab ${activeTab === "card" ? "active" : ""}`}
              onClick={() => setActiveTab("card")}
            >
              Credit card
            </button>
            <button
              className={`kav-tab ${activeTab === "insurance" ? "active" : ""}`}
              onClick={() => setActiveTab("insurance")}
            >
              Insurance
            </button>
            <button
              className={`kav-tab ${activeTab === "cash" ? "active" : ""}`}
              onClick={() => setActiveTab("cash")}
            >
              Cash
            </button>
          </div>

          {/* Card Tab Content */}
          {activeTab === "card" && (
            <div className="kav-card-content">
              <div className="kav-cards-column">
                <p className="kav-section-label">Pay using credit cards</p>

                <div className="kav-cards-stack">
                  {isLoading ? (
                    <div className="loading-cards">
                      <div className="loading-spinner"></div>
                      <p>Loading cards...</p>
                    </div>
                  ) : savedCards.length > 0 ? (
                    savedCards.map((card) => (
                      <div
                        key={card.id}
                        className={`card-wrapper ${
                          selectedCard === card.id ? "selected" : ""
                        }`}
                        onClick={() => handleCardSelection(card.id)}
                      >
                        <Card
                          card={card}
                          onCardUpdated={handleEditCard}
                          onCardDeleted={handleCardDeleted}
                          onSetDefault={handleSetDefault}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="no-cards">
                      <p>No saved cards found</p>
                      <p className="no-cards-subtitle">Add a card to get started</p>
                    </div>
                  )}
                </div>

                <div className="kav-add-new-section">
                  <button className="kav-add-new-btn" onClick={handleAddCard}>
                    <span className="kav-add-icon">+</span>
                    <span>Add new</span>
                  </button>
                </div>
              </div>

              <div className="kav-payment-form">
                {selectedCard && (
                  <div className="selected-card-info">
                    <p className="selected-card-message">
                      ✓ All card details auto-filled from selected card (including CVV)
                    </p>
                  </div>
                )}
                <div className="kav-form-group">
                  <label className="kav-label">Credit card</label>
                  <input
                    type="text"
                    value={paymentForm.cardNumber}
                    onChange={(e) => handlePaymentFormChange('cardNumber', e.target.value)}
                    placeholder="2324 3456 6677 7688"
                    className="kav-input"
                  />
                </div>

                <div className="kav-form-group">
                  <label className="kav-label">Card holder</label>
                  <input
                    type="text"
                    value={paymentForm.cardHolder}
                    onChange={(e) => handlePaymentFormChange('cardHolder', e.target.value)}
                    placeholder="Andhori joelon jenerie"
                    className="kav-input"
                  />
                </div>

                <div className="kav-form-row">
                  <div className="kav-form-group-half">
                    <label className="kav-label">Expiration Date</label>
                    <input
                      type="text"
                      value={paymentForm.expiryDate}
                      onChange={(e) => handlePaymentFormChange('expiryDate', e.target.value)}
                      placeholder="1/34"
                      className="kav-input-small"
                    />
                  </div>
                  <div className="kav-form-group-half">
                    <label className="kav-label">CVV</label>
                    <input
                      type="text"
                      value={paymentForm.cvv}
                      onChange={(e) => handlePaymentFormChange('cvv', e.target.value)}
                      placeholder="234"
                      className="kav-input-small"
                    />
                  </div>
                </div>

            

                <button 
                  className="kav-pay-button" 
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? 'Processing...' : 'Pay'}
                </button>
              </div>
            </div>
          )}

          {/* Insurance Tab Content */}
          {activeTab === "insurance" && (
            <div className="kav-tab-content">
              <div className="kav-insurance-form">
                <h3 className="kav-section-title">Insurance Information</h3>
                <div className="kav-form-group">
                  <label className="kav-label">Insurance Provider</label>
                  <input
                    type="text"
                    placeholder="Enter your insurance provider"
                    className="kav-input"
                  />
                </div>
                <div className="kav-form-group">
                  <label className="kav-label">Policy Number</label>
                  <input
                    type="text"
                    placeholder="Enter your policy number"
                    className="kav-input"
                  />
                </div>
                <div className="kav-form-row">
                  <div className="kav-form-group-half">
                    <label className="kav-label">Policy Holder Name</label>
                    <input
                      type="text"
                      placeholder="Enter policy holder name"
                      className="kav-input-small"
                    />
                  </div>
                  
                </div>
                <div className="kav-insurance-disclaimer">
                  <p className="kav-disclaimer-text">
                    By proceeding, you confirm that all insurance information
                    provided is accurate. 
                  </p>
                </div>
                <button 
                  className="kav-pay-button" 
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? 'Processing...' : 'Verify Insurance'}
                </button>
              </div>
            </div>
          )}

          {/* Cash Tab Content */}
          {activeTab === "cash" && (
            <div className="kav-tab-content">
              <div className="kav-cash-payment">
                <h3 className="kav-section-title">Pay at Hospital</h3>
                <div className="kav-cash-info">
                  <div className="kav-info-box">
                    <div className="kav-info-icon">💳</div>
                    <h4 className="kav-info-title">Payment at Counter</h4>
                    <p className="kav-info-text">
                      Visit our hospital's payment counter to complete your
                      payment. We accept cash and all major debit/credit cards.
                    </p>
                  </div>
                  <div className="kav-payment-details">
                    <div className="kav-detail-item">
                      <span className="kav-detail-icon">⏰</span>
                      <div className="kav-detail-content">
                        <h5 className="kav-detail-title">Counter Hours</h5>
                        <p className="kav-detail-text">
                          Monday - Sunday: 8:00 AM - 8:00 PM
                        </p>
                      </div>
                    </div>
                    <div className="kav-detail-item">
                      <span className="kav-detail-icon">📍</span>
                      <div className="kav-detail-content">
                        <h5 className="kav-detail-title">Payment Location</h5>
                        <p className="kav-detail-text">
                          Ground Floor, Main Building, Payment Counter #1
                        </p>
                      </div>
                    </div>
                    <div className="kav-detail-item">
                      <span className="kav-detail-icon">⚠️</span>
                      <div className="kav-detail-content">
                        <h5 className="kav-detail-title">Important Note</h5>
                        <p className="kav-detail-text">
                          Please arrive 15 minutes before your appointment time
                          for payment processing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  className="kav-pay-button"
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? 'Processing...' : 'Confirm Pay at Counter'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Appointment Summary - 30% width */}
        <div className="kav-order-summary">
          <h3 className="kav-summary-title">Appointment Summary</h3>

          <div className="kav-appointment-info">
            <div className="kav-logo-section">
              <div className="kav-bmw-logo">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <circle
                    cx="30"
                    cy="30"
                    r="28"
                    fill="#1a1a1a"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                  />
                  <path d="M30 6 L30 30 L54 30" fill="#4a9eff" opacity="0.8" />
                  <path d="M30 30 L6 30 L30 54" fill="#fff" opacity="0.9" />
                </svg>
              </div>
            </div>

            <div className="kav-appointment-details">
              <h4 className="kav-total-amount">
                $ {appointmentDetails.total} Lakh
              </h4>
              <div className="kav-detail-row">
                <span className="kav-detail-label">Factory Year</span>
                <span className="kav-detail-value">
                  {appointmentDetails.factory}
                </span>
              </div>
              <div className="kav-detail-row">
                <span className="kav-detail-label">Consultant</span>
                <span className="kav-detail-value">
                  {appointmentDetails.consultant}
                </span>
              </div>
              <div className="kav-detail-row">
                <span className="kav-detail-label">Property</span>
                <span className="kav-detail-value">
                  {appointmentDetails.cic}
                </span>
              </div>
              <div className="kav-detail-row">
                <span className="kav-detail-label">Discount</span>
                <span className="kav-detail-value">
                  -{appointmentDetails.discount}
                </span>
              </div>
              <div className="kav-detail-row">
                <span className="kav-detail-label">Subtotal</span>
                <span className="kav-detail-value">
                  {appointmentDetails.subtotal}%
                </span>
              </div>
              <div className="kav-detail-row">
                <span className="kav-detail-label">Total</span>
                <span className="kav-detail-value success">
                  {appointmentDetails.vat}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Card Modal */}
      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCardAdded={handleCardAdded}
        isEdit={!!editingCard}
        editCard={editingCard}
      />

      {/* Payment Confirmation Modal */}
      {showPaymentConfirmation && paymentResult && (
        <div className="payment-confirmation-overlay">
          <div className="payment-confirmation-modal">
            <div className="payment-confirmation-header">
              <h2>Payment Confirmation</h2>
              <button 
                className="close-btn" 
                onClick={closePaymentConfirmation}
              >
                ×
              </button>
            </div>
            
            <div className="payment-confirmation-content">
              <div className="payment-success-icon">
                ✅
              </div>
              
              <h3>Payment Successful!</h3>
              
              <div className="payment-details">
                <div className="detail-row">
                  <span className="label">Transaction ID:</span>
                  <span className="value">{paymentResult.transactionId}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Payment Type:</span>
                  <span className="value">{paymentResult.paymentType.toUpperCase()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Amount:</span>
                  <span className="value">${paymentResult.amount.toFixed(2)} {paymentResult.currency}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className="value status-completed">{paymentResult.status.toUpperCase()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(paymentResult.createdAt).toLocaleString()}</span>
                </div>
                {paymentResult.paymentMethodSummary && (
                  <div className="detail-row">
                    <span className="label">Payment Method:</span>
                    <span className="value">{paymentResult.paymentMethodSummary}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="payment-confirmation-actions">
              <button 
                className="btn btn-secondary" 
                onClick={closePaymentConfirmation}
              >
                Close
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleDownloadReceipt}
              >
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
