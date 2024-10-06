import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route,Routes } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import ForgotPassPage from "./Pages/ForgotPassPage";
import ResetPassPage from "./Pages/ResetPassPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<Chatpage />} />
        <Route path="/forgot-password" element={<ForgotPassPage />} />
        <Route path="/reset-password" element={<ResetPassPage />} />
      </Routes>
    </div>
  );
}

export default App;
