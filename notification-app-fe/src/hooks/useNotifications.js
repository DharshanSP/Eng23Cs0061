import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { Log } from "../../../logging-middleware/logger.js"
import { fetchNotifications } from "../api/notifications.js"

export function useNotifications() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 10
  const rawType = searchParams.get("notification_type") || ""

  const filterType = ["placement", "result", "event"].includes(rawType)
    ? rawType
    : ""

  const [notifications, setNotifications] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchNotifications({ page, limit, notification_type: filterType || undefined })
      setNotifications(data.notifications || [])
      setTotal(data.total || 0)
      Log("frontend", "info", "state", `Notifications state updated count=${data.notifications?.length || 0}`)
    } catch (err) {
      setError(err.message)
      Log("frontend", "error", "state", `Notifications load failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [page, limit, filterType])

  useEffect(() => {
    load()
  }, [load])

  const totalPages = Math.max(1, Math.ceil(total / limit))

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
    limit,
    filterType,
    loading,
    error,
    setFilter,
    setPage,
  }
}
