import { Highlight, Span } from './styled'

interface FormattedLabelProps {
  label: string
  value: string
}

const FormattedLabel: React.FC<FormattedLabelProps> = ({ label, value }) => {
  if (!value) {
    return <> </>
  }
  const splittedString = label && value ? label?.split(value) : ['']

  const splittedLabel = splittedString.map((s, i) => (
    <span key={s + i}>{s}</span>
  ))
  return (
    <Span as="span">
      {splittedLabel.reduce<JSX.Element | JSX.Element[]>((prev, current, i) => {
        if (!i) {
          return [current]
        }
        return (
          <span>
            {prev}
            <Highlight as="span" key={value + current}>
              {value}
            </Highlight>
            {current}
          </span>
        )
      }, <span />)}
    </Span>
  )
}

export default FormattedLabel
