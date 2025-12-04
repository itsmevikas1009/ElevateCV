import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <>
      <div className="app">
        <NavBar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default App;
