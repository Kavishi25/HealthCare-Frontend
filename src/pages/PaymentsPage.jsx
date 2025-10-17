import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import PaymentService from '../services/paymentService';
import '../styles/PaymentsPage.css';

/**
 * PaymentsPage Component
 * Displays all user payments in a professional table view
 */
const PaymentsPage = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Get user ID from localStorage (can also try 'patientId' for compatibility)
  const userId = localStorage.getItem('userId') || localStorage.getItem('patientId') || null;

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching payments for user:', userId);
      
      // Fetch real payments from the API
      const response = await PaymentService.getUserPayments(userId, {
        limit: 100, // Get up to 100 payments
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      console.log('✅ Payments fetched:', response);
      
      if (response.success && response.data) {
        const paymentsData = response.data.payments || [];
        setPayments(paymentsData);
        console.log(`📊 Loaded ${paymentsData.length} payments`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('❌ Error loading payments:', err);
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  // Filter payments by status
  const getFilteredPayments = () => {
    let filtered = payments;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }
    
    // Sort payments
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  };

  const filteredPayments = getFilteredPayments();

  // Calculate statistics
  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalAmount: payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0),
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      completed: 'status-completed',
      pending: 'status-pending',
      processing: 'status-processing',
      failed: 'status-failed',
      cancelled: 'status-cancelled',
      refunded: 'status-refunded',
    };
    return statusMap[status] || 'status-default';
  };

  // Get payment type icon
  const getPaymentTypeIcon = (type) => {
    const icons = {
      card: '💳',
      insurance: '🏥',
      cash: '💵',
    };
    return icons[type] || '💰';
  };

  return (
    <div className="kara-payments-page">
      <div className="kara-payments-container">
        {/* Page Header */}
        <div className="kara-payments-header">
          <button className="kara-back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="kara-header-content">
            <div className="kara-header-badge">Payment History</div>
            
          </div>
        </div>

        {/* Statistics Cards */}
        {!loading && !error && payments.length > 0 && (
          <div className="kara-stats-section">
            <div className="kara-stat-card kara-stat-total">
              <div className="kara-stat-icon-wrapper">
                <span className="kara-stat-icon">💰</span>
              </div>
              <div className="kara-stat-content">
                <div className="kara-stat-label">Total Paid</div>
                <div className="kara-stat-value">LKR {stats.totalAmount.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="kara-stat-card kara-stat-completed">
              <div className="kara-stat-icon-wrapper">
                <span className="kara-stat-icon">✓</span>
              </div>
              <div className="kara-stat-content">
                <div className="kara-stat-label">Completed</div>
                <div className="kara-stat-value">{stats.completed}</div>
              </div>
            </div>
            
            <div className="kara-stat-card kara-stat-pending">
              <div className="kara-stat-icon-wrapper">
                <span className="kara-stat-icon">⏳</span>
              </div>
              <div className="kara-stat-content">
                <div className="kara-stat-label">Pending</div>
                <div className="kara-stat-value">{stats.pending}</div>
              </div>
            </div>
            
            <div className="kara-stat-card kara-stat-all">
              <div className="kara-stat-icon-wrapper">
                <span className="kara-stat-icon">📊</span>
              </div>
              <div className="kara-stat-content">
                <div className="kara-stat-label">Total Transactions</div>
                <div className="kara-stat-value">{stats.total}</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        {!loading && !error && payments.length > 0 && (
          <div className="kara-controls-section">
            <div className="kara-filters">
              <button
                className={`kara-filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button
                className={`kara-filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </button>
              <button
                className={`kara-filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pending')}
              >
                Pending
              </button>
              <button
                className={`kara-filter-btn ${filterStatus === 'failed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('failed')}
              >
                Failed
              </button>
            </div>

            <div className="kara-sort-controls">
              <select 
                className="kara-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="status">Sort by Status</option>
              </select>
              <button
                className="kara-sort-order-btn"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="kara-loading-wrapper">
            <LoadingSpinner message="Loading payments..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="kara-error-wrapper">
            <ErrorMessage message={error} onRetry={loadPayments} />
          </div>
        )}

        {/* Payments Table */}
        {!loading && !error && filteredPayments.length > 0 && (
          <div className="kara-table-container">
            <div className="kara-table-wrapper">
              <table className="kara-payments-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Type</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td>
                        <div className="kara-transaction-id">
                          <span className="kara-id-icon">🔖</span>
                          <span className="kara-id-text">{payment.transactionId}</span>
                        </div>
                      </td>
                      <td>
                        <div className="kara-payment-type">
                          <span className="kara-type-icon">{getPaymentTypeIcon(payment.paymentType)}</span>
                          <span className="kara-type-text">{payment.paymentType.toUpperCase()}</span>
                        </div>
                      </td>
                      <td>
                        <span className="kara-payment-method">{payment.paymentMethodSummary}</span>
                      </td>
                      <td>
                        <div className="kara-amount">
                          <span className="kara-currency">{payment.currency}</span>
                          <span className="kara-amount-value">{payment.amount.toLocaleString()}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`kara-status-badge ${getStatusBadgeClass(payment.status)}`}>
                          {payment.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className="kara-date">{formatDate(payment.createdAt)}</span>
                      </td>
                      <td>
                        <button className="kara-view-btn" title="View Details">
                          👁️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && payments.length === 0 && (
          <div className="kara-empty-state">
            <div className="kara-empty-icon">💳</div>
            <h2 className="kara-empty-title">No Payments Yet</h2>
            <p className="kara-empty-text">
              You haven't made any payments yet. Book an appointment to get started.
            </p>
            <button className="kara-empty-action-btn" onClick={() => navigate('/doctors')}>
              Book Appointment
            </button>
          </div>
        )}

        {/* Empty Filter State */}
        {!loading && !error && payments.length > 0 && filteredPayments.length === 0 && (
          <div className="kara-empty-state">
            <div className="kara-empty-icon">🔍</div>
            <h2 className="kara-empty-title">No Payments Found</h2>
            <p className="kara-empty-text">
              No payments match the selected filter.
            </p>
            <button className="kara-empty-action-btn" onClick={() => setFilterStatus('all')}>
              View All Payments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;

