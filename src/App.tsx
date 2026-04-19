import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Index from './pages/Index'
import Analyze from './pages/Analyze'
import Result from './pages/Result'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/result" element={<Result />} />
        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  )
}
