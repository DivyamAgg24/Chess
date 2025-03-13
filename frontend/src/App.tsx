import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Game } from './pages/Game'

function App() {

    return <div className='bg-stone-700 max-h-screen h-screen'>
        <BrowserRouter basename='/'>
            <Routes>
                <Route path="/" element={<Landing />}></Route>
                <Route path="/game" element={<Game />}></Route>
            </Routes>
        </BrowserRouter>
    </div> 
}

export default App
