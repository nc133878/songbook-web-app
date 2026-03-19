import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
    return { hasError: true, message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl p-8 text-center space-y-4">
            <p className="text-2xl">⚠️</p>
            <h1 className="text-lg font-semibold text-white">Something went wrong</h1>
            <p className="text-sm text-gray-400">{this.state.message}</p>
            <button
              onClick={() => window.location.assign('/songs')}
              className="mt-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              Go back to songs
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
