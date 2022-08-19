import './App.css';
import PokeList from "./pages/PokeList";
import {BrowserRouter, Navigate, Route, Routes, useLocation} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import {useAuthContext} from "./firebase/AuthProvider";

const GENERATIONS = Array.from({length: 8}, (_, i) => i);

const Test = (props: any) => {
    console.log(props);
    const l = useLocation();
    console.log(l);
    return <></>;
}

function App() {

    const {user} = useAuthContext();

    const basePath = process.env.NODE_ENV === 'production' ?
        '/pkdextracker/' : '/';

    return <div className="App">
        <div className="background"></div>
        <BrowserRouter>
            <Routes>
                {GENERATIONS.map(g => <Route key={g} path={basePath+(g+1)} element={<PokeList genIndex={g}/>}/>)}
                <Route path={basePath} element={user ? <Home/> : <Login/>}/>
                <Route path={basePath + '*'} element={<Test/>}/>
            </Routes>
        </BrowserRouter>
    </div>

}

export default App;
