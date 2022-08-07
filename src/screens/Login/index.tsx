import axios from "axios";
import AuthContainer from "components/layout/AuthContainer";
import Button from "components/ui/Button";
import Spinner from "components/ui/Spinner";
import {
  HR_CREDENTIALS,
  showDanger,
  showSuccess,
  validateEmail,
  validatePassword,
} from "helpers";
import { setCurrentUser, setCurrentUserAuthToken } from "helpers/storage";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import routes from "routes/routes";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!validateEmail(email)) return showDanger("Email is invalid");
    if (!validatePassword(password))
      return showDanger("Password should be at least 6 chars");
    setLoading(true);

    if (
      email === HR_CREDENTIALS.email &&
      password === HR_CREDENTIALS.password
    ) {
      setCurrentUser({
        email: HR_CREDENTIALS.email,
        name: "HR",
        isHR: true,
        _id: "HR",
      });
      setCurrentUserAuthToken("someRandomToken");
      showSuccess("You are logged in as HR");
      return navigate(routes.hrDashboard);
    }

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
        email,
        password,
      })
      .then(({ data }) => {
        setLoading(false);
        if (data.user) {
          setCurrentUserAuthToken(data.accessToken);
          setCurrentUser(data.user);
          showSuccess(data.message);
          navigate(routes.dashboard);
        }
      })
      .catch(({ response }) => {
        setLoading(false);
        showDanger(response.data.message);
      });
  };
  return (
    <AuthContainer>
      <div className="mt-10">
        <h3 className="font-medium text-xl">Welcome back,</h3>
        <p className="text-black text-opacity-60">
          Sign into your account to apply for more jobs
        </p>

        <div className="mt-5">
          <p>
            HR login: email: <b>{HR_CREDENTIALS.email}</b> / password:&nbsp;
            <b>{HR_CREDENTIALS.password}</b>
          </p>
        </div>

        <div id="form" className="mt-10">
          <div className="flex flex-col mb-5">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg mt-1 py-2 max-w-sm px-3"
              type="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex flex-col mb-3">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg mt-1 py-2 max-w-sm px-3"
              type="password"
              id="password"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex flex-col justify-center">
            <label className="flex items-center" htmlFor="rememberMe">
              <input
                className="border border-gray-300 mr-3"
                type="checkbox"
                id="rememberMe"
              />
              <span className="text-sm">Remember me</span>
            </label>
          </div>

          <div className="mt-10">
            <Button
              onClick={handleSubmit}
              className="rounded-lg w-full max-w-sm py-3 drop-shadow-xl shadow-xl"
            >
              {loading ? <Spinner /> : "Sign In"}
            </Button>
          </div>

          <div className="mt-5">
            <p className="text-black text-opacity-60">
              Don't have an account?{" "}
              <Link className="text-green-500" to={routes.register}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthContainer>
  );
};

export default Login;
