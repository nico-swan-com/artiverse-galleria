import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from './Navbar'

// Mock dependencies
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn()
  }))
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated'
  })),
  signOut: jest.fn()
}))

jest.mock('@/contexts/cart.context', () => ({
  useCart: jest.fn(() => ({
    getItemCount: jest.fn(() => 0)
  }))
}))

jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: jest.fn(() => false)
}))

jest.mock('@/components/common/Logo', () => {
  return function MockLogo() {
    return <div data-testid='logo'>Logo</div>
  }
})

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render logo', () => {
    render(<Navbar />)
    expect(screen.getByTestId('logo')).toBeInTheDocument()
  })

  it('should render navigation links on desktop', () => {
    render(<Navbar />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Artworks')).toBeInTheDocument()
    expect(screen.getByText('Artists')).toBeInTheDocument()
  })

  it('should render login and register buttons when not authenticated', () => {
    render(<Navbar />)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Register')).toBeInTheDocument()
  })

  it('should render search button', () => {
    render(<Navbar />)
    const searchButton = screen.getByLabelText('Search')
    expect(searchButton).toBeInTheDocument()
  })

  it('should toggle search overlay when search button is clicked', () => {
    render(<Navbar />)
    const searchButton = screen.getByLabelText('Search')
    fireEvent.click(searchButton)

    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/search for artworks/i)
    ).toBeInTheDocument()
  })
})
