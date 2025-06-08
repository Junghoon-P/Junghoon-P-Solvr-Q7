import { memo } from 'react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner = memo(
  ({ message = '로딩 중...', size = 'md', className = '' }: LoadingSpinnerProps) => {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-32 w-32',
      lg: 'h-48 w-48'
    }

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
