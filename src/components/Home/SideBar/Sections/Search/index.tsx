import { useState } from 'react'
import Text from 'src/components/Core/Text'
import InputText from 'src/components/Core/InputText'
import useContextFile from 'src/hooks/useContextFile'
import FileMatch from './FileMatch'

import {
  InputContainer,
  CaseSensitiveContainer,
  Container,
  Title,
  Form
} from './styled'
import CaseSensitive from 'public/icons/case-sensitive.svg'
import Replace from 'public/icons/replace.svg'

const Search: React.FC = () => {
  const { files, setFiles } = useContextFile()
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

  const replace = (): void => {
    const newFiles = files.map(file => {
      const { path } = file
      const queryRegex = new RegExp(query, `g${caseInsensitive ? 'i' : ''}`)
      const newContent = file?.newContent?.replace(queryRegex, replacer)

      return { ...file, path, newContent }
    })
    setFiles(newFiles)
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
            <Replace />
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
            <FileMatch
              query={query}
              path={path}
              lines={lines}
              file={file.path}
              i={i}
              key={path + i}
            ></FileMatch>
          ))}
      </>
    </Container>
  )
}

export default Search
