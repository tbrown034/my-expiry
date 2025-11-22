import { render, screen, fireEvent } from '@testing-library/react'
import HomePage from '../HomePage'

describe('HomePage', () => {
  it('renders the main heading', () => {
    const mockNavigate = jest.fn()
    render(<HomePage onNavigate={mockNavigate} />)

    expect(screen.getByText('Welcome to')).toBeInTheDocument()
    expect(screen.getByText('My Expiry')).toBeInTheDocument()
  })

  it('displays both main CTA buttons', () => {
    const mockNavigate = jest.fn()
    render(<HomePage onNavigate={mockNavigate} />)

    expect(screen.getByText('Add to Fridge')).toBeInTheDocument()
    expect(screen.getByText('See Your Fridge')).toBeInTheDocument()
  })

  it('navigates to add view when Add to Fridge is clicked', () => {
    const mockNavigate = jest.fn()
    render(<HomePage onNavigate={mockNavigate} />)

    const addButton = screen.getByText('Add to Fridge').closest('button')
    fireEvent.click(addButton)

    expect(mockNavigate).toHaveBeenCalledWith('add')
  })

  it('navigates to fridge view when See Your Fridge is clicked', () => {
    const mockNavigate = jest.fn()
    render(<HomePage onNavigate={mockNavigate} />)

    const fridgeButton = screen.getByText('See Your Fridge').closest('button')
    fireEvent.click(fridgeButton)

    expect(mockNavigate).toHaveBeenCalledWith('fridge')
  })

  it('displays the benefits section', () => {
    const mockNavigate = jest.fn()
    render(<HomePage onNavigate={mockNavigate} />)

    expect(screen.getByText('Stay Safe')).toBeInTheDocument()
    expect(screen.getByText('Reduce Waste')).toBeInTheDocument()
    expect(screen.getByText('Save Money')).toBeInTheDocument()
  })

  it('displays the How It Works section', () => {
    const mockNavigate = jest.fn()
    render(<HomePage onNavigate={mockNavigate} />)

    expect(screen.getByText('How It Works')).toBeInTheDocument()
    expect(screen.getByText('Add Your Groceries')).toBeInTheDocument()
    expect(screen.getByText('Get AI Shelf Life Estimates')).toBeInTheDocument()
    expect(screen.getByText('Track & Monitor')).toBeInTheDocument()
  })

  it('has fridge background styling', () => {
    const mockNavigate = jest.fn()
    const { container } = render(<HomePage onNavigate={mockNavigate} />)

    const backgroundDiv = container.querySelector('.fridge-background')
    expect(backgroundDiv).toBeInTheDocument()
  })
})
