import { Outlet, NavLink, useLocation } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Container,
} from "@mui/material"
import { Notifications as NotifIcon, Inbox as InboxIcon } from "@mui/icons-material"

const tabs = [
  { label: "All Notifications", path: "/", icon: <NotifIcon /> },
  { label: "Priority Inbox", path: "/priority", icon: <InboxIcon /> },
]

export function Layout() {
  const location = useLocation()
  const activeTab = tabs.findIndex((t) => t.path === location.pathname)

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6" fontWeight={700} sx={{ mr: 4 }}>
            Notifications
          </Typography>
          <Tabs
            value={activeTab === -1 ? 0 : activeTab}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ flex: 1 }}
          >
            {tabs.map((t) => (
              <Tab
                key={t.path}
                label={t.label}
                icon={t.icon}
                iconPosition="start"
                component={NavLink}
                to={t.path}
                sx={{ textTransform: "none", minHeight: 64 }}
              />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
