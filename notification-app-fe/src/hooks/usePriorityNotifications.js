import { useState, useEffect, useCallback } from "react"
import { Log } from "../../../logging-middleware/logger.js"
import { fetchNotifications } from "../api/notifications.js"

const PRIORITY_MAP = {
  placement: 3,
  result: 2,
  event: 1,
}

function getPriorityScore(type) {
  return PRIORITY_MAP[type] || 0
}

function computeTop10(all) {
  const scored = all.map((n) => ({
    ...n,
    priority: getPriorityScore(n.type),
  }))

  scored.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  return scored.slice(0, 10)
}

export function usePriorityNotifications() {
  const [top10, setTop10] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      Log("frontend", "info", "hook", "Fetching all notifications for priority inbox")

      const data = await fetchNotifications({ page: 1, limit: 100 })

      const all = data.notifications || []
      Log("frontend", "info", "hook", `Computing priority top 10 from ${all.length} notifications`)

      const result = computeTop10(all)
      setTop10(result)

      Log("frontend", "info", "state", `Priority inbox updated top10=${result.length}`)
    } catch (err) {
      setError(err.message)
      Log("frontend", "error", "state", `Priority inbox failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { top10, loading, error, refetch: load }
}
