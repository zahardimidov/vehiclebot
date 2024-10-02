import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './Components/Home/Home';
import Vehicle from './Components/Vehicle/Vehicle';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact={true} element={<Home />} />
        <Route path="/vehicle" element={<Vehicle />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;