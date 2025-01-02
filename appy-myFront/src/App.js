import { BrowserRouter,Routes,Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Chap from "./components/Chap";
 


function App() {
  return (
    <div>

      <BrowserRouter>
            <Routes>
         
              <Route path="/home" element= { <Chap/>} />
              <Route path="/register" element= { <Register/>} />
              <Route path="/login" element= { <Login/>} />
              <Route path="/*" element= { <Login/>} />
            </Routes>
        </BrowserRouter>
      
    </div>
  );
}

export default App;
