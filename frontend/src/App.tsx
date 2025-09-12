import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Game } from './pages/Game'
import { Login } from './pages/Login'
import { AuthProvider } from './contexts/AuthContext'

function App() {

    return <div className='h-screen overflow-y-auto'>
        <BrowserRouter basename='/'>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Landing />}></Route>
                    <Route path="/game" element={<Game />}></Route>
                    <Route path="/login" element={<Login />} ></Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </div>
}

export default App
