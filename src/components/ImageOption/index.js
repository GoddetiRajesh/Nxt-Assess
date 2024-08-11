import './index.css'

const ImageOption = props => {
  const {optionDetails, updateActiveOptionId, activeOptionId} = props
  const {id, text, imageUrl} = optionDetails
  const onClickOption = () => {
    updateActiveOptionId(id)
  }
  const activeOption = activeOptionId === id ? 'active-option-image' : ''

  return (
    <li className="li-item">
      <button
        onClick={onClickOption}
        className={`image-list-item ${activeOption}`}
        type="button"
      >
        <img className="image-option" src={imageUrl} alt={text} />
      </button>
    </li>
  )
}

export default ImageOption
