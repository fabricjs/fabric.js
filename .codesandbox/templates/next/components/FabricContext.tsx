import { createContext, useContext } from 'react';

export const FabricContext = createContext(null);

export function useFabric() {
  return useContext(FabricContext)!;
}
