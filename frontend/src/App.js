import CitizenRequestAnimal from "./pages/CitizenRequestAnimal";
import AcceptedRequest from "./pages/AcceptedRequest";
import AcceptedRequestSpayingCats from "./pages/AcceptedRequestSpayingCats";
import CitizenRequestSpayingCats from "./pages/CitizenRequestSpayingCats";
import CenterRequestAnimal from "./pages/CenterRequestAnimal";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
    <Router>
      <div className="container">
        <Routes>
          <Route path='/' element={<Navigate to='/citizenRequestAnimal' replace />} />
          <Route path="/citizenRequestAnimal" element={<CitizenRequestAnimal />}/>
          <Route path="/citizenRequestAnimal/:sequenceID" element={<AcceptedRequest />}/>
          <Route path="/citizenRequestSpayingCats" element={<CitizenRequestSpayingCats />}/>
          <Route path="/citizenRequestSpayingCats/:sequenceID" element={<AcceptedRequestSpayingCats />} />
          <Route path="/centerRequestAnimal" element={<CenterRequestAnimal />}/>
        </Routes>
      </div>
    </Router>
    <ToastContainer />  

        
     
    </>
  );
}

export default App;
