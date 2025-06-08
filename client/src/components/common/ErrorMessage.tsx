import { memo } from 'react'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
  variant?: 'error' | 'warning' | 'info'
}

export const ErrorMessage = memo(
  ({
    title = '오류 발생',
    message,
    onRetry,
    className = '',
    variant = 'error'
  }: ErrorMessageProps) => {
    const variantClasses = {
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    }

    return (
      <div className={`border rounded-lg p-6 text-center ${variantClasses[variant]} ${className}`}>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        )}
      </div>
    )
  }
)

ErrorMessage.displayName = 'ErrorMessage'
