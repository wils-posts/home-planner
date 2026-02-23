import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'

export default function LoginView() {
  const [email, setEmail] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState(null)
  const [countdown, setCountdown] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  function startCountdown() {
    setCountdown(60)
    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  async function handleSendCode() {
    setError(null)
    setSending(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })
    setSending(false)
    if (error) {
      setError("Couldn't send code — check your email address")
    } else {
      setCodeSent(true)
      startCountdown()
    }
  }

  async function handleVerify() {
    setError(null)
    setVerifying(true)
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' })
    setVerifying(false)
    if (error) setError('Invalid or expired code — try again')
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">HomePlanner</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to your household</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={codeSent}
            onKeyDown={e => { if (e.key === 'Enter' && !codeSent) handleSendCode() }}
            className="bg-slate-800 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-base outline-none focus:ring-1 focus:ring-slate-500 disabled:opacity-60"
          />

          {!codeSent ? (
            <button
              onClick={handleSendCode}
              disabled={sending || !email.trim()}
              className="bg-white text-slate-900 rounded-lg px-4 py-3 text-base font-semibold active:bg-slate-200 disabled:opacity-40"
            >
              {sending ? 'Sending…' : 'Send code'}
            </button>
          ) : (
            <>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit code"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={e => { if (e.key === 'Enter') handleVerify() }}
                autoFocus
                className="bg-slate-800 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-base outline-none focus:ring-1 focus:ring-slate-500 tracking-widest"
              />
              <button
                onClick={handleVerify}
                disabled={verifying || otp.length < 6}
                className="bg-white text-slate-900 rounded-lg px-4 py-3 text-base font-semibold active:bg-slate-200 disabled:opacity-40"
              >
                {verifying ? 'Verifying…' : 'Verify'}
              </button>
              <button
                onClick={handleSendCode}
                disabled={countdown > 0 || sending}
                className="text-sm text-slate-400 disabled:opacity-40 py-1"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
              </button>
            </>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  )
}
