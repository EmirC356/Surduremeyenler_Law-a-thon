'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { CompanyDataset, mockRiskCompany, mockCompliantCompany } from './mockData';

export { mockRiskCompany, mockCompliantCompany };

type DatasetContextType = {
  activeDataset: CompanyDataset;
  setActiveDataset: (dataset: CompanyDataset) => void;
};

const DatasetContext = createContext<DatasetContextType>({
  activeDataset: mockRiskCompany,
  setActiveDataset: () => {},
});

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [activeDataset, setActiveDataset] = useState<CompanyDataset>(mockRiskCompany);
  return (
    <DatasetContext.Provider value={{ activeDataset, setActiveDataset }}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset(): DatasetContextType {
  return useContext(DatasetContext);
}
