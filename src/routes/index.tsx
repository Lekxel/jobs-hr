import useGetUser from "hooks/useGetUser";

import {
  Navigate,
  Route,
  Routes as ReactRoutes,
  useLocation,
} from "react-router-dom";

import routes from "routes/routes";
import Dashboard from "screens/APPLICANT/Dashboard";
import HRDashboard from "screens/HR/Dashboard";
import Login from "screens/Login";
import Register from "screens/Register";

export function RequireAuth({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const user = useGetUser();

  const location = useLocation();

  if (!user?._id) {
    return <Navigate to={routes.login} state={{ from: location }} />;
  }

  return children;
}

function Routes() {
  return (
    <ReactRoutes>
      <Route path={routes.home} element={<Login />} />
      <Route path={routes.login} element={<Login />} />
      <Route path={routes.register} element={<Register />} />
      <Route
        path={routes.dashboard}
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path={routes.hrDashboard}
        element={
          <RequireAuth>
            <HRDashboard />
          </RequireAuth>
        }
      />
    </ReactRoutes>
  );
}

export default Routes;
