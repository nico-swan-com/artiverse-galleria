import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Logo from './Logo'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Logo Component', () => {
  it('should render logo with link to home', () => {
    render(<Logo />)

    const link = screen.getByRole('link', { name: /artiverse/i })
    expect(link).toHaveAttribute('href', '/')
  })

  it('should render Artiverse text', () => {
    render(<Logo />)

    const text = screen.getByText('Artiverse')
    expect(text).toBeInTheDocument()
  })

  it('should render SVG icon', () => {
    const { container } = render(<Logo />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg?.tagName.toLowerCase()).toBe('svg')
  })
})
