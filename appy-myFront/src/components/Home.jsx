import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../components/Home.css';  
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();


  const fetchAllUsers = async () => {
    const accessToken = Cookies.get("accessToken");  
    
    if (!accessToken) {
      console.warn("Token manquant, redirection vers la page de connexion.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8083/api/users", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,  
        }
      });

      console.log("Données des utilisateurs :", response.data);
      setUsers(response.data);

    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);

      if (error.response) {
        const { status } = error.response;
        if (status === 401 || status === 403) {
          console.warn("Token invalide ou expiré, redirection vers la connexion.");
          navigate("/login");
        } else {
          alert(`Erreur ${status}: ${error.response.data?.message || "Une erreur est survenue."}`);
        }
      } else {
        alert("Erreur réseau ou serveur injoignable.");
      }
    }
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    Cookies.remove("accessToken");  
    Cookies.remove("refreshToken"); 
    navigate("/login");  
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="fb-profile-block">
            <div className="fb-profile-block-thumb cover-container"></div>
            <div className="profile-img">
              <a href="#">
                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="" title="" />
              </a>
            </div>
            <div className="profile-name">
              <h2>Profile ici </h2>
            </div>
            
            <div className="fb-profile-block-menu">
              <div className="block-menu">
                <ul>
                  <li><a href="/home">Accueil</a></li>
                  <li><a href="#">Groupes</a></li>
                  <li> <a href="#"  onClick={handleLogout}> Déconnexion   </a></li>
                </ul>
              </div>
        
            </div>
          </div>
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nom d'utilisateur</th>
            <th scope="col">Rôles</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>
  {user.appRoles.map(role => role.name)
    ? user.appRoles.map(role => role.name).join(", ") 
    : "USER"}
</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
