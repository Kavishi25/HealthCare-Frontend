import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "../styles/Payment.css";
import AddCardModal from "../components/AddCardModal";
import Card from "../components/Card";
import CardService from "../services/cardService";
import PaymentService from "../services/paymentService";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  // Get appointment data from navigation state
  const appointmentData = location.state || {
    appointmentId: '64a1b2c3d4e5f67890123456',
    doctor: { name: 'Sarah Johnson', specialty: 'Cardiologist' },
    date: new Date().toISOString(),
    slot: '10:00 AM',
    amount: 0
  };

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
      
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId') || localStorage.getItem('patientId');
      
      const paymentData = {
        userId: userId,
        paymentType: 'card',
        amount: parseFloat(appointmentData.amount) || 0,
        currency: 'LKR',
        appointmentId: appointmentData.appointmentId,
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
      const errorMessage = error.errors && error.errors.length > 0
        ? `Payment validation failed:\n${error.errors.join('\n')}`
        : `Payment failed: ${error.message}`;
      alert(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle insurance payment
  const handleInsurancePayment = async () => {
    setIsProcessingPayment(true);
    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId') || localStorage.getItem('patientId');
      
      const paymentData = {
        userId: userId,
        paymentType: 'insurance',
        amount: parseFloat(appointmentData.amount) || 0,
        currency: 'LKR',
        appointmentId: appointmentData.appointmentId,
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
      const errorMessage = error.errors && error.errors.length > 0
        ? `Payment validation failed:\n${error.errors.join('\n')}`
        : `Payment failed: ${error.message}`;
      alert(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle cash payment
  const handleCashPayment = async () => {
    setIsProcessingPayment(true);
    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId') || localStorage.getItem('patientId');
      
      const paymentData = {
        userId: userId,
        paymentType: 'cash',
        amount: parseFloat(appointmentData.amount) || 0,
        currency: 'LKR',
        appointmentId: appointmentData.appointmentId,
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
      const errorMessage = error.errors && error.errors.length > 0
        ? `Payment validation failed:\n${error.errors.join('\n')}`
        : `Payment failed: ${error.message}`;
      alert(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle receipt download
  const handleDownloadReceipt = () => {
    if (!paymentResult) return;
    downloadReceipt(paymentResult);
  };

  // Download receipt function as PDF
  const downloadReceipt = (paymentData) => {
    const doc = new jsPDF();
    
    // Set colors
    const primaryColor = [102, 126, 234]; // #667eea
    const darkColor = [31, 41, 55]; // #1f2937
    const lightGray = [107, 114, 128]; // #6b7280
    
    // Header with gradient-like effect (using rectangles)
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('PAYMENT RECEIPT', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Healthcare Appointment Payment', 105, 30, { align: 'center' });
    
    // Reset text color for body
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    
    // Transaction Info Section
    let yPosition = 55;
    
    // Transaction ID (highlighted)
    doc.setFillColor(240, 245, 255); // Light blue background
    doc.rect(15, yPosition - 5, 180, 12, 'F');
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Transaction ID:', 20, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(paymentData.transactionId, 60, yPosition);
    
    yPosition += 20;
    
    // Payment Details
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Payment Details', 20, yPosition);
    
    yPosition += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, 190, yPosition);
    
    yPosition += 10;
    
    // Details rows
    const details = [
      { label: 'Payment Date:', value: new Date(paymentData.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })},
      { label: 'Payment Type:', value: paymentData.paymentType.toUpperCase() },
      { label: 'Payment Method:', value: paymentData.paymentMethodSummary || 'N/A' },
      { label: 'Status:', value: paymentData.status.toUpperCase() }
    ];
    
    doc.setFontSize(11);
    details.forEach(detail => {
      doc.setFont(undefined, 'bold');
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.text(detail.label, 20, yPosition);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(detail.value, 70, yPosition);
      yPosition += 8;
    });
    
    yPosition += 5;
    
    // Amount Section (highlighted)
    doc.setFillColor(240, 253, 244); // Light green background
    doc.rect(15, yPosition - 3, 180, 20, 'F');
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(5, 150, 105); // Green color
    doc.text('Total Amount:', 20, yPosition + 8);
    doc.setFontSize(20);
    doc.text(`LKR ${paymentData.amount.toFixed(2)}`, 150, yPosition + 8, { align: 'right' });
    
    yPosition += 30;
    
    // Appointment Details if available
    if (appointmentData && appointmentData.doctor) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('Appointment Details', 20, yPosition);
      
      yPosition += 10;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPosition, 190, yPosition);
      
      yPosition += 10;
      
      const appointmentDetails = [
        { label: 'Doctor:', value: `Dr. ${appointmentData.doctor.name}` },
        { label: 'Specialty:', value: appointmentData.doctor.specialty },
        { label: 'Appointment Date:', value: formatAppointmentDate(appointmentData.date) },
        { label: 'Time Slot:', value: appointmentData.slot }
      ];
      
      doc.setFontSize(11);
      appointmentDetails.forEach(detail => {
        doc.setFont(undefined, 'bold');
        doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.text(detail.label, 20, yPosition);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text(detail.value, 70, yPosition);
        yPosition += 8;
      });
    }
    
    // Footer
    yPosition = 270; // Near bottom of page
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.line(20, yPosition, 190, yPosition);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'italic');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('Thank you for choosing our healthcare services!', 105, yPosition + 8, { align: 'center' });
    doc.text('For any queries, please contact our support team.', 105, yPosition + 14, { align: 'center' });
    
    // Save the PDF
    doc.save(`payment-receipt-${paymentData.transactionId}.pdf`);
  };

  // Close payment confirmation
  const closePaymentConfirmation = () => {
    setShowPaymentConfirmation(false);
    setPaymentResult(null);
  };

  // Format appointment details for display
  const formatAppointmentDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric'
    });
  };

  const appointmentDetails = {
    doctor: `Dr. ${appointmentData.doctor?.name || 'Unknown'}`,
    specialty: appointmentData.doctor?.specialty || 'General',
    date: `${formatAppointmentDate(appointmentData.date)}, ${appointmentData.slot}`,
    service: "Consultation",
    appointmentId: appointmentData.appointmentId,
    consultationFee: appointmentData.amount || 0,
    total: appointmentData.amount || 0,
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
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  {appointmentData.doctor?.name?.charAt(0).toUpperCase() || 'D'}
                </div>
              </div>
            </div>

            <div className="kav-appointment-details">
              <h4 className="kav-total-amount">
                LKR {appointmentDetails.total}
              </h4>
              <div className="kav-detail-row">
                <span className="kav-detail-label">Doctor</span>
                <span className="kav-detail-value">
                  {appointmentDetails.doctor}
                </span>
              </div>
              <div className="kav-detail-row">
                <span className="kav-detail-label">Specialty</span>
                <span className="kav-detail-value">
                  {appointmentDetails.specialty}
                </span>
              </div>
              <div className="kav-detail-row">
                <span className="kav-detail-label">Appointment Date</span>
                <span className="kav-detail-value">
                  {appointmentDetails.date}
                </span>
              </div>
              <div className="kav-detail-row">
                <span className="kav-detail-label">Service</span>
                <span className="kav-detail-value">
                  {appointmentDetails.service}
                </span>
              </div>
              <div className="kav-detail-row">
                <span className="kav-detail-label">Appointment ID</span>
                <span className="kav-detail-value" style={{ fontSize: '11px' }}>
                  {appointmentDetails.appointmentId?.substring(0, 12)}...
                </span>
              </div>
              <div className="kav-detail-row" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '12px' }}>
                <span className="kav-detail-label" style={{ fontWeight: 'bold' }}>Total Amount</span>
                <span className="kav-detail-value success" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  LKR {appointmentDetails.total}
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
                  <span className="value">LKR {paymentResult.amount.toFixed(2)}</span>
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
