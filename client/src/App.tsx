import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Main } from "./containers";
import { Loading, Login } from "./pages";
import { pingServer } from "./service";
import { getCookie } from "./utils/api";

function App() {
  const [serverIsDown, setServerIsDown] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await pingServer();
        if (response) {
          setServerIsDown(false);
        } else {
          setServerIsDown(true);
        }
      } catch (err) {
        console.log("Server is Down, try refreshing");
        setServerIsDown(true);
      } finally {
        setLoading(false);
      }
    };
    checkServer();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App" style={{ height: "100%" }}>
      <Routes>
        <Route
          path="/*"
          element={
            serverIsDown ? (
              <Loading />
            ) : getCookie("AuthToken") ? (
              <Main />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            serverIsDown ? (
              <Loading />
            ) : !getCookie("AuthToken") ? (
              <Login />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
