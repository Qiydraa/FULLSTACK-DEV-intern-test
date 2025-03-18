import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/inventory" element={<Inventory />} />
            </Routes>
        </Router>
    );
}

export default App;
