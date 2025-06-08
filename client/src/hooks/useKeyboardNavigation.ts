import { useEffect, useCallback } from 'react'

interface UseKeyboardNavigationOptions {
  onEscape?: () => void
  onEnter?: () => void
  onSpace?: () => void
  onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void
  disabled?: boolean
}

export const useKeyboardNavigation = ({
  onEscape,
  onEnter,
  onSpace,
  onArrowKeys,
  disabled = false
}: UseKeyboardNavigationOptions) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return

      switch (event.key) {
        case 'Escape':
          onEscape?.()
          break
        case 'Enter':
          if (!event.defaultPrevented) {
            onEnter?.()
          }
          break
        case ' ':
          if (!event.defaultPrevented) {
            event.preventDefault()
            onSpace?.()
          }
          break
        case 'ArrowUp':
          event.preventDefault()
          onArrowKeys?.('up')
          break
        case 'ArrowDown':
          event.preventDefault()
          onArrowKeys?.('down')
          break
        case 'ArrowLeft':
          event.preventDefault()
          onArrowKeys?.('left')
          break
        case 'ArrowRight':
          event.preventDefault()
          onArrowKeys?.('right')
          break
      }
    },
    [onEscape, onEnter, onSpace, onArrowKeys, disabled]
  )

  useEffect(() => {
    if (!disabled) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, disabled])
}

// 포커스 관리를 위한 훅
export const useFocusManagement = () => {
  const focusElement = useCallback((selector: string | HTMLElement) => {
    const element =
      typeof selector === 'string' ? (document.querySelector(selector) as HTMLElement) : selector

    if (element && typeof element.focus === 'function') {
      element.focus()
    }
  }, [])

  const focusFirstElement = useCallback((container?: HTMLElement) => {
    const root = container || document
    const focusableElements = root.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    firstElement?.focus()
  }, [])

  const focusLastElement = useCallback((container?: HTMLElement) => {
    const root = container || document
    const focusableElements = root.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
    lastElement?.focus()
  }, [])

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    return () => container.removeEventListener('keydown', handleTabKey)
  }, [])

  return {
    focusElement,
    focusFirstElement,
    focusLastElement,
    trapFocus
  }
}
