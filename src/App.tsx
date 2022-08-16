import './App.css';
import PokeList from "./pages/PokeList";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import {useAuthContext} from "./firebase/AuthProvider";
import {SearchToolbar} from "./components/SearchToolbar";

const GENERATIONS = Array.from({length: 8}, (_, i) => i);

function App() {

    const {user} = useAuthContext();

    return <div className="App">
        <div className="background"></div>
        <BrowserRouter>
            <Routes>
                {GENERATIONS.map(g => <Route key={g} path={'/'+(g+1)} element={
                    <SearchToolbar genIndex={g}>
                        <PokeList/>
                    </SearchToolbar>
                }/>)}
                <Route path="/" element={user ? <Home/> : <Login/>}/>
                <Route path="/*" element={<Navigate to="/"/>}/>
            </Routes>
        </BrowserRouter>
    </div>

}

export default App;
