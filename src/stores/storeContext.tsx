import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { rootStore } from './rootStore'
import type { RootStore } from './rootStore'

const StoreContext = createContext<RootStore>(rootStore)

export function StoreProvider({
  children,
  value,
}: {
  children: ReactNode
  value?: RootStore
}) {
  return (
    <StoreContext.Provider value={value ?? rootStore}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}


