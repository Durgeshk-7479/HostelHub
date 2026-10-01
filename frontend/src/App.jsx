import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";

function App() {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const path = window.location.pathname;

    // Register page
    // Only accessible when user is NOT logged in
    if (path === "/register" && !token) {
        return <Register />;
    }

    // Not logged in
    if (!token) {
        return <Login />;
    }

    // Admin
    if (role === "Admin") {
        return <AdminDashboard />;
    }

    // Student
    if (role === "Student") {
        return <Dashboard />;
    }

    // Invalid role
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    return <Login />;
}

export default App;