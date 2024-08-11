import './index.css'

const QuestionNo = props => {
  const {details, activeQuestionId, onClickQuestionNo} = props
  const {questionNo, id, activeOptionId} = details
  const activeQuestion = activeQuestionId === id ? 'active-question' : ''
  const answeredQuestion = activeOptionId !== '' ? 'answered-question' : ''
  const onClickButton = () => {
    onClickQuestionNo(id)
  }

  return (
    <li>
      <button
        onClick={onClickButton}
        className={`question-number ${activeQuestion} ${answeredQuestion}`}
        type="button"
      >
        {questionNo}
      </button>
    </li>
  )
}

export default QuestionNo
