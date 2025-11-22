import { render, screen, fireEvent } from '@testing-library/react'
import AddToFridgePage from '../AddToFridgePage'

describe('AddToFridgePage', () => {
  it('renders the main heading', () => {
    const mockSelectMethod = jest.fn()
    const mockBack = jest.fn()
    render(<AddToFridgePage onSelectMethod={mockSelectMethod} onBack={mockBack} />)

    expect(screen.getByText('Add to Your Fridge')).toBeInTheDocument()
  })

  it('displays all three method options', () => {
    const mockSelectMethod = jest.fn()
    const mockBack = jest.fn()
    render(<AddToFridgePage onSelectMethod={mockSelectMethod} onBack={mockBack} />)

    expect(screen.getByText('Single Item')).toBeInTheDocument()
    expect(screen.getByText('Batch Add')).toBeInTheDocument()
    expect(screen.getByText('Upload Receipt')).toBeInTheDocument()
  })

  it('calls onSelectMethod with "single" when Single Item is clicked', () => {
    const mockSelectMethod = jest.fn()
    const mockBack = jest.fn()
    render(<AddToFridgePage onSelectMethod={mockSelectMethod} onBack={mockBack} />)

    const singleButton = screen.getByText('Single Item').closest('button')
    fireEvent.click(singleButton)

    expect(mockSelectMethod).toHaveBeenCalledWith('single')
  })

  it('calls onSelectMethod with "batch" when Batch Add is clicked', () => {
    const mockSelectMethod = jest.fn()
    const mockBack = jest.fn()
    render(<AddToFridgePage onSelectMethod={mockSelectMethod} onBack={mockBack} />)

    const batchButton = screen.getByText('Batch Add').closest('button')
    fireEvent.click(batchButton)

    expect(mockSelectMethod).toHaveBeenCalledWith('batch')
  })

  it('calls onSelectMethod with "receipt" when Upload Receipt is clicked', () => {
    const mockSelectMethod = jest.fn()
    const mockBack = jest.fn()
    render(<AddToFridgePage onSelectMethod={mockSelectMethod} onBack={mockBack} />)

    const receiptButton = screen.getByText('Upload Receipt').closest('button')
    fireEvent.click(receiptButton)

    expect(mockSelectMethod).toHaveBeenCalledWith('receipt')
  })

  it('calls onBack when Back to Home button is clicked', () => {
    const mockSelectMethod = jest.fn()
    const mockBack = jest.fn()
    render(<AddToFridgePage onSelectMethod={mockSelectMethod} onBack={mockBack} />)

    const backButton = screen.getByText('Back to Home').closest('button')
    fireEvent.click(backButton)

    expect(mockBack).toHaveBeenCalled()
  })

  it('displays the Quick Tips section', () => {
    const mockSelectMethod = jest.fn()
    const mockBack = jest.fn()
    render(<AddToFridgePage onSelectMethod={mockSelectMethod} onBack={mockBack} />)

    expect(screen.getByText('Quick Tips')).toBeInTheDocument()
  })

  it('has fridge background styling', () => {
    const mockSelectMethod = jest.fn()
    const mockBack = jest.fn()
    const { container } = render(<AddToFridgePage onSelectMethod={mockSelectMethod} onBack={mockBack} />)

    const backgroundDiv = container.querySelector('.fridge-background')
    expect(backgroundDiv).toBeInTheDocument()
  })

  it('displays emojis for each method', () => {
    const mockSelectMethod = jest.fn()
    const mockBack = jest.fn()
    render(<AddToFridgePage onSelectMethod={mockSelectMethod} onBack={mockBack} />)

    const container = screen.getByText('Single Item').closest('button')
    expect(container.textContent).toContain('🍎')

    const batchContainer = screen.getByText('Batch Add').closest('button')
    expect(batchContainer.textContent).toContain('🛒')

    const receiptContainer = screen.getByText('Upload Receipt').closest('button')
    expect(receiptContainer.textContent).toContain('📄')
  })
})
