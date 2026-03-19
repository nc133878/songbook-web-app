import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import SongsPage from './pages/SongsPage'
import SongDetailPage from './pages/SongDetailPage'
import NewSongPage from './pages/NewSongPage'
import SplitSheetPage from './pages/SplitSheetPage'
import SplitSheetPDFPage from './pages/SplitSheetPDFPage'
import EditSongPage from './pages/EditSongPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/songs" replace />} />
          <Route path="songs" element={<SongsPage />} />
          <Route path="songs/new" element={<NewSongPage />} />
          <Route path="songs/:id" element={<SongDetailPage />} />
          <Route path="songs/:id/edit" element={<EditSongPage />} />
          <Route path="songs/:id/split-sheet" element={<SplitSheetPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="songs/:id/split-sheet/pdf" element={<SplitSheetPDFPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
