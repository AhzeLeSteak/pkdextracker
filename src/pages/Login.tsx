import {Card} from "primereact/card";
import {useAuthContext} from "../firebase/AuthProvider";

function Login(){

    const {login} = useAuthContext();

    return <div className="grid" style={{overflowY: 'hidden'}}>
        <div className="col-0 md:col-3 lg:col-5"></div>
        <div className="col-12 md:col-6 lg:col-2">
            <Card style={{marginTop: '40vh'}} className="card-blur">
                <h2 className="text-center">Pkdex Tracker</h2>
                <small className="text-center" style={{display: 'block'}}>Veuillez vous connecter pour continuer</small>
                <button className="p-button p-button-primary mt-4 justify-content-center"
                        style={{width: '100%'}} onClick={login}>Se connecter</button>
            </Card>

        </div>

    </div>
}
export default Login;
