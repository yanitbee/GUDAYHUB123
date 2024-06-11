import Freelancerlist from "../components/employer/freelancerlist";
import EmployerProfile from "../components/employer/EmployerProfile";
import Messenger from "../Pages/messenger/Messenger"



export default function Employerpage() {

    return (
        <>
            <EmployerProfile />
            <Freelancerlist  />
            <Messenger />
         
        </>
    );
}
