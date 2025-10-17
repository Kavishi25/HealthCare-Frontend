const API_BASE_URL = 'http://localhost:5000/api';

class PaymentService {
  /**
   * Create a new payment
   */
  static async createPayment(paymentData) {
    try {
      console.log('💳 Creating payment:', paymentData);
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('❌ Payment creation failed:', {
          status: response.status,
          statusText: response.statusText,
          result: result
        });
        const error = new Error(result.message || 'Failed to create payment');
        error.errors = result.errors; // Preserve validation errors
        error.result = result; // Preserve full result
        throw error;
      }

      console.log('✅ Payment created successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error creating payment:', error);
      throw error;
    }
  }

  /**
   * Get payment by ID
   */
  static async getPaymentById(paymentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch payment');
      }

      return result;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  /**
   * Get payment by transaction ID
   */
  static async getPaymentByTransactionId(transactionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/transaction/${transactionId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch payment');
      }

      return result;
    } catch (error) {
      console.error('Error fetching payment by transaction ID:', error);
      throw error;
    }
  }

  /**
   * Get user payments
   */
  static async getUserPayments(userId = null, options = {}) {
    try {
      let url = `${API_BASE_URL}/payments?`;
      const params = new URLSearchParams();
      
      if (userId) params.append('userId', userId);
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      if (options.paymentType) params.append('paymentType', options.paymentType);
      if (options.status) params.append('status', options.status);
      
      url += params.toString();

      const response = await fetch(url);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch payments');
      }

      return result;
    } catch (error) {
      console.error('Error fetching user payments:', error);
      throw error;
    }
  }

  /**
   * Get payment statistics
   */
  static async getPaymentStats(userId = null, dateRange = null) {
    try {
      let url = `${API_BASE_URL}/payments/stats?`;
      const params = new URLSearchParams();
      
      if (userId) params.append('userId', userId);
      if (dateRange?.start) params.append('startDate', dateRange.start);
      if (dateRange?.end) params.append('endDate', dateRange.end);
      
      url += params.toString();

      const response = await fetch(url);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch payment stats');
      }

      return result;
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  }
}

export default PaymentService;
