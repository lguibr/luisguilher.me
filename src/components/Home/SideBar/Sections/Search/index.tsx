import { useState } from 'react'
import Text from 'src/components/Core/Text'
import InputText from 'src/components/Core/InputText'
import useContextFile from 'src/hooks/useContextFile'
import FileTile from 'src/components/Core/TileFile'
import {
  Highlight,
  InputContainer,
  CaseSensitiveContainer,
  Container,
  Title,
  MatchHeader,
  Match,
  FileMatch,
  MatchBody,
  ArrowIcon,
  Form
} from './styled'
import CaseSensitive from 'public/icons/case-sensitive.svg'

const Search: React.FC = () => {
  const { files, setFiles, openFile } = useContextFile()
  const [query, setQuery] = useState('')
  const [replacer, setReplacer] = useState('')
  const [caseInsensitive, setCaseInsensitive] = useState(false)

  const filesThatContainSearch = !caseInsensitive
    ? files.filter(({ newContent }) => newContent?.includes(query))
    : files
        .filter(({ newContent }) =>
          newContent?.toLowerCase().includes(query.toLowerCase())
        )
        .map(file => ({
          ...file,
          newContent: file?.newContent?.toLocaleLowerCase(),
          content: file?.content?.toLocaleLowerCase()
        }))

  const matches =
    (query &&
      filesThatContainSearch &&
      filesThatContainSearch.map(file => {
        const lines = file?.newContent?.includes(query)
          ? file?.newContent
          : file?.content
        const lineContentContainQuery =
          lines &&
          lines
            .split(/\r?\n/)
            .filter(line =>
              line?.toLocaleLowerCase().includes(query.toLowerCase())
            )

        return {
          path: file?.path,
          name: file?.name,
          lines: lineContentContainQuery,
          file
        }
      })) ||
    []

  const totalFilesMatched = matches.length
  let totalLinesMatched = 0

  matches?.forEach(match => {
    if (match && match?.lines) totalLinesMatched += match?.lines?.length
  })

  interface FormattedLabelProps {
    label: string
    value: string
  }

  const replace = (): void => {
    const newFiles = files.map(file => {
      const { path } = file
      const queryRegex = new RegExp(query, `g${caseInsensitive ? 'i' : ''}`)
      const newContent = file?.newContent
        ? file?.newContent.replace(queryRegex, replacer)
        : file?.content?.replace(queryRegex, replacer)
      return { ...file, path, newContent }
    })
    setFiles(newFiles)
  }

  const FormattedLabel = ({ label, value }: FormattedLabelProps) => {
    if (!value) {
      return <> </>
    }
    const splitedString = label && value ? label?.split(value) : ['']
    const splitedLabel = splitedString.map((s, i) => (
      <span key={s + i}>{s}</span>
    ))
    return (
      <span>
        {splitedLabel.reduce<JSX.Element | JSX.Element[]>(
          (prev, current, i) => {
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
          },
          <span />
        )}
      </span>
    )
  }

  return (
    <Container>
      <Title>
        <Text size={12}>SEARCH</Text>
      </Title>
      <Form>
        <InputContainer>
          <InputText
            onChange={e => setQuery(e?.target?.value)}
            value={query}
            id="query"
            name="query"
          ></InputText>
          <CaseSensitiveContainer
            caseInsensitive={caseInsensitive}
            onClick={() => setCaseInsensitive(!caseInsensitive)}
          >
            <CaseSensitive />
          </CaseSensitiveContainer>
        </InputContainer>
        <InputContainer>
          <InputText
            onChange={e => setReplacer(e?.target?.value)}
            value={replacer}
            id="replacer"
            name="replacer"
          ></InputText>
          <CaseSensitiveContainer onClick={() => replace()}>
            replace
          </CaseSensitiveContainer>
        </InputContainer>
      </Form>

      <>
        <Text>
          {totalLinesMatched > 0
            ? ` ${totalLinesMatched} results in ${totalFilesMatched} files`
            : ''}
        </Text>
        {matches &&
          matches?.map(({ path, lines, file }, i) => (
            <FileMatch key={path + i}>
              <MatchHeader>
                <div>
                  <ArrowIcon />
                </div>
                <FileTile folder={false} open={false} file={file} />
                <Text color="subString" size={13}>
                  {path}
                </Text>
              </MatchHeader>
              <MatchBody onClick={() => openFile(file)}>
                {lines &&
                  lines.map((line, j) => (
                    <Match key={i + j}>
                      <Text size={12}>
                        <FormattedLabel label={line} value={query} />
                      </Text>
                    </Match>
                  ))}
              </MatchBody>
            </FileMatch>
          ))}
      </>
    </Container>
  )
}

export default Search
