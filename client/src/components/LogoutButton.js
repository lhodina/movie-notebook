import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LogoutButton = (props) => {
    const navigate = useNavigate();
    const logout = e => {
        axios.get("http://localhost:5000/logout", { withCredentials: true })
            .then(res => {
                console.log("logout res: ", res);
                navigate("/login");
            })
            .catch(err => console.log(err));
    }

    return (
        <button onClick={logout}>log out</button>
    )
}

export default LogoutButton
