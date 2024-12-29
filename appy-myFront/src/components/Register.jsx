import { useState } from "react";
import axios from "axios";
import '../components/Register.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [agree, setAgree] = useState(false);

    async function save(event) {
        event.preventDefault();
        if (password !== passwordRepeat) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            await axios.post("http://localhost:8083/api/addUser", {
                username: username,
                password: password,
            });
            alert("Inscription réussie !");
            window.location.href = "/login";
        } catch (err) {
            alert("Erreur lors de l'inscription.");
        }
    }

    return (
        <div className="register-photo">
            <div className="form-container">
                <div className="image-holder"></div>
                <form onSubmit={save} action="/login">
                    <h2 className="text-center"><strong>Entrer vos Données</strong> </h2>
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
                        <input
                            className="form-control"
                            type="password"
                            name="password-repeat"
                            placeholder="Password a nouveau"
                            value={passwordRepeat}
                            onChange={(event) => setPasswordRepeat(event.target.value)}
                        required/>
                    </div>
                    
                    <div className="form-group">
                    </div>
                    <div className="form-group">
                    <button className="btn btn-primary btn-block container small" type="submit">
                       s'inscrire
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
