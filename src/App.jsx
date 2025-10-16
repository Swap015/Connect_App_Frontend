import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
import Jobs from "./pages/dynamic-pages/Jobs.jsx";
import Profile from "./pages/dynamic-pages/Profile.jsx";
import MyPosts from "./components/posts/MyPosts.jsx";
import AdminDashboard from "./pages/dynamic-pages/admin/AdminDashboard.jsx";
import NotFound from "./components/NotFound.jsx";
import { UserProvider } from "./components/Context/UserContext.jsx";
import AdminJobs from "./pages/dynamic-pages/admin/AdminJobs.jsx";
import AdminUsersPosts from "./pages/dynamic-pages/admin/AdminUsersPosts.jsx";
import AdminRoutes from "./components/RouteProtector/AdminRoutes.jsx";
import RecruiterDashboard from "./pages/dynamic-pages/Recruiter/RecruiterDashboard.jsx";
import SinglePost from "./components/posts/SinglePost.jsx";
import RecruiterRoutes from "./components/RouteProtector/RecruiterRoutes.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";



function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <Header />

          {/* Pages  */}
          <main className="flex-grow bg-gray-50">
            <Routes>

              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/savedPosts" element={<SavedPosts />} />
              <Route path="/likedPosts" element={<LikedPosts />} />
              <Route path="/profileVisits" element={<ProfileVisits />} />
              <Route path="/editProfile" element={<EditProfile />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/myPosts" element={<MyPosts />} />
              <Route path="/Singlepost/:postId" element={<SinglePost />} />


              {/*-----------------ADMIN ROUTES------------------- */}

              <Route path="/admin-dashboard" element={<AdminRoutes>  <AdminDashboard /> </AdminRoutes>} />
              <Route path="/admin-jobs" element={<AdminRoutes>  <AdminJobs /> </AdminRoutes>} />
              <Route path="/admin-users" element={<AdminRoutes>  <AdminUsersPosts />  </AdminRoutes>} />

              {/*---------------RECRUITER ROUTES---------------- */}
              <Route path="/recruiter-dashboard"
                element={<RecruiterRoutes>
                  <RecruiterDashboard />
                </RecruiterRoutes>} />

              <Route path="/jobsControl"
                element={
                  <RecruiterRoutes>
                    <JobControl />
                  </RecruiterRoutes>
                } />

              {/*---------------NOT FOUND ROUTES---------------- */}

              <Route path="*" element={<NotFound />} />
              <Route path="/404" element={<NotFound />} />

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
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
