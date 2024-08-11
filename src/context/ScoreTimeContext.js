import React from 'react'

const ScoreTimeContext = React.createContext({
  score: 0,
  minutes: 10,
  seconds: 0,
  updateStateValue: () => {},
})

export default ScoreTimeContext
