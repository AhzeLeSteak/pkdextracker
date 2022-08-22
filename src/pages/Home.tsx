import {Card} from "primereact/card";
import './Home.css';
import g1 from './img/g1.png'
import g2 from './img/g2.png'
import {useAuthContext} from "../firebase/AuthProvider";
import {Tooltip} from "primereact/tooltip";
import {useNavigate} from "react-router-dom";

const bg = [g1, g2];

function Home(){
    const {user, logout} = useAuthContext();
    const basePath = '/';
    const navigate = useNavigate();

    return <div className="grid" style={{marginTop: '10vh'}} >
        <div className="col-0 md:col-2 lg:col-2"></div>
        <div className="col-12 md:col-8 lg:col-8">
            <Tooltip target="#card-user"/>
            <Card className="card-blur mb-4 justify-content-center text-center" id="card-user" onClick={logout} style={{cursor: 'pointer'}} data-pr-tooltip="Se déconnecter">
                <div className="grid">
                    <div className="col-1">
                        {user && user.photoURL && <img referrerPolicy="no-referrer" src={user.photoURL} style={{borderRadius: '100%'}} className="ml-1 mr-1" width={30} alt="userPP"/>}
                    </div>
                    <div className="col-11" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: '55px'}}>
                        Connecté en tant que {user?.displayName}
                    </div>
                </div>
            </Card>
            <Card className="card-blur mb-4" id="card-gens">
                {bg.map((i, g) =>
                    <div key={g} onClick={() => navigate(basePath+(g+1))} className="glass-button pt-3 pb-3" style={{backgroundImage: `url(${g < bg.length ? bg[g] : g2})`}}>
                        Génération {g+1}
                    </div>)}
            </Card>
            {/*<Card className="card-blur" id="card-gens" style={{cursor: 'pointer', textAlign: "center"}} onClick={() => navigate(basePath+'how-to')}>*/}
            {/*    Comment ça marche ?*/}
            {/*</Card>*/}

        </div>

    </div>
}

export default Home;
