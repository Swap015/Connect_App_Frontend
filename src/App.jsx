import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./components/footer";
import Header from "./components/header";
import About from "./pages/static-pages/About";
import Contact from "./pages/static-pages/Contact";
import Privacy from "./pages/static-pages/Privacy";
import Terms from "./pages/static-pages/Terms";
import Register from "./pages/dynamic-pages/Register";
import Login from "./pages/dynamic-pages/Login";
import Home from "./pages/dynamic-pages/Home.jsx";
import SavedPosts from "./pages/dynamic-pages/SavedPosts";
import LikedPosts from "./pages/dynamic-pages/Likedposts";
import ProfileVisits from "./pages/dynamic-pages/ProfileVisit";
import EditProfile from "./pages/dynamic-pages/EditProfile";
import NotificationsPage from "./pages/dynamic-pages/Notification.jsx";
import Messages from "./pages/dynamic-pages/Messages.jsx";
import Connections from "./pages/dynamic-pages/Connections.jsx";
import JobControl from "./pages/dynamic-pages/JobControl.jsx";
import JobApplications from "./pages/dynamic-pages/JobApplications.jsx";

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
            <Route path="/" element={<Home />} />
            <Route path="/savedPosts" element={<SavedPosts />} />
            <Route path="/likedPosts" element={<LikedPosts />} />
            <Route path="/profileVisits" element={<ProfileVisits />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/notifications" element={< NotificationsPage />} />
            <Route path="/messages" element={< Messages />} />
            <Route path="/connections" element={< Connections />} />
            <Route path="/jobsControl" element={< JobControl />} />
            <Route path="/jobApplications" element={< JobApplications />} />


          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            pauseOnHover={false} 
            draggable
            theme="light"
            transition={Bounce}
            toastClassName="custom-toast"
            bodyClassName="custom-toast-body"
            progressClassName="custom-progress"
          />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
