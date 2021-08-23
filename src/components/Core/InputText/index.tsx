import { Input } from './styled'

export type InputTextProps = {
  value?: string
  id?: string
  name?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputText: React.FC<InputTextProps> = ({ value, onChange, id, name }) => {
  return (
    <Input value={value} id={id} name={name} onChange={onChange} type="text" />
  )
}

export default InputText
