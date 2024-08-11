import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import TextOption from '../TextOption'
import ImageOption from '../ImageOption'
import QuestionNo from '../QuestionNo'
import SelectOption from '../SelectOption'

import ScoreTimeContext from '../../context/ScoreTimeContext'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

let timerId = ''

class Assessment extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    questionsData: [],
    answered: 0,
    unanswered: 0,
    activeQuestionId: '',
    minutes: 10,
    seconds: 0,
  }

  componentDidMount() {
    this.getQuestionsData()
    this.timer()
  }

  componentWillUnmount() {
    clearInterval(timerId)
  }

  updateTime = () => {
    const {seconds, minutes} = this.state
    if (minutes >= 0) {
      if (seconds === 0 && minutes > 0) {
        this.setState(prev => ({seconds: 59, minutes: prev.minutes - 1}))
      } else if (seconds > 0) {
        this.setState(prev => ({seconds: prev.seconds - 1}))
      }
    }
  }

  timer = () => {
    timerId = setInterval(() => {
      this.updateTime()
    }, 1000)
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
          imageUrl: eachValue.image_url,
          isCorrect: eachValue.is_correct,
        })),
        questionNo: questions.indexOf(eachItem) + 1,
        activeOptionId: '',
        correctOptionId: eachItem.options.filter(
          eachValue => eachValue.is_correct === 'true',
        )[0].id,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        questionsData: updatedData,
        unanswered: data.total,
        activeQuestionId: updatedData[0].id,
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

  updateCountDetails = () => {
    const {questionsData, activeQuestionId, answered} = this.state
    const filiteredData = questionsData.filter(
      eachItem => eachItem.id === activeQuestionId,
    )
    if (filiteredData[0].optionsType === 'SINGLE_SELECT' && answered === 0) {
      this.setState({answered: 1, unanswered: questionsData.length - 1})
    } else {
      const count = questionsData.filter(
        eachItem => eachItem.activeOptionId !== '',
      ).length
      this.setState({answered: count, unanswered: questionsData.length - count})
    }
  }

  updateActiveOptionId = id => {
    const {activeQuestionId, questionsData} = this.state
    const activeQuestion = questionsData.filter(
      eachItem => eachItem.id === activeQuestionId,
    )
    const {activeOptionId} = activeQuestion[0]
    if (activeOptionId !== '' && activeOptionId === id) {
      this.setState(
        prev => ({
          questionsData: prev.questionsData.map(eachItem => {
            if (eachItem.id === activeQuestionId) {
              return {...eachItem, activeOptionId: ''}
            }
            return {...eachItem}
          }),
        }),
        this.updateCountDetails,
      )
    } else {
      this.setState(
        prev => ({
          questionsData: prev.questionsData.map(eachItem => {
            if (eachItem.id === activeQuestionId) {
              return {...eachItem, activeOptionId: id}
            }
            return {...eachItem}
          }),
        }),
        this.updateCountDetails,
      )
    }
  }

  selectOption = event => {
    this.updateActiveOptionId(event.target.value)
  }

  updateActiveQuestionId = () => {
    const {activeQuestionId, questionsData} = this.state
    const filiteredData = questionsData.filter(
      eachItem => eachItem.id === activeQuestionId,
    )
    const {questionNo} = filiteredData[0]
    this.setState(
      {activeQuestionId: questionsData[questionNo].id},
      this.updateCountDetails,
    )
  }

  onClickQuestionNo = id => {
    this.setState({activeQuestionId: id}, this.updateCountDetails)
  }

  renderSuccessView = () => (
    <ScoreTimeContext.Consumer>
      {value => {
        const {
          questionsData,
          activeQuestionId,
          answered,
          unanswered,
          minutes,
          seconds,
        } = this.state
        const filiteredData = questionsData.filter(
          eachItem => eachItem.id === activeQuestionId,
        )
        const {questionText, questionNo, optionsType, options, activeOptionId} =
          filiteredData[0]

        const score = questionsData.filter(
          eachItem => eachItem.activeOptionId === eachItem.correctOptionId,
        ).length
        const {updateStateValues} = value
        const submitAssessment = () => {
          updateStateValues(minutes, seconds, score)
          const {history} = this.props
          history.replace('/results')
        }

        if (minutes === 0 && seconds === 0) {
          submitAssessment()
        }

        return (
          <>
            <Header />
            <div className="assessment-container">
              <div className="question-container">
                <div>
                  <p className="question-text">
                    {questionNo}. {questionText}
                  </p>
                  <hr className="line" />
                  {optionsType === 'DEFAULT' && (
                    <ul className="options-list-container">
                      {options.map(eachItem => (
                        <TextOption
                          key={eachItem.id}
                          optionDetails={eachItem}
                          updateActiveOptionId={this.updateActiveOptionId}
                          activeOptionId={activeOptionId}
                        />
                      ))}
                    </ul>
                  )}
                  {optionsType === 'IMAGE' && (
                    <ul className="options-list-container">
                      {options.map(eachItem => (
                        <ImageOption
                          key={eachItem.id}
                          optionDetails={eachItem}
                          updateActiveOptionId={this.updateActiveOptionId}
                          activeOptionId={activeOptionId}
                        />
                      ))}
                    </ul>
                  )}
                  {optionsType === 'SINGLE_SELECT' && (
                    <select
                      onChange={this.selectOption}
                      className="select-container"
                    >
                      {options.map(eachItem => (
                        <SelectOption
                          key={eachItem.id}
                          optionDetails={eachItem}
                          activeOptionId={activeOptionId}
                        />
                      ))}
                    </select>
                  )}
                </div>
                {optionsType === 'SINGLE_SELECT' && (
                  <div className="default-container">
                    <button type="button" className="default-icon">
                      !
                    </button>
                    <p className="default-text">
                      First option is selected by default
                    </p>
                  </div>
                )}
                {questionNo < 10 && (
                  <button
                    onClick={this.updateActiveQuestionId}
                    type="button"
                    className="next-button"
                  >
                    Next Question
                  </button>
                )}
              </div>
              <div className="overview-container">
                <div className="timer-container">
                  <p className="timer-heading">Time Left</p>
                  <p className="end-time">{`00:${
                    minutes < 10 ? `0${minutes}` : minutes
                  }:${seconds < 10 ? `0${seconds}` : seconds}`}</p>
                </div>
                <div className="submit-container">
                  <div className="count-container">
                    <div className="answered-container">
                      <p className="answered-count">{answered}</p>
                      <p className="answered-text">Answered Questions</p>
                    </div>
                    <div className="answered-container">
                      <p className="unanswered-count">{unanswered}</p>
                      <p className="answered-text">Unanswered Questions</p>
                    </div>
                  </div>
                  <hr className="line" />
                  <div className="question-no-container">
                    <div>
                      <h1 className="questions-title">
                        Questions ({answered + unanswered})
                      </h1>
                      <ul className="qno-list-container">
                        {questionsData.map(eachItem => (
                          <QuestionNo
                            key={eachItem.id}
                            details={eachItem}
                            activeQuestionId={activeQuestionId}
                            onClickQuestionNo={this.onClickQuestionNo}
                          />
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={submitAssessment}
                      type="button"
                      className="submit-button"
                    >
                      Submit Assessment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }}
    </ScoreTimeContext.Consumer>
  )

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
