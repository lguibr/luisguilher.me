import React from 'react'
import { render, screen } from '@testing-library/react'
import SplittableContainer from './index'

// Mock react-resizable-panels
jest.mock('react-resizable-panels', () => ({
  PanelGroup: ({ children, direction }: any) => (
    <div data-testid="panel-group" data-direction={direction}>
      {children}
    </div>
  ),
  Panel: ({ children, defaultSize }: any) => (
    <div data-testid="panel" data-size={defaultSize}>
      {children}
    </div>
  ),
  PanelResizeHandle: () => <div data-testid="resize-handle" />
}))

// Mock useWindowSize
jest.mock('src/hooks/useWindow', () => ({
  __esModule: true,
  default: () => ({ isMedium: false })
}))

describe('SplittableContainer', () => {
  it('renders target view correctly', () => {
    render(
      <SplittableContainer
        id={1}
        targetView={<div data-testid="target">Target</div>}
      />
    )
    expect(screen.getByTestId('target')).toBeInTheDocument()
  })

  it('renders new view and resize handle when newView is provided', () => {
    render(
      <SplittableContainer
        id={1}
        targetView={<div>Target</div>}
        newView={<div data-testid="new">New</div>}
      />
    )
    expect(screen.getByTestId('new')).toBeInTheDocument()
    expect(screen.getByTestId('resize-handle')).toBeInTheDocument()
  })

  it('uses correct direction', () => {
    render(
      <SplittableContainer
        id={1}
        targetView={<div>Target</div>}
        direction="vertical"
      />
    )
    expect(screen.getByTestId('panel-group')).toHaveAttribute(
      'data-direction',
      'vertical'
    )
  })
})
