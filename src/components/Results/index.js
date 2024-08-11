import {Link} from 'react-router-dom'

import Header from '../Header'
import ScoreTimeContext from '../../context/ScoreTimeContext'

import './index.css'

const Results = () => (
  <ScoreTimeContext.Consumer>
    {value => {
      const {minutes, seconds, score} = value
      const min = 9 - minutes
      const sec = 60 - seconds

      return (
        <>
          <Header />
          <div className="results-container">
            <div className="score-container">
              {minutes === 0 && seconds === 0 ? (
                <>
                  <img
                    className="results-image"
                    src="https://res.cloudinary.com/dtomajdlh/image/upload/v1721898995/TimeUp.png"
                    alt="time up"
                  />
                  <h1 className="time-up-text">Time is up!</h1>
                  <p className="time-up-description">
                    You did not complete the assessment within the time.
                  </p>
                </>
              ) : (
                <>
                  <img
                    className="results-image"
                    src="https://res.cloudinary.com/dtomajdlh/image/upload/v1721899006/Congrats.png"
                    alt="submit"
                  />
                  <h1 className="congrats-text">
                    Congrats! You completed the assessment.
                  </h1>
                  <p className="time-taken">
                    Time Taken:
                    <p className="time">{`00:${min < 10 ? `0${min}` : min}:${
                      sec < 10 ? `0${sec}` : sec
                    }`}</p>
                  </p>
                </>
              )}
              <p className="score-text">
                Your Score: <p className="score">{score}</p>
              </p>
              <Link to="/assessment" className="link-button">
                <button type="button" className="reattempt">
                  Reattempt
                </button>
              </Link>
            </div>
          </div>
        </>
      )
    }}
  </ScoreTimeContext.Consumer>
)

export default Results
