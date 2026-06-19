import { useEffect } from "react"
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  Chip,
} from "@mui/material"
import InboxIcon from "@mui/icons-material/Inbox"

import { Log } from "../../../logging-middleware/logger.js"
import { NotificationCard } from "../components/NotificationCard.jsx"
import { usePriorityNotifications } from "../hooks/usePriorityNotifications.js"

export function PriorityInboxPage() {
  const { top10, loading, error } = usePriorityNotifications()

  useEffect(() => {
    Log("frontend", "info", "page", "Priority Inbox page loaded")
  }, [])

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <InboxIcon sx={{ fontSize: 28 }} color="primary" />
        <Typography variant="h5" fontWeight={700}>
          Priority Inbox
        </Typography>
        <Chip label="Top 10" size="small" color="primary" />
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Notifications ranked by priority (Placement &gt; Result &gt; Event) and sorted by newest first.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Failed to load priority inbox: {error}
        </Alert>
      )}

      {!loading && !error && top10.length === 0 && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No notifications available.
        </Alert>
      )}

      {!loading && !error && top10.length > 0 && (
        <Stack spacing={1.5}>
          {top10.map((n, idx) => (
            <Box key={n.id || n._id || idx} sx={{ position: "relative" }}>
              <Chip
                label={`#${idx + 1}`}
                size="small"
                color={idx < 3 ? "primary" : "default"}
                sx={{
                  position: "absolute",
                  top: -8,
                  left: -8,
                  zIndex: 1,
                  fontWeight: 700,
                }}
              />
              <NotificationCard notification={n} />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  )
}
