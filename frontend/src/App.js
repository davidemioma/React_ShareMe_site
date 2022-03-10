import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { fetchUser } from "./utils/fetchUser";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchUser();

    if (!user) navigate("/login", { replace: true });
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/*" element={<HomePage />} />
    </Routes>
  );
};

export default App;
