import {Route, Switch, Redirect} from 'react-router-dom'

import Home from './components/Home'
import Assessment from './components/Assessment'
import Login from './components/Login'
import NotFound from './components/NotFound'
import Results from './components/Results'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/assessment" component={Assessment} />
    <ProtectedRoute exact path="/results" component={Results} />
    <Route exact path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
