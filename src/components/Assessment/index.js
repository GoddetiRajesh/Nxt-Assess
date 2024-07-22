import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Assessment extends Component {
  state = {apiStatus: apiStatusConstants.initial, questionsData: []}

  componentDidMount() {
    this.getQuestionsData()
  }

  getQuestionsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const response = await fetch('https://apis.ccbp.in/assess/questions')
    const data = await response.json()
    console.log(response.status)
    if (response.ok) {
      const {questions} = data
      const updatedData = questions.map(eachItem => ({
        id: eachItem.id,
        questionText: eachItem.question_text,
        optionsType: eachItem.options_type,
        options: eachItem.options.map(eachValue => ({
          id: eachValue.id,
          text: eachValue.text,
          isCorrect: eachValue.is_correct,
        })),
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        questionsData: updatedData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickRetry = () => {
    this.getQuestionsData()
  }

  renderLoadingView = () => (
    <>
      <Header />
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#263868" height={50} width={50} />
      </div>
    </>
  )

  renderFailureView = () => (
    <>
      <Header />
      <div className="loader-container">
        <img
          className="failure-view-image"
          src="https://res.cloudinary.com/dtomajdlh/image/upload/v1721652866/Oops.png"
          alt="failure view"
        />
        <h1 className="failure-view-heading">Oops! Something went wrong</h1>
        <p className="failure-view-description">We are having some trouble</p>
        <button
          onClick={this.onClickRetry}
          type="button"
          className="failure-view-button"
        >
          Retry
        </button>
      </div>
    </>
  )

  renderSuccessView = () => {
    const {questionsData} = this.state
    return (
      <>
        <Header />
        <h1>{questionsData[0].questionText}</h1>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderSuccessView()
      case 'FAILURE':
        return this.renderFailureView()
      default:
        return this.renderLoadingView()
    }
  }
}

export default Assessment
