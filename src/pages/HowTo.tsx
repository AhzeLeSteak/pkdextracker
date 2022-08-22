import {useNavigate} from "react-router-dom";
import {Card} from "primereact/card";

export const HowTo = () => {

    const navigate = useNavigate();

    return <div className="grid" style={{overflowY: 'hidden'}}>
        <div className="col-0 md:col-1 lg:col-2"></div>
        <div className="col-12 md:col-10 lg:col-8">
            <Card style={{marginTop: '40vh'}} className="card-blur">

            </Card>
        </div>;
    </div>
}
