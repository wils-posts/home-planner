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
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(y => y - 1)
    } else {
      setViewMonth(m => m - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(y => y + 1)
    } else {
      setViewMonth(m => m + 1)
    }
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
    <div className="h-screen overflow-hidden flex flex-col bg-gray-950 text-gray-100 max-w-md mx-auto">
      {/* Top bar */}
      <div className="shrink-0 px-3 py-2 flex items-center justify-between border-b border-gray-800">
        <span className="font-bold text-base text-gray-100">HomePlanner</span>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-300 font-medium">{getMonthLabel(viewYear, viewMonth)}</span>
        </div>
        <div className="flex items-center gap-1">
          <NavBtn onClick={prevMonth}>‹</NavBtn>
          <NavBtn onClick={goToToday} small>Today</NavBtn>
          <NavBtn onClick={nextMonth}>›</NavBtn>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 px-2 py-1 ml-1"
          >
            Out
          </button>
        </div>
      </div>

      {/* Calendar — top 50% */}
      <div className="h-[50%] overflow-hidden px-2 py-1">
        <CalendarGrid
          viewYear={viewYear}
          viewMonth={viewMonth}
          selectedDay={selectedDay}
          todayStr={todayStr}
          onDaySelect={setSelectedDay}
          monthData={monthData}
        />
      </div>

      {/* Day pad — bottom 50% */}
      <div className="h-[50%] overflow-hidden">
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

function NavBtn({ children, onClick, small }) {
  return (
    <button
      onClick={onClick}
      className={`text-gray-300 active:text-white px-2 py-1 min-w-[36px] min-h-[36px] flex items-center justify-center ${small ? 'text-xs' : 'text-lg leading-none'}`}
    >
      {children}
    </button>
  )
}
