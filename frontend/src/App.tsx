import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Game } from './pages/Game'
import { Login } from './pages/Login'

function App() {

    return <div className='h-screen overflow-y-auto'>
        <BrowserRouter basename='/'>
            <Routes>
                <Route path="/" element={<Landing />}></Route>
                <Route path="/game" element={<Game />}></Route>
                <Route path="login" element={<Login/>} ></Route>
            </Routes>
        </BrowserRouter>
    </div> 
}

export default App
