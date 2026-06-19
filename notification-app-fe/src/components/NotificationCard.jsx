import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box,
} from "@mui/material"
import {
  Work as PlacementIcon,
  School as ResultIcon,
  Event as EventIcon,
} from "@mui/icons-material"

const typeConfig = {
  placement: { label: "Placement", color: "primary", icon: <PlacementIcon fontSize="small" /> },
  result: { label: "Result", color: "success", icon: <ResultIcon fontSize="small" /> },
  event: { label: "Event", color: "warning", icon: <EventIcon fontSize="small" /> },
}

function formatDate(ts) {
  if (!ts) return ""
  try {
    return new Date(ts).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return ts
  }
}

export function NotificationCard({ notification }) {
  const cfg = typeConfig[notification.type] || typeConfig.event

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
        <Stack direction="row" alignItems="flex-start" spacing={1.5}>
          <Box sx={{ mt: 0.3 }}>{cfg.icon}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
              sx={{ mb: 0.5 }}
            >
              <Typography variant="subtitle2" fontWeight={600} noWrap>
                {notification.title || notification.message}
              </Typography>
              <Chip
                label={cfg.label}
                color={cfg.color}
                size="small"
                variant="outlined"
              />
            </Stack>
            {notification.title && notification.message && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {notification.message}
              </Typography>
            )}
            <Typography variant="caption" color="text.disabled">
              {formatDate(notification.timestamp)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
