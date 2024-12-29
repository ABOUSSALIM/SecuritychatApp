import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Cookies from 'js-cookie';
import '../components/Login.css';  
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    const [username, setUsername] = useState("");  
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function login(event) {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8083/api/login", {
                username: username,
                password: password,
            });

            console.log(response.data);

            const accessToken = response.data["access-token"];
            const refreshToken = response.data["refresh-token"];
           // cookies.set("token", accessToken);
           Cookies.set("accessToken", accessToken, { path: '/' });
           Cookies.set("refreshToken", refreshToken, { path: '/' });
           
            navigate('/home'); 
            

        } catch (err) {
            alert("Password ou Username incorrect !");
        }
    }

    return (
        <div className="login-clean">
            <form onSubmit={login}>
                <h2 className="text-center"><strong>Login</strong> </h2>
                <div className="illustration">
                    <i className="icon ion-ios-navigate"></i>
                </div>
                <div className="form-group">
                    <input
                        className="form-control"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    required/>
                </div>
                <div className="form-group">
                    <input
                        className="form-control"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    required/>
                </div>
                <div className="form-group">
                    <button className="btn btn-primary btn-block" type="submit">
                       Se connecter
                    </button>
                </div>
                <a href="#" className="forgot">
                    Oublier username ou password ?
                </a>
                <div className="sign-up-link mt-3 text-center">
                    <p>Pas encore inscrit ? <a href="/register">S'inscrire ici</a></p>
                </div>
            </form>
        </div>
    );
}

export default Login;


