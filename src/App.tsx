import './App.css';
import PokeList from "./pages/PokeList";
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import {useAuthContext} from "./firebase/AuthProvider";
import {HowTo} from "./pages/HowTo";

const GENERATIONS = Array.from({length: 8}, (_, i) => i);

function App() {

    const {user} = useAuthContext();

    const basePath = '/';

    return <div className="App">
        <div className="background"></div>
        <HashRouter>
            <Routes>
                {GENERATIONS.map(g => <Route key={g} path={basePath+(g+1)} element={user ? <PokeList genIndex={g}/> : <Navigate to={basePath}/>}/>)}
                <Route path={basePath} element={user ? <Home/> : <Login/>}/>
                <Route path={basePath+'how-to'} element={<HowTo/>}/>
                <Route path={'/*'} element={<Navigate to={basePath}/>}/>
            </Routes>
        </HashRouter>
    </div>

}

export default App;
