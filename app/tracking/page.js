"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Category } from "@/lib/types"
import { ButtonSpinner } from "../components/LoadingSpinner"

// Helper functions
const calculateDaysUntilExpiry = (expiryDate) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getExpiryStatus = (daysUntilExpiry) => {
  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry === 0) return 'expires-today'
  if (daysUntilExpiry <= 3) return 'expiring-soon'
  return 'fresh'
}

export default function TrackingPage() {
  const [showBenefits, setShowBenefits] = useState(true)
  const [groceries, setGroceries] = useState([])
  const [activities, setActivities] = useState([])
  const [archivedItems, setArchivedItems] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBatchModal, setShowBatchModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isLoadingShelfLife, setIsLoadingShelfLife] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [infoItem, setInfoItem] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingAIResult, setPendingAIResult] = useState(null)
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [aiConfirmLeftover, setAiConfirmLeftover] = useState(false)
  const [showBatchConfirmModal, setShowBatchConfirmModal] = useState(false)
  const [pendingBatchResults, setPendingBatchResults] = useState(null)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    modifier: '',
    category: Category.OTHER,
    expiryDate: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    addedManually: true,
    shelfLifeDays: null,
    isLeftover: false
  })
  const [useAI, setUseAI] = useState(true)
  const [batchItems, setBatchItems] = useState([])
  const [currentBatchInput, setCurrentBatchInput] = useState('')
  const [showDataInfoModal, setShowDataInfoModal] = useState(false)
  
  // Grocery list filtering and sorting
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('daysRemaining')

  // Calculate stats
  const stats = {
    total: groceries.length,
    fresh: groceries.filter(g => g.status === 'fresh').length,
    expiringSoon: groceries.filter(g => g.status === 'expiring-soon' || g.status === 'expires-today').length,
    expired: groceries.filter(g => g.status === 'expired').length
  }

  // Load data from localStorage
  useEffect(() => {
    const storedGroceries = JSON.parse(localStorage.getItem('groceries') || '[]')
    const storedActivities = JSON.parse(localStorage.getItem('activities') || '[]')
    const storedArchived = JSON.parse(localStorage.getItem('archivedItems') || '[]')
    
    // Update status for each grocery
    const updatedGroceries = storedGroceries.map(item => ({
      ...item,
      daysUntilExpiry: calculateDaysUntilExpiry(item.expiryDate),
      status: getExpiryStatus(calculateDaysUntilExpiry(item.expiryDate))
    }))
    
    setGroceries(updatedGroceries)
    setActivities(storedActivities)
    setArchivedItems(storedArchived)

    // Check if user has previously closed benefits
    const hideBenefits = localStorage.getItem('hideBenefits')
    if (hideBenefits === 'true') {
      setShowBenefits(false)
    }

    // Check for quick answer item from landing page
    const quickAnswerItem = localStorage.getItem('quickAnswerItem')
    if (quickAnswerItem) {
      const item = JSON.parse(quickAnswerItem)
      const newGrocery = {
        id: Date.now().toString(),
        ...item,
        addedDate: new Date().toISOString(),
        daysUntilExpiry: calculateDaysUntilExpiry(item.expiryDate),
        status: getExpiryStatus(calculateDaysUntilExpiry(item.expiryDate))
      }
      
      const allGroceries = [...updatedGroceries, newGrocery]
      const newActivity = {
        id: Date.now().toString(),
        action: 'Added',
        item: newGrocery.name,
        time: new Date().toISOString(),
        type: 'added'
      }
      const allActivities = [newActivity, ...storedActivities].slice(0, 50)
      
      setGroceries(allGroceries)
      setActivities(allActivities)
      localStorage.setItem('groceries', JSON.stringify(allGroceries))
      localStorage.setItem('activities', JSON.stringify(allActivities))
      localStorage.removeItem('quickAnswerItem')
    }
  }, [])

  // Save data to localStorage whenever it changes
  const saveToLocalStorage = (newGroceries, newActivities, newArchived = archivedItems) => {
    localStorage.setItem('groceries', JSON.stringify(newGroceries))
    localStorage.setItem('activities', JSON.stringify(newActivities))
    localStorage.setItem('archivedItems', JSON.stringify(newArchived))
  }

  const handleCloseBenefits = () => {
    setShowBenefits(false)
    localStorage.setItem('hideBenefits', 'true')
  }

  const addActivity = (action, item) => {
    const newActivity = {
      id: Date.now().toString(),
      action,
      item: item.name || item,
      time: new Date().toISOString(),
      type: action.toLowerCase()
    }
    const updatedActivities = [newActivity, ...activities].slice(0, 50) // Keep last 50 activities
    setActivities(updatedActivities)
    return updatedActivities
  }

  const handleAddGrocery = async (itemData) => {
    const newGrocery = {
      id: Date.now().toString(),
      ...itemData,
      addedDate: new Date().toISOString(),
      daysUntilExpiry: calculateDaysUntilExpiry(itemData.expiryDate),
      status: getExpiryStatus(calculateDaysUntilExpiry(itemData.expiryDate))
    }
    
    const updatedGroceries = [...groceries, newGrocery]
    const updatedActivities = addActivity('Added', newGrocery)
    
    setGroceries(updatedGroceries)
    saveToLocalStorage(updatedGroceries, updatedActivities)
    
    // Reset form
    setFormData({
      name: '',
      category: Category.OTHER,
      expiryDate: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      addedManually: true,
      shelfLifeDays: null,
      isLeftover: false
    })
    setShowAddModal(false)
  }

  const handleAddWithAI = async (itemName) => {
    setIsLoadingShelfLife(true)
    try {
      const response = await fetch('/api/get-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName })
      })

      if (!response.ok) throw new Error('Failed to get shelf life')
      
      const result = await response.json()
      
      // Show confirmation modal with AI result
      setPendingAIResult({
        ...result,
        originalInput: itemName,
        purchaseDate: new Date().toISOString().split('T')[0]
      })
      setShowConfirmModal(true)
      setShowAddModal(false)
    } catch (error) {
      console.error('Error getting shelf life:', error)
      alert('Could not get shelf life information. Please try manual entry.')
    } finally {
      setIsLoadingShelfLife(false)
    }
  }

  const handleUpdateAIWithDetails = async () => {
    if (!pendingAIResult || !additionalDetails.trim()) return
    
    setIsLoadingShelfLife(true)
    try {
      const enhancedQuery = `${additionalDetails.trim()} ${pendingAIResult.originalInput}`
      
      const response = await fetch('/api/get-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: enhancedQuery })
      })
      
      if (!response.ok) throw new Error('Failed to get enhanced shelf life')
      
      const result = await response.json()
      
      // Properly format the name with title case
      const formatName = (name) => {
        return name.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ')
      }
      
      // Update the pending AI result with the enhanced data and formatting
      setPendingAIResult({
        ...result,
        name: formatName(result.name),
        originalInput: pendingAIResult.originalInput, // Keep original input for reference
        enhancedQuery: enhancedQuery, // Store the enhanced query
        purchaseDate: new Date().toISOString().split('T')[0],
        isEnhanced: true, // Flag to show this was enhanced
        enhancementDetails: additionalDetails.trim() // Store what was added
      })
      
      // Clear the additional details since it's now incorporated
      setAdditionalDetails('')
      
    } catch (error) {
      console.error('Error getting enhanced shelf life:', error)
      alert('Could not get enhanced shelf life information. Please try again.')
    } finally {
      setIsLoadingShelfLife(false)
    }
  }
  
  const handleAcceptAI = () => {
    if (pendingAIResult) {
      const finalResult = {
        ...pendingAIResult,
        isLeftover: aiConfirmLeftover
      }
      
      handleAddGrocery(finalResult)
      setShowConfirmModal(false)
      setPendingAIResult(null)
      setAdditionalDetails('')
      setAiConfirmLeftover(false)
    }
  }

  const handleRejectAI = () => {
    setShowConfirmModal(false)
    setPendingAIResult(null)
    setAdditionalDetails('')
    setAiConfirmLeftover(false)
    // Return to manual entry
    setUseAI(false)
    setFormData({
      ...formData,
      name: pendingAIResult?.originalInput || '',
      modifier: '',
      category: Category.OTHER,
      isLeftover: false
    })
    setShowAddModal(true)
  }

  const handleEditAI = () => {
    // Populate form with AI data for editing
    setFormData({
      name: pendingAIResult?.name || '',
      modifier: pendingAIResult?.modifier || '',
      category: pendingAIResult?.category || Category.OTHER,
      expiryDate: pendingAIResult?.expiryDate || '',
      purchaseDate: pendingAIResult?.purchaseDate || new Date().toISOString().split('T')[0],
      shelfLifeDays: pendingAIResult?.shelfLifeDays || null,
      addedManually: false
    })
    setShowConfirmModal(false)
    setAdditionalDetails('')
    setAiConfirmLeftover(false)
    setShowEditModal(true)
    setEditingItem(pendingAIResult) // Use as temp holder
  }

  const handleBatchAdd = async () => {
    if (batchItems.length === 0) return

    setIsLoadingShelfLife(true)
    try {
      const response = await fetch('/api/get-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemNames: batchItems })
      })

      if (!response.ok) throw new Error('Failed to get shelf life')
      
      const results = await response.json()
      
      // Show batch confirmation modal
      setPendingBatchResults({
        ...results,
        items: results.items.map(item => ({
          ...item,
          purchaseDate: new Date().toISOString().split('T')[0],
          isLeftover: false // Default leftover to false
        }))
      })
      setShowBatchConfirmModal(true)
      setShowBatchModal(false)
    } catch (error) {
      console.error('Error getting batch shelf life:', error)
      alert('Could not get shelf life information. Please try again.')
    } finally {
      setIsLoadingShelfLife(false)
    }
  }

  // Helper functions for batch items
  const addBatchItem = (itemName) => {
    const trimmedItem = itemName.trim()
    if (trimmedItem && !batchItems.includes(trimmedItem)) {
      setBatchItems([...batchItems, trimmedItem])
      setCurrentBatchInput('')
    }
  }

  const removeBatchItem = (itemToRemove) => {
    setBatchItems(batchItems.filter(item => item !== itemToRemove))
  }

  const handleBatchInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      addBatchItem(currentBatchInput)
    } else if (e.key === 'Backspace' && currentBatchInput === '' && batchItems.length > 0) {
      // Remove last item if input is empty and backspace is pressed
      setBatchItems(batchItems.slice(0, -1))
    }
  }

  const handleBatchInputChange = (e) => {
    const value = e.target.value
    // If user types comma, auto-add the item
    if (value.includes(',')) {
      const items = value.split(',').map(item => item.trim()).filter(item => item)
      items.forEach(addBatchItem)
      setCurrentBatchInput('')
    } else {
      setCurrentBatchInput(value)
    }
  }

  const handleBatchItemAction = (index, action) => {
    if (!pendingBatchResults) return
    
    if (action === 'accept') {
      // Add this specific item to inventory
      const item = pendingBatchResults.items[index]
      const newGrocery = {
        id: Date.now().toString() + Math.random(),
        ...item,
        addedDate: new Date().toISOString(),
        daysUntilExpiry: calculateDaysUntilExpiry(item.expiryDate),
        status: getExpiryStatus(calculateDaysUntilExpiry(item.expiryDate))
      }
      
      const updatedGroceries = [...groceries, newGrocery]
      const updatedActivities = [
        {
          id: Date.now().toString() + Math.random(),
          action: 'Added',
          item: item.name,
          time: new Date().toISOString(),
          type: 'added'
        },
        ...activities
      ].slice(0, 50)
      
      setGroceries(updatedGroceries)
      setActivities(updatedActivities)
      saveToLocalStorage(updatedGroceries, updatedActivities)
      
      // Remove from pending list
      const updatedResults = {
        ...pendingBatchResults,
        items: pendingBatchResults.items.filter((_, i) => i !== index)
      }
      setPendingBatchResults(updatedResults)
      
      // If no items left, close the modal
      if (updatedResults.items.length === 0) {
        setShowBatchConfirmModal(false)
        setPendingBatchResults(null)
        setBatchItems([])
      }
    } else if (action === 'remove' || action === 'reject') {
      // Just remove the item from the list without adding to inventory
      const updatedResults = {
        ...pendingBatchResults,
        items: pendingBatchResults.items.filter((_, i) => i !== index)
      }
      setPendingBatchResults(updatedResults)
      
      // If no items left, close the modal
      if (updatedResults.items.length === 0) {
        setShowBatchConfirmModal(false)
        setPendingBatchResults(null)
        setBatchItems([])
      }
    }
  }

  const handleToggleBatchLeftover = (index) => {
    if (!pendingBatchResults) return
    
    const updatedResults = {
      ...pendingBatchResults,
      items: pendingBatchResults.items.map((item, i) => 
        i === index ? { ...item, isLeftover: !item.isLeftover } : item
      )
    }
    setPendingBatchResults(updatedResults)
  }

  const handleAcceptAllBatch = () => {
    if (!pendingBatchResults) return
    
    // Add all items to inventory
    const newGroceries = pendingBatchResults.items.map(item => ({
      id: Date.now().toString() + Math.random(),
      ...item,
      addedDate: new Date().toISOString(),
      daysUntilExpiry: calculateDaysUntilExpiry(item.expiryDate),
      status: getExpiryStatus(calculateDaysUntilExpiry(item.expiryDate))
    }))
    
    const updatedGroceries = [...groceries, ...newGroceries]
    let updatedActivities = activities
    
    newGroceries.forEach(item => {
      updatedActivities = [
        {
          id: Date.now().toString() + Math.random(),
          action: 'Added',
          item: item.name,
          time: new Date().toISOString(),
          type: 'added'
        },
        ...updatedActivities
      ].slice(0, 50)
    })
    
    setGroceries(updatedGroceries)
    setActivities(updatedActivities)
    saveToLocalStorage(updatedGroceries, updatedActivities)
    
    // Close modal and reset
    setShowBatchConfirmModal(false)
    setPendingBatchResults(null)
    setBatchItems([])
  }

  const handleRejectAllBatch = () => {
    if (!pendingBatchResults) return
    
    // Just close the modal without adding anything
    setShowBatchConfirmModal(false)
    setPendingBatchResults(null)
    setBatchItems([])
  }

  const handleEditBatchItem = (index) => {
    if (!pendingBatchResults) return
    
    const item = pendingBatchResults.items[index]
    setFormData({
      name: item.name,
      category: item.category,
      expiryDate: item.expiryDate,
      purchaseDate: item.purchaseDate,
      shelfLifeDays: item.shelfLifeDays,
      addedManually: false,
      isLeftover: item.isLeftover || false
    })
    setEditingItem({ ...item, batchIndex: index }) // Store batch index
    setShowBatchConfirmModal(false)
    setShowEditModal(true)
  }

  // Removed handleConfirmBatch - no longer needed as individual items are handled immediately


  const handleMarkAsEaten = (id) => {
    const item = groceries.find(g => g.id === id)
    if (!item) return
    
    const archivedItem = {
      ...item,
      archivedDate: new Date().toISOString(),
      archivedStatus: 'consumed'
    }
    
    const updatedGroceries = groceries.filter(g => g.id !== id)
    const updatedArchived = [archivedItem, ...archivedItems]
    const updatedActivities = addActivity('Consumed', item)
    
    setGroceries(updatedGroceries)
    setArchivedItems(updatedArchived)
    saveToLocalStorage(updatedGroceries, updatedActivities, updatedArchived)
  }

  const handleMarkAsWasted = (id) => {
    const item = groceries.find(g => g.id === id)
    if (!item) return
    
    const archivedItem = {
      ...item,
      archivedDate: new Date().toISOString(),
      archivedStatus: 'discarded'
    }
    
    const updatedGroceries = groceries.filter(g => g.id !== id)
    const updatedArchived = [archivedItem, ...archivedItems]
    const updatedActivities = addActivity('Wasted', item)
    
    setGroceries(updatedGroceries)
    setArchivedItems(updatedArchived)
    saveToLocalStorage(updatedGroceries, updatedActivities, updatedArchived)
  }

  const handleRemoveItem = (id) => {
    const item = groceries.find(g => g.id === id)
    if (!item) return
    
    const updatedGroceries = groceries.filter(g => g.id !== id)
    const updatedActivities = addActivity('Removed', item)
    
    setGroceries(updatedGroceries)
    saveToLocalStorage(updatedGroceries, updatedActivities)
  }

  const handleRemoveArchivedItem = (id) => {
    const updatedArchived = archivedItems.filter(item => item.id !== id)
    setArchivedItems(updatedArchived)
    saveToLocalStorage(groceries, activities, updatedArchived)
  }

  const handleRemoveAllArchived = () => {
    if (window.confirm('Are you sure you want to remove all archived items? This cannot be undone.')) {
      setArchivedItems([])
      saveToLocalStorage(groceries, activities, [])
    }
  }


  const handleEditItem = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      modifier: item.modifier || '',
      category: item.category || Category.OTHER,
      expiryDate: item.expiryDate,
      purchaseDate: item.purchaseDate || item.addedDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      addedManually: item.addedManually || false,
      shelfLifeDays: item.shelfLifeDays || null,
      isLeftover: item.isLeftover || false
    })
    setShowEditModal(true)
  }

  const handleUpdateItem = () => {
    if (!editingItem) return

    // Check if this is a batch item being edited
    if (editingItem.batchIndex !== undefined && pendingBatchResults) {
      // Update the batch item
      const updatedBatchResults = {
        ...pendingBatchResults,
        items: pendingBatchResults.items.map((item, i) => 
          i === editingItem.batchIndex ? { ...item, ...formData } : item
        )
      }
      setPendingBatchResults(updatedBatchResults)
      setShowEditModal(false)
      setShowBatchConfirmModal(true)
      setEditingItem(null)
      return
    }

    // Regular item update
    const updatedItem = {
      ...editingItem,
      ...formData,
      daysUntilExpiry: calculateDaysUntilExpiry(formData.expiryDate),
      status: getExpiryStatus(calculateDaysUntilExpiry(formData.expiryDate))
    }

    const updatedGroceries = groceries.map(g => 
      g.id === editingItem.id ? updatedItem : g
    )
    const updatedActivities = addActivity('Updated', updatedItem)

    setGroceries(updatedGroceries)
    saveToLocalStorage(updatedGroceries, updatedActivities)
    
    setShowEditModal(false)
    setEditingItem(null)
  }

  const handleShowInfo = (item) => {
    setInfoItem(item)
    setShowInfoModal(true)
  }

  const formatTimeAgo = (time) => {
    const now = new Date()
    const then = new Date(time)
    const diff = now - then
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  // Filter and sort groceries
  const getFilteredAndSortedGroceries = () => {
    let filtered = groceries

    // Filter by category
    if (activeTab !== 'all') {
      filtered = groceries.filter(item => item.category?.toLowerCase() === activeTab.toLowerCase())
    }

    // Sort groceries
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'daysRemaining':
          return a.daysUntilExpiry - b.daysUntilExpiry
        case 'datePurchased':
          const dateA = new Date(a.purchaseDate || a.addedDate)
          const dateB = new Date(b.purchaseDate || b.addedDate)
          return dateB - dateA // Most recent first
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return a.daysUntilExpiry - b.daysUntilExpiry
      }
    })

    return sorted
  }

  const uniqueCategories = [...new Set(groceries.map(item => item.category).filter(Boolean))]


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col gap-4 sm:gap-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex-1">
              <div className="mb-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Guest Tracking
                </h1>
                <p className="text-lg text-gray-600 font-medium">Track your groceries locally without an account</p>
              </div>
              {/* Mobile: Data stored locally under heading */}
              <button 
                onClick={() => setShowDataInfoModal(true)}
                className="flex items-center gap-2 mt-3 sm:hidden text-left hover:bg-gray-50 -mx-1 px-1 py-1 rounded transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-500 hover:text-gray-700">Data stored locally</span>
              </button>
            </div>
            {/* Desktop: Data stored locally on the right */}
            <button 
              onClick={() => setShowDataInfoModal(true)}
              className="hidden sm:flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
            >
              <span className="text-sm text-gray-500 hover:text-gray-700">Data stored locally</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          {/* Sign up benefits banner */}
          {showBenefits && (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6 mb-6 relative">
              <button
                onClick={handleCloseBenefits}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Unlock Full Features with an Account
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Sync across all devices</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Never lose your data</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    href="/auth/signin"
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg"
                  >
                    Sign Up Free
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Simple sign-up prompt */}
          <div className="text-center py-3 px-4 text-sm text-gray-600">
            <p className="mb-2"><strong>Tip:</strong> Create a free account to sync across devices and never lose your data.</p>
            <Link 
              href="/auth/signin" 
              className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
            >
              Sign up free
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>


        {/* Main Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Add Food Button */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-white/90 backdrop-blur-md shadow-xl rounded-3xl border border-green-100">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full p-6 sm:p-8 flex flex-col items-center gap-4 hover:bg-green-50/50 transition-all duration-300 rounded-3xl group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-3 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Add Food</h3>
                      <p className="text-gray-600">Quick add single items</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* More Options */}
              <div className="grid grid-cols-2 gap-4">
                {/* Batch Add */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                  <div className="relative bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100">
                    <button
                      onClick={() => setShowBatchModal(true)}
                      className="w-full p-6 flex flex-col items-center gap-3 hover:bg-blue-50/50 transition-all duration-300 rounded-2xl"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-gray-900">Batch Add</h4>
                        <p className="text-xs text-gray-600">Multiple items</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Upload Receipt */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                  <div className="relative bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-purple-100">
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="w-full p-6 flex flex-col items-center gap-3 hover:bg-purple-50/50 transition-all duration-300 rounded-2xl"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-gray-900">Upload</h4>
                        <p className="text-xs text-gray-600">Receipt photo</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="group relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Quick Overview</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="text-2xl font-bold text-green-600">{stats.total}</div>
                    <div className="text-xs text-gray-600 mt-1">Total Items</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">{stats.fresh}</div>
                    <div className="text-xs text-gray-600 mt-1">Fresh</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                    <div className="text-2xl font-bold text-amber-600">{stats.expiringSoon}</div>
                    <div className="text-xs text-gray-600 mt-1">Expiring Soon</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-100">
                    <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
                    <div className="text-xs text-gray-600 mt-1">Expired</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Food Inventory */}
            <div className="group relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Food Inventory</h3>
                    <p className="text-sm text-gray-600">{groceries.length} items tracked</p>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200 pb-4">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === 'all'
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All ({groceries.length})
                  </button>
                  {uniqueCategories.map((category) => {
                    const count = groceries.filter(item => item.category === category).length
                    return (
                      <button
                        key={category}
                        onClick={() => setActiveTab(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          activeTab === category
                            ? 'bg-emerald-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category} ({count})
                      </button>
                    )
                  })}
                </div>

                {/* Controls Row - Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="text-sm text-gray-600">
                    Showing {getFilteredAndSortedGroceries().length} items
                  </div>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-auto"
                    >
                      <option value="daysRemaining">Sort by: Days Remaining</option>
                      <option value="datePurchased">Sort by: Date Purchased</option>
                      <option value="name">Sort by: Name</option>
                    </select>
                    <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>


                {groceries.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                    {getFilteredAndSortedGroceries().map(item => {
                      const purchaseDate = new Date(item.purchaseDate || item.addedDate)
                      const isToday = purchaseDate.toDateString() === new Date().toDateString()
                      
                      return (
                        <div key={item.id} className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border border-gray-200">
                          {/* Status indicator - left border + corner accent */}
                          <div className={`absolute top-0 left-0 w-1 h-full ${
                            item.status === 'expired' ? 'bg-red-500' :
                            item.status === 'expires-today' ? 'bg-orange-500' :
                            item.status === 'expiring-soon' ? 'bg-amber-500' :
                            'bg-green-500'
                          }`}></div>
                          <div className={`absolute top-0 left-0 w-6 h-6 rounded-br-2xl ${
                            item.status === 'expired' ? 'bg-red-500' :
                            item.status === 'expires-today' ? 'bg-orange-500' :
                            item.status === 'expiring-soon' ? 'bg-amber-500' :
                            'bg-green-500'
                          } opacity-20`}></div>
                          
                          <div className="p-4 sm:p-6 pl-6 sm:pl-8 flex flex-col gap-4">
                            {/* Header with name, category, and action buttons - responsive */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                                  <div>
                                    <h4 className={`text-xl sm:text-2xl font-extrabold ${
                                      item.status === 'expired' ? 'text-red-600' :
                                      item.status === 'expires-today' ? 'text-orange-600' :
                                      item.status === 'expiring-soon' ? 'text-amber-600' :
                                      'text-emerald-700'
                                    }`}>{item.name}</h4>
                                    {item.modifier && (
                                      <p className="text-sm text-gray-600 mt-1 font-medium">
                                        {item.modifier}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleEditItem(item)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-all duration-200"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                  </button>
                                </div>
                                
                                <div className="flex flex-col gap-2 mb-3">
                                  <div className="flex items-center gap-2">
                                    {item.category && (
                                      <span className="px-3 py-1.5 text-sm rounded-lg font-medium bg-gray-100 text-gray-700">
                                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                      </span>
                                    )}
                                    {isToday && (
                                      <span className="px-3 py-1.5 text-sm bg-emerald-100 text-emerald-700 rounded-lg font-medium">
                                        New
                                      </span>
                                    )}
                                    {item.shelfLifeDays && (
                                      <button 
                                        onClick={() => handleShowInfo(item)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Storage Tips
                                      </button>
                                    )}
                                  </div>
                                  {item.isLeftover && (
                                    <div className="mt-2">
                                      <span className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-700 rounded-lg font-medium">
                                        Leftover
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Key metrics in sub-cards */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {/* Days Left */}
                              <div className="text-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div className={`text-xl font-bold ${
                                  item.daysUntilExpiry < 0 ? 'text-red-600' :
                                  item.daysUntilExpiry === 0 ? 'text-orange-600' :
                                  item.daysUntilExpiry <= 3 ? 'text-amber-600' :
                                  'text-green-600'
                                }`}>
                                  {item.daysUntilExpiry < 0 ? 
                                    `-${Math.abs(item.daysUntilExpiry)}` :
                                    item.daysUntilExpiry === 0 ? '0' :
                                    item.daysUntilExpiry
                                  }
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {item.daysUntilExpiry < 0 ? 'Days Expired' :
                                   item.daysUntilExpiry === 0 ? 'Expires Today' :
                                   'Days Left'
                                  }
                                </div>
                              </div>
                              
                              {/* Expiry Date */}
                              <div className="text-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-sm font-semibold text-gray-900">
                                  {new Date(item.expiryDate).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric'
                                  })}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Expires</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {/* Purchase Date */}
                              <div className="text-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-sm font-semibold text-gray-900">
                                  {new Date(item.purchaseDate || item.addedDate).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Purchased</div>
                              </div>
                              
                              {/* Shelf Life */}
                              {item.shelfLifeDays ? (
                                <div className="text-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                                  <div className="text-sm font-semibold text-gray-900">
                                    {item.shelfLifeDays} days
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">Shelf Life</div>
                                </div>
                              ) : (
                                <div></div>
                              )}
                            </div>

                            {/* Action buttons */}
                            <div className="grid grid-cols-3 gap-2 pt-2">
                              <button
                                onClick={() => handleMarkAsEaten(item.id)}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 bg-green-100 text-green-700 hover:bg-green-200"
                                title="Mark as eaten/consumed"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="hidden sm:inline">Consumed</span>
                              </button>
                              <button
                                onClick={() => handleMarkAsWasted(item.id)}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 bg-amber-100 text-amber-700 hover:bg-amber-200"
                                title="Mark as discarded/wasted"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span className="hidden sm:inline">Discarded</span>
                              </button>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 bg-red-100 text-red-700 hover:bg-red-200"
                                title="Remove from list"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="hidden sm:inline">Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Your inventory is empty</h4>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">Start tracking your food items to reduce waste and stay organized. Add your first item above!</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Your First Item
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  {activities.length > 0 ? activities.slice(0, 8).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-white/80 to-emerald-50/30 rounded-2xl border border-emerald-100/50 hover:shadow-md transition-all duration-200">
                      <div className={`w-4 h-4 rounded-full shadow-sm flex-shrink-0 ${
                        activity.type === 'added' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                        activity.type === 'consumed' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                        activity.type === 'wasted' ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                        activity.type === 'updated' ? 'bg-gradient-to-r from-purple-400 to-purple-500' :
                        activity.type === 'deleted' ? 'bg-gradient-to-r from-red-400 to-red-500' : 
                        'bg-gradient-to-r from-gray-400 to-gray-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          <span className={`${
                            activity.type === 'added' ? 'text-green-700' :
                            activity.type === 'consumed' ? 'text-blue-700' :
                            activity.type === 'wasted' ? 'text-amber-700' :
                            activity.type === 'updated' ? 'text-purple-700' :
                            activity.type === 'deleted' ? 'text-red-700' : 'text-gray-700'
                          }`}>
                            {activity.action}
                          </span> {activity.item}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{formatTimeAgo(activity.time)}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>No recent activity</p>
                      <p className="text-sm text-gray-400 mt-1">Start adding items to see your activity</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Archived Inventory */}
            <div className="group relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Archived Inventory</h3>
                      <p className="text-sm text-gray-600">{archivedItems.length} items completed</p>
                    </div>
                  </div>
                  {archivedItems.length > 0 && (
                    <button
                      onClick={() => handleRemoveAllArchived()}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all duration-200"
                    >
                      Remove All
                    </button>
                  )}
                </div>
                
                {archivedItems.length > 0 ? (
                  <div className="space-y-4">
                    {archivedItems.slice(0, 10).map(item => (
                      <div key={item.id} className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-md bg-gray-50 border border-gray-200">
                        {/* Status indicator */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${
                          item.archivedStatus === 'consumed' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        
                        <div className="p-4 flex flex-col gap-4">
                          {/* Item header - responsive */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <div>
                                <h4 className="font-bold text-gray-900">{item.name}</h4>
                                {item.modifier && (
                                  <p className="text-sm text-gray-600 mt-0.5 font-medium">{item.modifier}</p>
                                )}
                              </div>
                              <span className="px-2 py-1 text-xs rounded-full font-medium bg-gray-200 text-gray-700">
                                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                              </span>
                              {item.isLeftover && (
                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full font-medium">
                                  Leftover
                                </span>
                              )}
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                item.archivedStatus === 'consumed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {item.archivedStatus === 'consumed' ? 'Consumed' : 'Discarded'}
                              </span>
                            </div>
                            {/* Action buttons - stack on mobile */}
                            <div className="flex flex-wrap items-center gap-2">
                              {item.shelfLifeDays && (
                                <button 
                                  onClick={() => handleShowInfo(item)}
                                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-all duration-200"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Learn More
                                </button>
                              )}
                              <button
                                onClick={() => handleRemoveArchivedItem(item.id)}
                                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all duration-200"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>
                          
                          {/* Dates - responsive grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Bought:</span> {new Date(item.purchaseDate || item.addedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div>
                              <span className="font-medium">Expired:</span> {new Date(item.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div>
                              <span className="font-medium">Archived:</span> {new Date(item.archivedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No archived items yet</h4>
                    <p className="text-gray-500">Items you consume or discard will appear here</p>
                  </div>
                )}
              </div>
            </div>


            {/* Final CTA Section */}
            <div className="group relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Level Up?</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of users saving money and reducing food waste with premium features.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Newsletter</h4>
                    <p className="text-sm text-gray-600">Weekly tips & recipes</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Learn More</h4>
                    <p className="text-sm text-gray-600">About our mission</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Premium</h4>
                    <p className="text-sm text-gray-600">Advanced features</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
                  <Link 
                    href="/auth/signin" 
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg font-semibold text-base sm:text-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign Up for Benefits
                  </Link>
                  
                  <button 
                    onClick={() => alert('Coming soon! We\'ll be launching our newsletter with weekly tips and recipes to help reduce food waste.')}
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md font-semibold text-base sm:text-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Join Newsletter
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-2">Coming Soon</p>
                </div>
              </div>
            </div>

        {/* AI Confirmation Modal */}
        {showConfirmModal && pendingAIResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Confirm Our Suggestion</h2>
              
              <div className="mb-4">
                <div className="bg-gray-50 p-4 rounded-xl mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Your input:</span>
                        </p>
                        <p className="text-base font-medium text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                          &ldquo;{pendingAIResult.originalInput}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {pendingAIResult.isEnhanced && (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {pendingAIResult.isEnhanced ? 'Enhanced Suggestion' : 'Our Suggestion'}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 p-5 rounded-xl mb-6 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-600">Item Name</span>
                    <div>
                      <div>
                        <p className="text-gray-900 font-semibold text-lg">{pendingAIResult.name}</p>
                        {pendingAIResult.modifier && (
                          <p className="text-sm text-gray-600 mt-0.5 font-medium">
                            {pendingAIResult.modifier}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-600">Category</span>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-800">
                        {pendingAIResult.category.charAt(0).toUpperCase() + pendingAIResult.category.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-600">Estimated Shelf Life</span>
                    <div>
                      <p className="text-gray-900 font-semibold flex items-center gap-2 mb-2">
                        <span className="text-xl font-semibold text-emerald-600">{pendingAIResult.shelfLifeDays}</span>
                        <span className="text-gray-600 text-sm">days</span>
                      </p>
                      {pendingAIResult.shelfLifeDays && (
                        <button 
                          onClick={() => {
                            setInfoItem(pendingAIResult)
                            setShowInfoModal(true)
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all hover:shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Why {pendingAIResult.shelfLifeDays} days?
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-600">Expires On</span>
                    <p className="text-gray-900 font-semibold">
                      {new Date(pendingAIResult.expiryDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add more details (optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g., frozen, pulled, pot pie, organic..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && additionalDetails.trim()) {
                          handleUpdateAIWithDetails()
                        }
                      }}
                    />
                    <button
                      onClick={handleUpdateAIWithDetails}
                      disabled={!additionalDetails.trim() || isLoadingShelfLife}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoadingShelfLife ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Update
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Add descriptors like &ldquo;frozen&rdquo;, &ldquo;organic&rdquo;, or &ldquo;idaho&rdquo; and click Update for a more specific suggestion
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Leftovers</label>
                  <button
                    type="button"
                    onClick={() => setAiConfirmLeftover(!aiConfirmLeftover)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                      aiConfirmLeftover ? 'bg-yellow-500' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
                        aiConfirmLeftover ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleRejectAI}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Reject
                </button>
                <button
                  onClick={handleEditAI}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={handleAcceptAI}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                  Accept & Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Batch Confirmation Modal */}
        {showBatchConfirmModal && pendingBatchResults && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-5xl max-h-[85vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Review Batch Items</h2>
              
              <p className="text-sm text-gray-600 mb-4">
                Review each item below. You can accept, reject, or edit individual items, and mark any as leftovers.
              </p>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleAcceptAllBatch}
                  className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 font-medium text-sm border border-emerald-300"
                >
                  Accept All
                </button>
                <button
                  onClick={handleRejectAllBatch}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm border border-red-300"
                >
                  Reject All
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {pendingBatchResults.items.map((item, index) => (
                  <div key={index} className="p-5 rounded-xl border transition-all bg-white border-gray-300 shadow-sm hover:shadow-md">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
                            {item.modifier && (
                              <p className="text-sm text-gray-600 mt-0.5 font-medium">{item.modifier}</p>
                            )}
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </span>
                          {item.isLeftover && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full font-medium">
                              Leftover
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="p-3 rounded-lg text-center border border-gray-100 bg-gray-50">
                            <div className="text-sm font-semibold text-gray-900">{item.shelfLifeDays} days</div>
                            <div className="text-xs text-gray-600 mt-1">Shelf Life</div>
                          </div>
                          <div className="p-3 rounded-lg text-center border border-gray-100 bg-gray-50">
                            <div className="text-sm font-semibold text-gray-900">
                              {new Date(item.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Expires</div>
                          </div>
                          <div className="p-3 rounded-lg text-center border border-gray-100 bg-gray-50">
                            <div className="text-sm font-semibold text-gray-900">
                              {new Date(item.purchaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Purchased</div>
                          </div>
                          <div className="p-3 text-center">
                            <button
                              onClick={() => handleToggleBatchLeftover(index)}
                              className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                                item.isLeftover 
                                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-300' 
                                  : 'text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {item.isLeftover ? 'Is Leftover' : 'Mark as Leftovers'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-200">
                      <button
                        onClick={() => handleBatchItemAction(index, 'accept')}
                        className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300"
                      >
                        Accept & Add
                      </button>
                      <button
                        onClick={() => handleEditBatchItem(index)}
                        className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleBatchItemAction(index, 'reject')}
                        className="py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 bg-red-50 text-red-700 hover:bg-red-100 border border-red-300"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {pendingBatchResults.items.length} items remaining to review
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowBatchConfirmModal(false)
                      setPendingBatchResults(null)
                      setShowBatchModal(true)
                    }}
                    className="px-6 py-2.5 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Back to Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Single Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Item</h2>
              
              <div className="mb-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={useAI}
                      onChange={() => setUseAI(true)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">Use AI for shelf life</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!useAI}
                      onChange={() => setUseAI(false)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">Manual entry</span>
                  </label>
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault()
                if (useAI) {
                  handleAddWithAI(formData.name)
                } else {
                  handleAddGrocery(formData)
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g., Milk, Bananas, Chicken"
                      required
                    />
                  </div>

                  {!useAI && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value={Category.FRUITS_VEGETABLES}>Fruits & Vegetables</option>
                          <option value={Category.MEATS_CHEESES}>Meats & Cheeses</option>
                          <option value={Category.DAIRY}>Dairy</option>
                          <option value={Category.BEVERAGES}>Beverages</option>
                          <option value={Category.FROZEN_FOODS}>Frozen Foods</option>
                          <option value={Category.PANTRY}>Pantry</option>
                          <option value={Category.OTHER}>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date *
                        </label>
                        <input
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.isLeftover}
                            onChange={(e) => setFormData({...formData, isLeftover: e.target.checked})}
                            className="mr-2 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          />
                          <span className="text-sm font-medium text-gray-700">This is a leftover</span>
                        </label>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoadingShelfLife}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                    >
                      {isLoadingShelfLife ? <ButtonSpinner /> : 'Add Item'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Batch Add Modal */}
        {showBatchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Add Multiple Items</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add your grocery items
                  </label>
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">How to add items:</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Type an item and press <kbd className="bg-blue-100 px-1 rounded text-xs">Enter</kbd> or <kbd className="bg-blue-100 px-1 rounded text-xs">Tab</kbd></li>
                      <li>• Be specific: &ldquo;chicken breast&rdquo;, &ldquo;organic milk&rdquo;</li>
                    </ul>
                  </div>
                  
                  {/* Tag Input */}
                  <div className="min-h-[120px] border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                    {/* Tags Display */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {batchItems.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium cursor-pointer hover:bg-emerald-200 transition-colors"
                          onClick={() => removeBatchItem(item)}
                        >
                          {item}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      ))}
                    </div>
                    
                    {/* Input */}
                    <input
                      type="text"
                      value={currentBatchInput}
                      onChange={handleBatchInputChange}
                      onKeyDown={handleBatchInputKeyDown}
                      placeholder={batchItems.length === 0 ? "Type items like 'chicken breast, organic milk, bananas'..." : "Add another item..."}
                      className="w-full border-none outline-none text-sm placeholder-gray-400"
                    />
                  </div>
                  
                  {batchItems.length > 0 && (
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-4">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {batchItems.length} item{batchItems.length === 1 ? '' : 's'} ready • AI will detect categories and shelf life
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowBatchModal(false)
                      setBatchItems([])
                      setCurrentBatchInput('')
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBatchAdd}
                    disabled={isLoadingShelfLife || batchItems.length === 0}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 font-medium"
                  >
                    {isLoadingShelfLife ? <ButtonSpinner /> : 'Process Items'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Upload Receipt</h2>
              
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-600 mb-2">Receipt scanning coming soon!</p>
                <p className="text-sm text-gray-500">This feature will be available for registered users</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Item Modal */}
        {showEditModal && editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Item</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modifier (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.modifier}
                    onChange={(e) => setFormData({...formData, modifier: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., Organic, Frozen, Brand Name"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add descriptors like preparation method, brand, or quality details
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={Category.FRUITS_VEGETABLES}>Fruits & Vegetables</option>
                    <option value={Category.MEATS_CHEESES}>Meats & Cheeses</option>
                    <option value={Category.DAIRY}>Dairy</option>
                    <option value={Category.BEVERAGES}>Beverages</option>
                    <option value={Category.FROZEN_FOODS}>Frozen Foods</option>
                    <option value={Category.PANTRY}>Pantry</option>
                    <option value={Category.OTHER}>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {formData.shelfLifeDays && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      AI Shelf Life (days)
                    </label>
                    <input
                      type="number"
                      value={formData.shelfLifeDays || ''}
                      onChange={(e) => setFormData({...formData, shelfLifeDays: parseInt(e.target.value) || null})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      min="1"
                    />
                  </div>
                )}

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isLeftover}
                      onChange={(e) => setFormData({...formData, isLeftover: e.target.checked})}
                      className="mr-2 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700">This is a leftover</span>
                  </label>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingItem(null)
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateItem}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                  >
                    Update Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Item Info Modal */}
        {showInfoModal && infoItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Quick Freshness Check</h2>
                <button
                  onClick={() => {
                    setShowInfoModal(false)
                    setInfoItem(null)
                  }}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{infoItem.name}</h3>
                      {infoItem.modifier && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Details:</span> {infoItem.modifier}
                        </p>
                      )}
                      {infoItem.category && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Category:</span> {infoItem.category}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {infoItem.shelfLifeDays && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-2">Freshness Information</h4>
                        <p className="text-sm text-blue-800 mb-2">
                          Our AI estimates this item typically lasts <strong>{infoItem.shelfLifeDays} days</strong> under proper storage conditions.
                        </p>
                        <p className="text-xs text-blue-700">
                          This is an average estimate. Actual shelf life may vary based on storage conditions, 
                          quality at purchase, and specific brand variations.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white border-2 border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Storage Tips</h4>
                      <p className="text-sm text-gray-700">
                        For optimal freshness, store in appropriate conditions and check regularly for signs of spoilage.
                        Trust your senses - if something looks, smells, or tastes off, it&apos;s best to discard it.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => {
                      setShowInfoModal(false)
                      setInfoItem(null)
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Info Modal */}
        {showDataInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Data Storage</h2>
                <button
                  onClick={() => setShowDataInfoModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Your Privacy Matters</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Your grocery data is stored locally in your browser&apos;s storage. Nothing is sent to our servers unless you sign up for an account.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Important Note</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Data will be lost if you clear browser data or switch devices. Create a free account to sync across devices and never lose your data.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowDataInfoModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Got it
                </button>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}