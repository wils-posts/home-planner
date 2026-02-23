import { useState, useCallback } from 'react'
import CalendarGrid from '../components/CalendarGrid'
import DayPad from '../components/DayPad'
import { useMonthData } from '../hooks/useMonthData'
import { useDayData } from '../hooks/useDayData'
import { useRealtime } from '../hooks/useRealtime'
import { getTodayStr, getMonthLabel } from '../utils/dateUtils'
import { supabase } from '../supabaseClient'

function getInitialState() {
  const today = new Date()
  return {
    year: today.getFullYear(),
    month: today.getMonth(),
    todayStr: getTodayStr(),
  }
}

export default function MainView({ calendarId, session, onToast }) {
  const init = getInitialState()
  const [todayStr] = useState(init.todayStr)
  const [selectedDay, setSelectedDay] = useState(init.todayStr)
  const [viewYear, setViewYear] = useState(init.year)
  const [viewMonth, setViewMonth] = useState(init.month)

  const { monthData, refetch: refetchMonth } = useMonthData(calendarId, viewYear, viewMonth)
  const { entries, notes, refetch: refetchDay } = useDayData(calendarId, selectedDay)

  const handleRealtimeChange = useCallback(() => {
    refetchMonth()
    refetchDay()
  }, [refetchMonth, refetchDay])

  useRealtime(calendarId, handleRealtimeChange)

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function goToToday() {
    const today = new Date()
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
    setSelectedDay(getTodayStr())
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="overflow-hidden flex flex-col bg-slate-900 text-slate-100 max-w-md mx-auto" style={{ height: '100dvh' }}>

      {/* Top bar */}
      <div className="shrink-0 px-4 pt-3 pb-2 flex items-center justify-between bg-slate-900">
        <span className="text-base font-bold tracking-tight text-white w-24">HomePlanner</span>

        {/* Month nav — arrows tight around month label */}
        <div className="flex items-center">
          <NavBtn onClick={prevMonth}>‹</NavBtn>
          <button
            onClick={goToToday}
            className="text-sm font-semibold text-white px-2 text-center whitespace-nowrap"
          >
            {getMonthLabel(viewYear, viewMonth)}
          </button>
          <NavBtn onClick={nextMonth}>›</NavBtn>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs text-slate-500 w-24 text-right"
        >
          Sign out
        </button>
      </div>

      {/* Calendar — fixed pixel height, never changes */}
      <div className="shrink-0 overflow-hidden px-2 pb-2 pt-1 bg-slate-800" style={{ height: '340px' }}>
        <CalendarGrid
          viewYear={viewYear}
          viewMonth={viewMonth}
          selectedDay={selectedDay}
          todayStr={todayStr}
          onDaySelect={setSelectedDay}
          monthData={monthData}
        />
      </div>

      {/* Day pad — takes all remaining space */}
      <div className="flex-1 overflow-hidden">
        <DayPad
          calendarId={calendarId}
          selectedDay={selectedDay}
          session={session}
          entries={entries}
          notes={notes}
          onRefetch={handleRealtimeChange}
          onToast={onToast}
        />
      </div>
    </div>
  )
}

function NavBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-slate-400 active:text-white text-xl leading-none w-9 h-9 flex items-center justify-center"
    >
      {children}
    </button>
  )
}
