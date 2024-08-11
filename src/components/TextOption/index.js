import './index.css'

const TextOption = props => {
  const {optionDetails, updateActiveOptionId, activeOptionId} = props
  const {id, text} = optionDetails
  const onClickOption = () => {
    updateActiveOptionId(id)
  }
  const activeOption = activeOptionId === id ? 'active-option' : ''

  return (
    <li className="list-item">
      <button
        type="button"
        onClick={onClickOption}
        className={`text-list-item ${activeOption}`}
      >
        <p className="option-text">{text}</p>
      </button>
    </li>
  )
}

export default TextOption
