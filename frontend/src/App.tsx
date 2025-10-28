import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Game } from './pages/Game'
import { Login } from './pages/Login'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './lib/ProtectedRoute'
import Profile from './pages/Profile'

function App() {

    return <div className='h-screen overflow-y-auto'>
        <BrowserRouter basename='/'>
            <AuthProvider>
                {/* <Topbar /> */}
                <Routes>
                    <Route path="/" element={<Landing />}></Route>
                    <Route path="/game" element={<ProtectedRoute><Game /></ProtectedRoute>}></Route>
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
                    <Route path="/login" element={<Login /> } ></Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </div>
}

export default App
