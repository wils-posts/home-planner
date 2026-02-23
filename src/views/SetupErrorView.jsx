import { supabase } from '../supabaseClient'

export default function SetupErrorView({ errorType }) {
  async function handleLogout() {
    await supabase.auth.signOut()
  }

  const message = errorType === 'rls'
    ? 'Access denied — contact the household admin.'
    : 'Setup incomplete — check your email address is added to the household.'

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 text-center gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-100 mb-2">HomePlanner</h1>
        <p className="text-sm text-gray-400 max-w-xs">{message}</p>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-gray-400 border border-gray-700 rounded-lg px-4 py-2 active:bg-gray-800"
      >
        Sign out
      </button>
    </div>
  )
}
