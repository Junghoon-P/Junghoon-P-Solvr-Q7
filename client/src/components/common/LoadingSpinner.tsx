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
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div
            className={`animate-spin rounded-full border-b-2 border-blue-500 mx-auto ${sizeClasses[size]}`}
          ></div>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
      </div>
    )
  }
)

LoadingSpinner.displayName = 'LoadingSpinner'
