import { memo } from 'react'
import { UI_CONFIG } from '../../constants'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
  variant?: keyof typeof UI_CONFIG.ERROR_VARIANT_CLASSES
}

export const ErrorMessage = memo(
  ({
    title = '오류 발생',
    message,
    onRetry,
    className = '',
    variant = 'error'
  }: ErrorMessageProps) => {
    const variantClasses = UI_CONFIG.ERROR_VARIANT_CLASSES

    return (
      <div
        className={`border rounded-lg p-6 text-center ${variantClasses[variant]} ${className}`}
        role="alert"
        aria-live="assertive"
        aria-labelledby="error-title"
        aria-describedby="error-message"
      >
        <h2 id="error-title" className="text-xl font-semibold mb-4">
          {title}
        </h2>
        <p id="error-message" className="mb-4">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label="오류 해결을 위해 다시 시도"
            type="button"
          >
            다시 시도
          </button>
        )}
      </div>
    )
  }
)

ErrorMessage.displayName = 'ErrorMessage'
