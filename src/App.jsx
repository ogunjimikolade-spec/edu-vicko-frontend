import Classes from "./pages/Classes";
import Dashboard from "./pages/Dashboard";
import Fees from "./pages/Fees";
import Login from "./pages/Login";
import ProtectedLayout from "./components/ProtectedLayout";
import Register from "./pages/Register";
import Registration from "./pages/Registration";
import Results from "./pages/Results";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/regster" element={<Register />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/results" element={<Results />} />
          <Route path="/Fees" element={<Fees />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
