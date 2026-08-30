import Classes from "./pages/Classes";
import Dashboard from "./pages/Dashboard";
import Fees from "./pages/Fees";
import Login from "./pages/Login";
import ProtectedLayout from "./components/ProtectedLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Registration from "./pages/Registration";
import Results from "./pages/Results";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/results" element={<Results />} />
            <Route path="/fees" element={<Fees />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
