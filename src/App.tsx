import './App.css';
import PokeList from "./pages/PokeList";
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import {useAuthContext} from "./firebase/AuthProvider";
import {HowTo} from "./pages/HowTo/HowTo";
import {RetrieveData} from "./pages/RetrieveData/RetrieveData";
import {Group} from "./pages/Group";

const GENERATIONS = Array.from({length: 8}, (_, i) => i);

function App() {

    const {user} = useAuthContext();

    return <div className="App">
        <div className="background"></div>
        <HashRouter>
            <Routes>
                {GENERATIONS.map(g => <Route key={g} path={(g+1).toString()} element={user ? <PokeList genIndex={g}/> : <Navigate to={'/'}/>}/>)}
                <Route path={'how-to'} element={<HowTo/>}/>
                <Route path={'group'} element={<Group/>}/>
                <Route path={'dev'} element={<RetrieveData/>}/>
                <Route path={'/'} element={user ? <Home/> : <Login/>}/>
                <Route path={'/*'} element={<Navigate to={'/'}/>}/>
            </Routes>
        </HashRouter>
    </div>

}

export default App;
