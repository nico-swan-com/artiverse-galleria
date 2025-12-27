'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className='flex min-h-[400px] w-full flex-col items-center justify-center space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center'>
            <h2 className='text-xl font-bold text-gray-900'>
              Something went wrong
            </h2>
            <p className='text-sm text-gray-500'>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              className='rounded bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800'
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
