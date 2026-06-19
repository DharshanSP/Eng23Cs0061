import { Log } from "../../../logging-middleware/logger.js"

const API_BASE = "http://4.224.186.213/evaluation-service"

function getHeaders() {
  const headers = { "Content-Type": "application/json" }
  const viteToken =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_AUTH_TOKEN
  if (viteToken) {
    headers.Authorization = `Bearer ${viteToken}`
  }
  return headers
}

export async function fetchNotifications({
  page = 1,
  limit = 10,
  notification_type,
} = {}) {
  Log(
    "frontend",
    "info",
    "api",
    `Notifications request page=${page} limit=${limit} type=${notification_type || "all"}`
  )

  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (notification_type) {
    params.set("notification_type", notification_type)
  }

  const res = await fetch(`${API_BASE}/notifications?${params}`, {
    headers: getHeaders(),
  })

  if (!res.ok) {
    const msg = `Notifications API returned ${res.status}`
    Log("frontend", "error", "api", msg)
    throw new Error(msg)
  }

  const data = await res.json()
  Log(
    "frontend",
    "info",
    "api",
    `Notifications success count=${data.notifications?.length || 0} total=${data.total || 0}`
  )
  return data
}
