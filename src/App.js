import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/ConnectUI";
import NotInstalled from "./pages/NotInstalled";
import MobileDetector from "./utils/mobileDetector";

function App() {
    MobileDetector.initialize();
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/notInstalled" element={<NotInstalled />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
