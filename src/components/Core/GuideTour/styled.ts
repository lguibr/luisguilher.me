import dynamic from 'next/dynamic'

import styled from 'styled-components'

const Tour = dynamic(() => import('reactour'), { ssr: false })

export const TourComponent = styled(Tour)`
  &&& {
    background: ${({ theme }) => theme.colors.editorBackground};
    color: ${({ theme }) => theme.colors.text};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: 1all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-sizing: border-box;
    max-width: min(80%, 600px);
    :hover {
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
        0 10px 10px rgba(0, 0, 0, 0.22);
    }
    @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
      left: 10px;
      padding: 14px;
    }
  }
`

export const Container = styled.div``
