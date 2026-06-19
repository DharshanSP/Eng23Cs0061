import { Routes, Route } from "react-router-dom"
import { Log } from "../../logging-middleware/logger.js"
import { Layout } from "./components/Layout.jsx"
import { NotificationsPage } from "./pages/NotificationsPage.jsx"
import { PriorityInboxPage } from "./pages/PriorityInboxPage.jsx"

export default function App() {
  Log("frontend", "info", "component", "App mounted")

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<NotificationsPage />} />
        <Route path="priority" element={<PriorityInboxPage />} />
      </Route>
    </Routes>
  )
}
