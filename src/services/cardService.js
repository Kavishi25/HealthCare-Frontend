const API_BASE_URL = 'http://localhost:5000/api';

class CardService {
  /**
   * Create a new card
   */
  static async createCard(cardData) {
    try {
      const response = await fetch(`${API_BASE_URL}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        // Log the full response for debugging
        console.error('Card creation failed:', {
          status: response.status,
          statusText: response.statusText,
          result: result
        });
        throw new Error(result.message || 'Failed to create card');
      }

      return result;
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  }

  /**
   * Get all cards for a user
   */
  static async getUserCards(userId = null, page = 1, limit = 10) {
    try {
      let url = `${API_BASE_URL}/cards?page=${page}&limit=${limit}`;
      if (userId) {
        url += `&userId=${userId}`;
      }

      console.log('🌐 Making API request to:', url);
      const response = await fetch(url);
      console.log('📡 Response status:', response.status, response.statusText);
      
      const result = await response.json();
      console.log('📄 Response data:', result);
      
      if (!response.ok) {
        console.error('❌ API request failed:', {
          status: response.status,
          statusText: response.statusText,
          result: result
        });
        throw new Error(result.message || 'Failed to fetch cards');
      }

      return result;
    } catch (error) {
      console.error('❌ Error fetching cards:', error);
      throw error;
    }
  }

  /**
   * Get a specific card by ID
   */
  static async getCardById(cardId, userId = null) {
    try {
      let url = `${API_BASE_URL}/cards/${cardId}`;
      if (userId) {
        url += `?userId=${userId}`;
      }

      const response = await fetch(url);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch card');
      }

      return result;
    } catch (error) {
      console.error('Error fetching card:', error);
      throw error;
    }
  }

  /**
   * Update a card
   */
  static async updateCard(cardId, updateData, userId = null) {
    try {
      let url = `${API_BASE_URL}/cards/${cardId}`;
      if (userId) {
        updateData.userId = userId;
      }

      console.log('🔄 Updating card:', { cardId, updateData, url });
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log('📡 Update response status:', response.status);
      const result = await response.json();
      console.log('📄 Update response data:', result);
      
      if (!response.ok) {
        console.error('❌ Update failed:', { status: response.status, result });
        throw new Error(result.message || 'Failed to update card');
      }

      return result;
    } catch (error) {
      console.error('❌ Error updating card:', error);
      throw error;
    }
  }

  /**
   * Delete a card (soft delete)
   */
  static async deleteCard(cardId, userId = null) {
    try {
      let url = `${API_BASE_URL}/cards/${cardId}`;
      if (userId) {
        url += `?userId=${userId}`;
      }

      console.log('🗑️ Deleting card:', { cardId, url });
      const response = await fetch(url, {
        method: 'DELETE',
      });

      console.log('📡 Delete response status:', response.status);
      const result = await response.json();
      console.log('📄 Delete response data:', result);
      
      if (!response.ok) {
        console.error('❌ Delete failed:', { status: response.status, result });
        throw new Error(result.message || 'Failed to delete card');
      }

      return result;
    } catch (error) {
      console.error('❌ Error deleting card:', error);
      throw error;
    }
  }

  /**
   * Set a card as default
   */
  static async setDefaultCard(cardId, userId = null) {
    try {
      let url = `${API_BASE_URL}/cards/${cardId}/default`;
      const body = {};
      if (userId) {
        body.userId = userId;
      }

      console.log('⭐ Setting default card:', { cardId, url, body });
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('📡 Set default response status:', response.status);
      const result = await response.json();
      console.log('📄 Set default response data:', result);
      
      if (!response.ok) {
        console.error('❌ Set default failed:', { status: response.status, result });
        throw new Error(result.message || 'Failed to set default card');
      }

      return result;
    } catch (error) {
      console.error('❌ Error setting default card:', error);
      throw error;
    }
  }

  /**
   * Validate card details
   */
  static async validateCard(cardData) {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to validate card');
      }

      return result;
    } catch (error) {
      console.error('Error validating card:', error);
      throw error;
    }
  }
}

export default CardService;
