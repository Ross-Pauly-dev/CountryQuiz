import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import QuizInProgress from './pages/QuizInProgress'
import Results from './pages/Results'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter basename="/CountryQuiz">
      <Routes>
        <Route path="/quiz" element={<QuizInProgress />} />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/quiz" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
