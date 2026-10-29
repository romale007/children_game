import { createHashRouter, Navigate } from 'react-router'
import GamePage from './GamePage'
import HubPage from './HubPage'

// Hash URLs (#/autumn-count) because GitHub Pages can't fall back to index.html for unknown paths.
export const router = createHashRouter([
  { path: '/', element: <HubPage /> },
  { path: '/:gameId', element: <GamePage /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
