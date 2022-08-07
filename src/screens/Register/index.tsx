import axios from "axios";
import AuthContainer from "components/layout/AuthContainer";
import Button from "components/ui/Button";
import Spinner from "components/ui/Spinner";
import {
  showDanger,
  showSuccess,
  validateEmail,
  validatePassword,
} from "helpers";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import routes from "routes/routes";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!validateEmail(email)) return showDanger("Email is invalid");
    if (!validatePassword(password))
      return showDanger("Password should be at least 6 chars");
    if (!name) return showDanger("Name is invalid");
    setLoading(true);

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/register`, {
        email,
        password,
      })
      .then(({ data }) => {
        setLoading(false);
        if (data.success) {
          showSuccess(data.message);
          navigate(routes.login);
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
        <h3 className="font-medium text-xl">Create an account,</h3>
        <p className="text-black text-opacity-60">
          Join 56,000+ employers and get your resume in the first place.
        </p>

        <div id="form" className="mt-10">
          <div className="flex flex-col mb-5">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg mt-1 py-2 max-w-sm px-3"
              type="text"
              id="name"
              placeholder="Enter your full name"
            />
          </div>

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
              <span className="text-sm">I agree with your </span>&nbsp;
              <span className="text-green-500">Terms</span>&nbsp;&&nbsp;
              <span className="text-green-500">Policy</span>
            </label>
          </div>

          <div className="mt-10">
            <Button
              onClick={handleSubmit}
              className="rounded-lg w-full max-w-sm py-3 drop-shadow-xl shadow-xl"
            >
              {loading ? <Spinner /> : "Create an account"}
            </Button>
          </div>

          <div className="mt-5">
            <p className="text-black text-opacity-60">
              Already have an account?{" "}
              <Link className="text-green-500" to={routes.login}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthContainer>
  );
};

export default Register;
