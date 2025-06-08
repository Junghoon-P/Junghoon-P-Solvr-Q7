import { memo } from 'react'
import { UI_CONFIG, MESSAGES } from '../../constants'

interface LoadingSpinnerProps {
  message?: string
  size?: keyof typeof UI_CONFIG.LOADING_SPINNER.SIZE_CLASSES
  className?: string
}

export const LoadingSpinner = memo(
  ({ message = MESSAGES.LOADING.DEFAULT, size = 'md', className = '' }: LoadingSpinnerProps) => {
    const sizeClasses = UI_CONFIG.LOADING_SPINNER.SIZE_CLASSES

    return (
      <div
        className={`flex items-center justify-center ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div
            className={`animate-spin rounded-full border-b-2 border-blue-500 mx-auto ${sizeClasses[size]}`}
            aria-hidden="true"
          ></div>
          <p className="mt-4 text-gray-600" aria-label={message}>
            {message}
          </p>
        </div>
        <span className="sr-only">{message}</span>
      </div>
    )
  }
)

LoadingSpinner.displayName = 'LoadingSpinner'
