import { useEffect } from 'react'

export default function Toast({ message, type = 'error', onDismiss }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [message, onDismiss])

  if (!message) return null

  const colors = {
    error: 'bg-red-600 text-white',
    success: 'bg-green-600 text-white',
    info: 'bg-gray-700 text-white',
  }

  return (
    <div
      className={`fixed bottom-6 left-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${colors[type] || colors.info}`}
      role="alert"
    >
      {message}
    </div>
  )
}
