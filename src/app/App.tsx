import { Navigate, Route, Routes } from 'react-router-dom'
import { BluetoothConnectPage } from '../bluetooth/ui/BluetoothConnectPage'
import { Basket } from '../basket/ui/Basket'
import { CatalogPage } from '../catalog/ui/CatalogPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/cart" element={<Basket />} />
      <Route path="/bluetooth" element={<BluetoothConnectPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}


