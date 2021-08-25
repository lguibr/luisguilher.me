import { useState } from 'react'

import {
  Container,
  Content,
  Option,
  Background,
  TextComponent,
  OptionContainer
} from './styled'

type Option = {
  labels: string[]
  onClick: () => void
}

type FloatMenuProps = {
  options?: Option[]
}

const FloatMenu: React.FC<FloatMenuProps> = ({ options, children }) => {
  const [open, setOpen] = useState(false)

  return (
    <Container onClick={() => setOpen(!open)}>
      {children}
      {open && (
        <>
          <Background />
          <Content>
            {options?.map(({ labels, onClick }) => (
              <OptionContainer key={labels.join()} onClick={onClick}>
                <Option>
                  {labels.map(label => (
                    <TextComponent size={12} key={label}>
                      {label}
                    </TextComponent>
                  ))}
                </Option>
              </OptionContainer>
            ))}
          </Content>
        </>
      )}
    </Container>
  )
}

export default FloatMenu
