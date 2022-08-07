import { useNavigate } from "react-router-dom";
import routes from "routes/routes";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <h1 onClick={() => navigate(routes.home)} className="font-bold">
      <i className="fa-solid fa-magnifying-glass-plus text-3xl md:text-5xl text-green-500 mr-2"></i>
      <span className="md:text-4xl text-2xl">Jobs</span>
      <span className="text-green-500 md:text-xl">HR</span>
    </h1>
  );
};

export default Logo;
