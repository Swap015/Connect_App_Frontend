import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/footer";
import Header from "./components/header";
import About from "./pages/static-pages/About";
import Contact from "./pages/static-pages/Contact";
import Privacy from "./pages/static-pages/Privacy";
import Terms from "./pages/static-pages/Terms";
import Register from "./pages/dynamic-pages/Register";
import Login from "./pages/dynamic-pages/Login";
import Home from "./pages/dynamic-pages/Home";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />


        {/* Pages  */}
        <main className="flex-grow">
          <Routes>

            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />


          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
