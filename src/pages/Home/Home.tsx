import {Card} from "primereact/card";
import './Home.css';
import g1 from './img/g1.png'
import g2 from './img/g2.png'
import {useAuthContext} from "../../firebase/AuthProvider";
import {Tooltip} from "primereact/tooltip";
import {useNavigate} from "react-router-dom";
import {Button} from "primereact/button";
import {Badge} from "primereact/badge";
import {useInvitation} from "../../hooks/useGroup";

const bg = [g1, g2];

function Home(){
    const {user, logout} = useAuthContext();
    const navigate = useNavigate();
    const invitation = useInvitation().length;

    return <div className="grid" style={{marginTop: '10vh'}} >
        <div className="col-0 md:col-2 lg:col-2"></div>
        <div className="col-12 md:col-8 lg:col-8">
            <Card className="card-blur mb-4 justify-content-center text-center" id="card-user" data-pr-tooltip="Se déconnecter">
                <div className="grid">
                    <div className="col-3" style={{display: 'flex', justifyContent: 'left'}}>
                        <Tooltip target="#userPP"/>
                        <Tooltip target="#logout"/>
                        <Tooltip target="#group"/>
                        {user && user.photoURL &&
                            <img referrerPolicy="no-referrer"
                                 src={user.photoURL}
                                 style={{borderRadius: '100%'}}
                                 className="ml-1 mr-1 action-btn"
                                 id="userPP"
                                 data-pr-tooltip={'Connecté en tant que '+user.displayName}
                                 alt="userPP"/>
                        }
                        <Button  data-pr-tooltip="Se déconnecter" icon="pi pi-power-off" id="logout"
                                 className="p-button-rounded p-button-danger action-btn"
                                 onClick={logout}
                        ></Button>
                        <Button  data-pr-tooltip="Gestion du groupe" icon="pi pi-users" id="group"
                                 className=" p-button-sm ml-1"
                                 style={{ height: '30px'}}
                                 onClick={() => navigate('/group')}
                        >
                            {invitation > 0 && <Badge value={invitation}></Badge>}
                        </Button>
                    </div>
                    <div className="col" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: '55px'}}>
                        Connecté en tant que {user?.displayName}
                    </div>
                </div>
            </Card>
            <Card className="card-blur mb-4" id="card-gens">
                {bg.map((i, g) =>
                    <div key={g} onClick={() => navigate((g+1).toString())} className="glass-button pt-3 pb-3" style={{backgroundImage: `url(${g < bg.length ? bg[g] : g2})`}}>
                        Génération {g+1}
                    </div>)}
            </Card>
            <Card className="card-blur" id="card-gens" style={{cursor: 'pointer', textAlign: "center"}} onClick={() => navigate('how-to')}>
                Comment ça marche ?
            </Card>

        </div>

    </div>
}

export default Home;
