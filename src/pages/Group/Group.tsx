import {useGroup} from "../../hooks/useGroup";
import {InGroup} from "./InGroup";
import {NotInGroup} from "./NotInGroup";

export const Group = () => {
    const {inGroup} = useGroup();
    return inGroup ? <InGroup/> : <NotInGroup/>;
}


