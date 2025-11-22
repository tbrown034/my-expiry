import { calculateDaysUntilExpiry, getExpiryStatus, formatDate } from '../../lib/utils'

describe('Utility Functions', () => {
  describe('calculateDaysUntilExpiry', () => {
    it('calculates days correctly for future date', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      const dateString = futureDate.toISOString().split('T')[0]

      const days = calculateDaysUntilExpiry(dateString)
      expect(days).toBe(7)
    })

    it('returns negative number for past date', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 3)
      const dateString = pastDate.toISOString().split('T')[0]

      const days = calculateDaysUntilExpiry(dateString)
      expect(days).toBe(-3)
    })

    it('returns 0 or -0 for today', () => {
      const today = new Date().toISOString().split('T')[0]
      const days = calculateDaysUntilExpiry(today)
      // Math.ceil can return -0 or 0 depending on time of day
      expect(Math.abs(days)).toBe(0)
    })

    it('handles invalid date', () => {
      const days = calculateDaysUntilExpiry('invalid-date')
      expect(isNaN(days)).toBe(true)
    })
  })

  describe('getExpiryStatus', () => {
    it('returns "fresh" for items with more than 3 days', () => {
      expect(getExpiryStatus(7)).toBe('fresh')
      expect(getExpiryStatus(4)).toBe('fresh')
    })

    it('returns "expiring_soon" for items with 0-3 days', () => {
      expect(getExpiryStatus(3)).toBe('expiring_soon')
      expect(getExpiryStatus(2)).toBe('expiring_soon')
      expect(getExpiryStatus(1)).toBe('expiring_soon')
      expect(getExpiryStatus(0)).toBe('expiring_soon') // Today is still usable
    })

    it('returns "expired" for items past expiry', () => {
      expect(getExpiryStatus(-1)).toBe('expired')
      expect(getExpiryStatus(-5)).toBe('expired')
      expect(getExpiryStatus(-10)).toBe('expired')
    })

    it('handles edge cases with unexpected values', () => {
      // Edge cases: null/undefined/NaN don't match < 0 or <= 3 conditions
      // so they fall through to the default 'fresh' return
      expect(getExpiryStatus(null)).toBe('expiring_soon') // null <= 3 is true
      expect(getExpiryStatus(undefined)).toBe('fresh') // undefined comparisons are false
      expect(getExpiryStatus(NaN)).toBe('fresh') // NaN comparisons are false
    })
  })

  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const dateString = '2025-11-17'
      const formatted = formatDate(dateString)

      // Should return a readable date format
      expect(formatted).toBeDefined()
      expect(typeof formatted).toBe('string')
      expect(formatted.length).toBeGreaterThan(0)
    })

    it('handles different date formats', () => {
      const date1 = formatDate('2025-11-17')
      const date2 = formatDate('2025-01-05')

      expect(date1).toBeDefined()
      expect(date2).toBeDefined()
      expect(date1).not.toBe(date2)
    })
  })

  describe('Integration: Days and Status', () => {
    it('correctly pairs days calculation with status', () => {
      // Fresh item
      const freshDate = new Date()
      freshDate.setDate(freshDate.getDate() + 7)
      const freshDateString = freshDate.toISOString().split('T')[0]
      const freshDays = calculateDaysUntilExpiry(freshDateString)
      const freshStatus = getExpiryStatus(freshDays)

      expect(freshDays).toBe(7)
      expect(freshStatus).toBe('fresh')

      // Expiring soon item
      const soonDate = new Date()
      soonDate.setDate(soonDate.getDate() + 2)
      const soonDateString = soonDate.toISOString().split('T')[0]
      const soonDays = calculateDaysUntilExpiry(soonDateString)
      const soonStatus = getExpiryStatus(soonDays)

      expect(soonDays).toBe(2)
      expect(soonStatus).toBe('expiring_soon')

      // Expired item
      const expiredDate = new Date()
      expiredDate.setDate(expiredDate.getDate() - 1)
      const expiredDateString = expiredDate.toISOString().split('T')[0]
      const expiredDays = calculateDaysUntilExpiry(expiredDateString)
      const expiredStatus = getExpiryStatus(expiredDays)

      expect(expiredDays).toBeLessThan(0) // Can be -1 or less
      expect(expiredStatus).toBe('expired')
    })
  })
})
