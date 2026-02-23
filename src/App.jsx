import { useState, useCallback } from 'react'
import { useAuth } from './hooks/useAuth'
import { useCalendar } from './hooks/useCalendar'
import LoginView from './views/LoginView'
import SetupErrorView from './views/SetupErrorView'
import MainView from './views/MainView'
import Toast from './components/Toast'

export default function App() {
  const { session, loadingAuth } = useAuth()
  const { calendarId, loading: loadingCal, error: calError } = useCalendar(session?.user?.id)
  const [toast, setToast] = useState(null)

  const handleToast = useCallback(({ message, type = 'error' }) => {
    setToast({ message, type })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <>
        <LoginView onToast={handleToast} />
        <Toast message={toast?.message} type={toast?.type} onDismiss={dismissToast} />
      </>
    )
  }

  if (loadingCal) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
      </div>
    )
  }

  if (calError) {
    return <SetupErrorView errorType={calError} />
  }

  return (
    <>
      <MainView calendarId={calendarId} session={session} onToast={handleToast} />
      <Toast message={toast?.message} type={toast?.type} onDismiss={dismissToast} />
    </>
  )
}
