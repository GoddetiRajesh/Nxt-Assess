import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-container">
      <div className="instructions-container">
        <h1 className="instructions-heading">Instructions</h1>
        <ol className="instructions-list">
          <li className="list-text">
            Total Questions: <span className="text">10</span>
          </li>
          <li className="list-text">
            Types of Questions: <span className="text">MCQs</span>
          </li>
          <li className="list-text">
            Duration: <span className="text">10 Mins</span>
          </li>
          <li className="list-text">
            Marking Scheme:
            <span className="text"> Every Correct response, get 1 mark</span>
          </li>
          <li className="list-text">
            All the progress will be lost, if you reload during the assessment
          </li>
        </ol>
        <Link className="start-link" to="/assessment">
          <button type="button" className="start-button">
            Start Assessment
          </button>
        </Link>
      </div>
      <img
        className="assess-bg"
        src="https://res.cloudinary.com/dtomajdlh/image/upload/v1721643199/assess-bg.png"
        alt="assessment"
      />
    </div>
  </>
)
export default Home
