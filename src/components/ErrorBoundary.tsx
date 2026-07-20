import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message?: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-[60vh] flex flex-col items-center justify-center px-margin-mobile text-center">
          <h1 className="font-display text-headline-xl text-primary mb-4">Something went wrong</h1>
          <p className="text-muted mb-8 max-w-md">{this.state.message}</p>
          <Link to="/" className="text-gold hover:text-primary transition-colors">
            Return to homepage
          </Link>
        </main>
      )
    }
    return this.props.children
  }
}
