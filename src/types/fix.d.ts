import * as React from 'react'

declare module 'react' {
  interface IntrinsicAttributes {
    children?: React.ReactNode
  }
}
