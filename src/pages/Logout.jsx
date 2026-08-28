import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // DELETE THE TOKEN
    localStorage.removeItem("userInfo"); // if you saved this too
    navigate("/login"); // send them back to login
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}

export default Logout;
