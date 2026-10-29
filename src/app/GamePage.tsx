import { createElement, lazy, Suspense, useEffect } from 'react'
import { Navigate, useParams } from 'react-router'
import { canPlay } from '../games/access'
import { findGame, games } from '../games/registry'
import Loading from '../shared/components/Loading'

const gameComponents = new Map(games.map((game) => [game.id, lazy(game.load)]))

const APP_TITLE = document.title

export default function GamePage() {
  const game = findGame(useParams().gameId)

  useEffect(() => {
    if (!game) return
    document.title = game.title
    return () => {
      document.title = APP_TITLE
    }
  }, [game])

  if (!game || !canPlay(game)) return <Navigate to="/" replace />

  return <Suspense fallback={<Loading />}>{createElement(gameComponents.get(game.id)!)}</Suspense>
}
