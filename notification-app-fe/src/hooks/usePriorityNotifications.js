import { useState, useEffect } from "react"
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

  useEffect(() => {
    let cancelled = false

    Log("frontend", "info", "hook", "Fetching all notifications for priority inbox")

    fetchNotifications({ page: 1, limit: 100 })
      .then((items) => {
        if (cancelled) return
        Log("frontend", "info", "hook", `Computing priority top 10 from ${items.length} notifications`)

        const result = computeTop10(items)
        setTop10(result)
        setLoading(false)
        Log("frontend", "info", "state", `Priority inbox updated top10=${result.length}`)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setLoading(false)
        Log("frontend", "error", "state", `Priority inbox failed: ${err.message}`)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { top10, loading, error }
}
