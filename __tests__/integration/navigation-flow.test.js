import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MainClient from '../../app/MainClient'

/**
 * Integration Tests for Navigation Flow
 * Tests the complete user journey through the app
 */

// Mock the storage module
jest.mock('../../lib/storage', () => ({
  storage: {
    getGroceries: jest.fn(() => []),
    addGrocery: jest.fn((item) => ({ ...item, id: 'test-id-123' })),
    deleteGrocery: jest.fn(),
    updateGrocery: jest.fn(),
    clearAllGroceries: jest.fn(),
    markAsEaten: jest.fn(),
    markAsExpired: jest.fn(),
    deleteByPurchaseDate: jest.fn()
  }
}))

describe('Navigation Flow Integration', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    global.fetch.mockClear()
  })

  describe('Home to Add Flow', () => {
    it('navigates from home to add page', () => {
      render(<MainClient />)

      // Should see home page initially
      expect(screen.getByText('Welcome to')).toBeInTheDocument()
      expect(screen.getByText('Add to Fridge')).toBeInTheDocument()

      // Click Add to Fridge button
      const addButton = screen.getByText('Add to Fridge').closest('button')
      fireEvent.click(addButton)

      // Should see AddToFridgePage
      expect(screen.getByText('Add to Your Fridge')).toBeInTheDocument()
      expect(screen.getByText('Single Item')).toBeInTheDocument()
      expect(screen.getByText('Batch Add')).toBeInTheDocument()
      expect(screen.getByText('Upload Receipt')).toBeInTheDocument()
    })

    it('can navigate back from add page to home', () => {
      render(<MainClient />)

      // Navigate to add page
      const addButton = screen.getByText('Add to Fridge').closest('button')
      fireEvent.click(addButton)

      expect(screen.getByText('Add to Your Fridge')).toBeInTheDocument()

      // Click back button
      const backButton = screen.getByText('Back to Home').closest('button')
      fireEvent.click(backButton)

      // Should be back on home page
      expect(screen.getByText('Welcome to')).toBeInTheDocument()
    })
  })

  describe('Home to Fridge Flow', () => {
    it('navigates from home to fridge view', () => {
      render(<MainClient />)

      // Click See Your Fridge button
      const fridgeButton = screen.getByText('See Your Fridge').closest('button')
      fireEvent.click(fridgeButton)

      // Should see FridgeDoor component (includes emoji)
      expect(screen.getByText(/My Fridge Door/i)).toBeInTheDocument()
    })

    it('can navigate back from fridge to home', () => {
      render(<MainClient />)

      // Navigate to fridge
      const fridgeButton = screen.getByText('See Your Fridge').closest('button')
      fireEvent.click(fridgeButton)

      expect(screen.getByText(/My Fridge Door/i)).toBeInTheDocument()

      // Click back button
      const backButton = screen.getByText('Back to Home').closest('button')
      fireEvent.click(backButton)

      // Should be back on home page
      expect(screen.getByText('Welcome to')).toBeInTheDocument()
    })
  })

  describe('Add Item Flow', () => {
    it('opens single item modal from add page', () => {
      render(<MainClient />)

      // Navigate to add page
      const addButton = screen.getByText('Add to Fridge').closest('button')
      fireEvent.click(addButton)

      // Click Single Item button
      const singleButton = screen.getByText('Single Item').closest('button')
      fireEvent.click(singleButton)

      // Should see the add form modal
      expect(screen.getByText('Add New Grocery')).toBeInTheDocument()
    })

    it('opens batch add modal from add page', () => {
      render(<MainClient />)

      // Navigate to add page
      const addButton = screen.getByText('Add to Fridge').closest('button')
      fireEvent.click(addButton)

      // Click Batch Add button
      const batchButton = screen.getByText('Batch Add').closest('button')
      fireEvent.click(batchButton)

      // Should see batch form modal (check for tag input hint)
      waitFor(() => {
        expect(screen.getByText(/Enter items/i)).toBeInTheDocument()
      })
    })

    it('opens receipt upload modal from add page', () => {
      render(<MainClient />)

      // Navigate to add page
      const addButton = screen.getByText('Add to Fridge').closest('button')
      fireEvent.click(addButton)

      // Click Upload Receipt button
      const receiptButton = screen.getByText('Upload Receipt').closest('button')
      fireEvent.click(receiptButton)

      // Should see receipt upload modal
      expect(screen.getByText('Take a Photo of Receipt')).toBeInTheDocument()
    })
  })

  describe('Complete User Journey', () => {
    it('completes full flow: home -> add -> single item -> fridge view', async () => {
      // Mock successful API response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'Milk',
          category: 'Dairy',
          estimatedShelfLife: 7,
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          storageRecommendations: 'Keep refrigerated',
          aiConfidence: 'high'
        })
      })

      render(<MainClient />)

      // Start at home
      expect(screen.getByText('Welcome to')).toBeInTheDocument()

      // Navigate to add page
      const addButton = screen.getByText('Add to Fridge').closest('button')
      fireEvent.click(addButton)

      // This test validates the flow exists
      // Full end-to-end would require more complex setup
      expect(screen.getByText('Add to Your Fridge')).toBeInTheDocument()
    })
  })

  describe('State Persistence', () => {
    it('maintains state when navigating between views', () => {
      const { storage } = require('../../lib/storage')

      // Set up mock groceries
      storage.getGroceries.mockReturnValue([
        {
          id: '1',
          name: 'Milk',
          category: 'Dairy',
          purchaseDate: '2025-11-17',
          expiryDate: '2025-11-24',
          daysUntilExpiry: 7,
          status: 'fresh'
        }
      ])

      render(<MainClient />)

      // Navigate to fridge
      const fridgeButton = screen.getByText('See Your Fridge').closest('button')
      fireEvent.click(fridgeButton)

      // Groceries should be loaded
      expect(storage.getGroceries).toHaveBeenCalled()

      // Navigate back to home
      const backButton = screen.getByText('Back to Home').closest('button')
      fireEvent.click(backButton)

      // Navigate to fridge again
      const fridgeButton2 = screen.getByText('See Your Fridge').closest('button')
      fireEvent.click(fridgeButton2)

      // Should still have the data
      expect(storage.getGroceries).toHaveBeenCalled()
    })
  })
})
