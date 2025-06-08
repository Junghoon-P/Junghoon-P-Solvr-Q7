import { Component, ReactNode, ErrorInfo } from 'react'
import { ErrorMessage } from './ErrorMessage'
import { MESSAGES } from '../../constants'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // 에러 로깅
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // 외부 에러 처리 함수 호출
    this.props.onError?.(error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // 커스텀 fallback UI가 제공된 경우
      if (this.props.fallback && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo)
      }

      // 기본 에러 UI
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <ErrorMessage
              title="앱에서 오류가 발생했습니다"
              message={
                process.env.NODE_ENV === 'development'
                  ? this.state.error.message
                  : MESSAGES.ERROR.DEFAULT
              }
              onRetry={this.handleRetry}
              className="bg-white shadow-lg"
            />
            <div className="mt-4 text-center">
              <button
                onClick={this.handleReload}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                페이지 새로고침
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4 bg-gray-50 p-4 rounded border">
                <summary className="cursor-pointer font-medium text-gray-700">
                  개발자 정보 (상세 에러)
                </summary>
                <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-64">
                  {this.state.error.stack}
                  {'\n\n'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
