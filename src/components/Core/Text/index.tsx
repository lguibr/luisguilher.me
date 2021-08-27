import theme from 'src/styles/theme'
import styled from 'styled-components'

const colors = theme?.['vs-dark'].colors

export type TextProps = {
  weight?: string
  font?: string
  size?: number
  color?: keyof typeof colors
  children?: JSX.Element | JSX.Element[] | string
  capitalize?: string
  uppercase?: string
  letterSpacing?: string
  lineHeight?: string
  opacity?: string
  fontStyle?: string
  clickable?: string
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'pre'
}

const Text = styled.p<TextProps>`
  margin: 0;
  font-weight: ${({ weight }) => weight};
  font-family: ${({ font }) => font};
  font-size: ${({ size }) => `${size}px`};
  line-height: ${({ lineHeight }) => lineHeight && `${lineHeight}px`};
  letter-spacing: ${({ letterSpacing }) =>
    letterSpacing && `${letterSpacing}px`};
  color: ${({ color, theme }) => color && theme.colors[color]};
  cursor: ${({ clickable }) => clickable && 'pointer'};
  text-transform: ${({ capitalize, uppercase }) =>
    capitalize ? 'capitalize' : uppercase ? 'uppercase' : 'inherit'};
  opacity: ${({ opacity }) => opacity};
`

const TextComponent: React.FC<TextProps> = ({
  weight,
  font,
  size,
  children,
  capitalize,
  uppercase,
  letterSpacing,
  lineHeight,
  opacity,
  fontStyle,
  clickable,
  color = 'text',
  as = 'p',
  ...rest
}) => {
  return (
    <Text
      as={as}
      weight={weight}
      font={font}
      size={size}
      color={color}
      capitalize={capitalize}
      uppercase={uppercase}
      letterSpacing={letterSpacing}
      lineHeight={lineHeight}
      opacity={opacity}
      fontStyle={fontStyle}
      clickable={clickable}
      {...rest}
    >
      {children}
    </Text>
  )
}

export default TextComponent
