import { Container, Content, Info } from './styled'
import Text from 'src/components/Core/Text'
import { useState, useEffect } from 'react'

const Footer: React.FC = () => {
  const [text, setText] = useState('')
  const [messageIndex, setMessageIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const messages = [
    'Compiling...',
    'Refactoring the universe...',
    'Debugging life...',
    'Centering a div...',
    'Merging to main...',
    'Summoning AI...',
    'Optimizing spaghetti code...',
    'Deleting node_modules...',
    'Downloading more RAM...',
    'Asking Stack Overflow...',
    'Searching for semicolons...',
    'Whispering to the compiler...',
    'Fixing what I broke yesterday...',
    'Writing code that future me will hate...',
    'Blaming the intern...',
    'Pretending I understand regex...',
    'Aligning pixels...',
    'Sacrificing performance for readability...',
    'Turning coffee into code...',
    'Deploying to production... again...',
    'Running `npm audit fix`...',
    'Hoping tests will pass...',
    'Googling error messages...',
    'Spinning up dev environment...',
    'Reviewing my own PR...',
    'Chasing race conditions...',
    'Convincing TypeScript I’m right...',
    'Renaming variables for clarity...',
    'Waiting for CI...',
    'Breaking production accidentally...',
    'Breaking production intentionally...',
    'Fixing production before anyone notices...',
    'Reading legacy code like ancient scrolls...',
    'Copying from Stack Overflow...',
    'Pretending this was my idea...',
    'Adding TODOs I’ll never resolve...',
    'Teaching AI to code better than me...',
    'Searching for missing bracket...',
    'Moving fast and breaking things...',
    'Blaming caching...',
    'Blaming DNS...',
    'Blaming the frontend...',
    'Blaming the backend...',
    'Blaming the cloud...',
    'Questioning existence...',
    'Considering a career in farming...',
    'Remembering why I love this...',
    'Running benchmarks...',
    'Deploying hotfixes...',
    'Trying to reproduce bug...',
    'Toggling dark mode...',
    'Arguing with ESLint...',
    'Implementing the impossible...',
    'Rewriting everything for the 3rd time...',
    'Pushing directly to main (don’t tell anyone)...',
    'Reading documentation I’ll ignore...',
    'Generating API keys I’ll lose later...',
    'Chasing the perfect architecture...',
    'Adding more abstractions...',
    'Regretting added abstractions...',
    'Shipping features no one asked for...',
    'Removing console.logs like a ninja...',
    'Upgrading dependencies and praying...',
    'Waiting for Docker to build...',
    'Doing agile things...',
    'Debugging async issues...',
    'Teaching the compiler manners...',
    'Testing in production...',
    'Removing bugs by adding features...',
    'Explaining code to rubber duck...',
    'Beating merge conflicts into submission...',
    'Creating bugs faster than fixing them...',
    'Asking “why is this slow?”...',
    'Staring at logs until enlightenment...',
    'Pretending this is the last refactor...',
    'Achieving 100% test coverage (haha)...',
    'Touching grass...',
    'Compiling existential dread...',
    'Finetuning reality...',
    'Optimizing the optimizer...',
    'Loading creativity...',
    'Loading motivation...',
    'Loading sanity...',
    'Waiting for inspiration...',
    'Chasing AI hallucinations...',
    'Turning chaos into code...',
    'Releasing version 1.0.0 (finally)...'
  ]

  useEffect(() => {
    const currentMessage = messages[messageIndex]
    const typeSpeed = isDeleting ? 50 : 100

    const timer = setTimeout(() => {
      if (!isDeleting && text === currentMessage) {
        setTimeout(() => setIsDeleting(true), 1500)
      } else if (isDeleting && text === '') {
        setIsDeleting(false)
        setMessageIndex(
          (prev: number) =>
            (prev + Math.floor(Math.random() * 10)) % messages.length
        )
      } else {
        setText(
          currentMessage.substring(0, text.length + (isDeleting ? -1 : 1))
        )
      }
    }, typeSpeed)

    return () => clearTimeout(timer)
  }, [text, isDeleting, messageIndex, messages])

  return (
    <Container>
      <Content>
        <Info>
          <Text color="white" weight="600" size={13}>
            <span>
              {text}
              <span style={{ opacity: 0.5 }}>|</span>
            </span>
          </Text>
        </Info>
      </Content>
      <Content>
        <Info>
          <Text color="white" weight="600" size={13}>
            Made with ❤️
          </Text>
        </Info>
      </Content>
    </Container>
  )
}

export default Footer
