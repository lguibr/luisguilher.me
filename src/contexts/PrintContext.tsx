import { createContext, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import Printable from 'src/components/Core/Printable'
export type PrintContextType = {
  Printable: React.FC
  print: (() => void) | undefined
}

export const PrintContext = createContext({} as PrintContextType)

export const PrintProvider: React.FC = ({ children }) => {
  const printRef = useRef(null)
  const print = useReactToPrint({
    content: () => printRef.current
  })

  const PrintableComponent = () => <Printable printRef={printRef} />

  return (
    <PrintContext.Provider
      value={{
        print,
        Printable: PrintableComponent
      }}
    >
      {children}
    </PrintContext.Provider>
  )
}
