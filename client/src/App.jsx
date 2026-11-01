import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import {Routes,Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Questions from "./pages/Questions";
import GuestRoute from "./components/GuestRoute";
import QuestionDetails from "./pages/QuestionDetails";
import Bookmarks from "./pages/Bookmarks";
import QuestionForm from "./components/QuestionForm";
import AdminDashboard from "./pages/AdminDashboard";
function App() {
  console.log("hi");
  return (
    <>
      <Navbar /> 
        
      <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedRoute disallowAdmin={true} />}>
                <Route path="/bookmarks" element={<Bookmarks />} />
              </Route>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/questions/new" element={<QuestionForm />} />
              <Route path="/questions" element={<Questions />} />
              <Route path="/questions/:id" element={<QuestionDetails />} />
          </Route>
      </Routes>

      <Footer />
    </>
  )
}

export default App
