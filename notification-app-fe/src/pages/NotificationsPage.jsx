import { useEffect } from "react"
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Typography,
} from "@mui/material"
import NotificationsIcon from "@mui/icons-material/Notifications"

import { Log } from "../../../logging-middleware/logger.js"
import { NotificationCard } from "../components/NotificationCard.jsx"
import { NotificationFilter } from "../components/NotificationFilter.jsx"
import { useNotifications } from "../hooks/useNotifications.js"

export function NotificationsPage() {
  const {
    notifications,
    total,
    totalPages,
    page,
    filterType,
    loading,
    error,
    setFilter,
    setPage,
  } = useNotifications()

  useEffect(() => {
    Log("frontend", "info", "page", "All Notifications page loaded")
  }, [])

  const displayFilter = filterType
    ? filterType.charAt(0).toUpperCase() + filterType.slice(1)
    : "All"

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Badge badgeContent={total} color="primary" max={999}>
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>
        <Typography variant="h5" fontWeight={700}>
          Notifications
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 3 }}>
        <NotificationFilter value={displayFilter} onChange={setFilter} />
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Failed to load notifications: {error}
        </Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No notifications found.
        </Alert>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={1.5}>
          {notifications.map((n) => (
            <NotificationCard key={n.id || n._id} notification={n} />
          ))}
        </Stack>
      )}

      {!loading && !error && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  )
}
