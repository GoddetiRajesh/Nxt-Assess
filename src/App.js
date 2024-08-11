import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import Home from './components/Home'
import Assessment from './components/Assessment'
import Login from './components/Login'
import NotFound from './components/NotFound'
import Results from './components/Results'
import ProtectedRoute from './components/ProtectedRoute'

import ScoreTimeContext from './context/ScoreTimeContext'

import './App.css'

class App extends Component {
  state = {minutes: 10, seconds: 0, score: 0}

  updateStateValues = (min, sec, sco) => {
    this.setState({minutes: min, seconds: sec, score: sco})
  }

  render() {
    const {score, minutes, seconds} = this.state
    return (
      <ScoreTimeContext.Provider
        value={{
          score,
          minutes,
          seconds,
          updateStateValues: this.updateStateValues,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/assessment" component={Assessment} />
          <ProtectedRoute exact path="/results" component={Results} />
          <Route exact path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </ScoreTimeContext.Provider>
    )
  }
}

export default App
