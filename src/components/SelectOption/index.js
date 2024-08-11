import './index.css'

const SelectOption = props => {
  const {optionDetails} = props
  const {id, text} = optionDetails

  return (
    <option className="option-select" value={id}>
      {text}
    </option>
  )
}

export default SelectOption
