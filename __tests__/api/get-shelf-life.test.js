/**
 * API Integration Tests for /api/get-shelf-life
 * Tests single item and batch processing
 */

describe('API: /api/get-shelf-life', () => {
  beforeEach(() => {
    // Reset fetch mock
    global.fetch.mockClear()
  })

  describe('Single Item Processing', () => {
    it('returns shelf life data for a single item', async () => {
      // Mock API response
      const mockResponse = {
        name: 'Milk',
        category: 'Dairy',
        estimatedShelfLife: 7,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        storageRecommendations: 'Store in refrigerator at 40°F or below',
        aiConfidence: 'high'
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const response = await fetch('/api/get-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: 'Milk' })
      })

      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.name).toBe('Milk')
      expect(data.category).toBe('Dairy')
      expect(data.estimatedShelfLife).toBe(7)
      expect(data.storageRecommendations).toBeDefined()
    })

    it('handles empty item name', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Item name is required' })
      })

      const response = await fetch('/api/get-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: '' })
      })

      expect(response.ok).toBe(false)
      expect(response.status).toBe(400)
    })

    it('handles API errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('API Error'))

      await expect(
        fetch('/api/get-shelf-life', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemName: 'Milk' })
        })
      ).rejects.toThrow('API Error')
    })
  })

  describe('Batch Processing', () => {
    it('returns shelf life data for multiple items', async () => {
      const mockResponse = {
        items: [
          {
            name: 'Milk',
            category: 'Dairy',
            estimatedShelfLife: 7,
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          {
            name: 'Strawberries',
            category: 'Fruits & Vegetables',
            estimatedShelfLife: 5,
            expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        ]
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const response = await fetch('/api/get-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemNames: ['Milk', 'Strawberries'] })
      })

      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.items).toHaveLength(2)
      expect(data.items[0].name).toBe('Milk')
      expect(data.items[1].name).toBe('Strawberries')
    })

    it('handles empty batch array', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'At least one item is required' })
      })

      const response = await fetch('/api/get-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemNames: [] })
      })

      expect(response.ok).toBe(false)
      expect(response.status).toBe(400)
    })
  })

  describe('Request Validation', () => {
    it('rejects requests without required fields', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Either itemName or itemNames is required' })
      })

      const response = await fetch('/api/get-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      expect(response.ok).toBe(false)
      expect(response.status).toBe(400)
    })

    it('validates content-type header', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 415,
        json: async () => ({ error: 'Content-Type must be application/json' })
      })

      const response = await fetch('/api/get-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: 'Milk'
      })

      expect(response.ok).toBe(false)
    })
  })
})
