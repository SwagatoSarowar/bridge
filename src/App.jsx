import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import OtherUsers from "./pages/OtherUsers";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/registration",
      element: <Registration />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/forgotpassword",
      element: <ForgotPassword />,
    },
    {
      path: "/:id",
      element: <Profile />,
    },
    {
      path: "/users",
      element: <OtherUsers />,
    },
    {
      path: "/error-page",
      element: <ErrorPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
