import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Log } from "../../../logging-middleware/logger.js"
import { fetchNotifications } from "../api/notifications.js"

const PAGE_SIZE = 10

export function useNotifications() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get("page")) || 1
  const rawType = searchParams.get("notification_type") || ""

  const filterType = ["placement", "result", "event"].includes(rawType)
    ? rawType
    : ""

  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchNotifications({
      page: 1,
      limit: 100,
      notification_type: filterType || undefined,
    })
      .then((items) => {
        if (cancelled) return
        setAllItems(items)
        setLoading(false)
        Log(
          "frontend",
          "info",
          "state",
          `Notifications state updated count=${items.length}`
        )
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setLoading(false)
        Log("frontend", "error", "state", `Notifications load failed: ${err.message}`)
      })

    return () => {
      cancelled = true
    }
  }, [filterType])

  const start = (page - 1) * PAGE_SIZE
  const notifications = allItems.slice(start, start + PAGE_SIZE)
  const total = allItems.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const setFilter = (type) => {
    Log("frontend", "info", "hook", `Filter change to "${type}"`)
    const next = new URLSearchParams(searchParams)
    if (type && type !== "All") {
      next.set("notification_type", type.toLowerCase())
    } else {
      next.delete("notification_type")
    }
    next.set("page", "1")
    setSearchParams(next)
  }

  const setPage = (p) => {
    Log("frontend", "info", "hook", `Page change to ${p}`)
    const next = new URLSearchParams(searchParams)
    next.set("page", String(p))
    setSearchParams(next)
  }

  return {
    notifications,
    total,
    totalPages,
    page,
    filterType,
    loading,
    error,
    setFilter,
    setPage,
  }
}
