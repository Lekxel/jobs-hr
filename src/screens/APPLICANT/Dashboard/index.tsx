import axios from "axios";
import Button from "components/ui/Button";
import Logo from "components/ui/Logo";
import Spinner from "components/ui/Spinner";
import countries from "data/countries.json";
import { showDanger, showSuccess } from "helpers";
import { logout } from "helpers/storage";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { inputStyle } from "./classUtils";

const jobTypes = ["Full Time", "Part Time"];

const categories = ["Hardware", "Software", "Marketing"];

const Dashboard: React.FC = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");

  const fetchJobs = async () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/job/fetch?search=${search}&sortBy=${sortBy}&location=${location}&jobType=${jobType}&category=${category}`
      )
      .then(({ data }) => {
        if (data.success) {
          setJobs(data.jobs);
        }
      })
      .catch(({ response }) => {
        showDanger(response.data.message || "Something went wrong");
      });
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, jobType, category, sortBy, search]);

  const apply = async (job: any) => {
    setSelectedJob(job);
    setIsOpen(true);
  };

  return (
    <div className="md:px-10 px-5 py-5 min-h-screen w-screen bg-gray-100">
      <nav className="flex justify-between items-center">
        <Logo />
        <ul className="md:flex gap-20 font-medium text-lg hidden">
          <li>
            <a href="/">Dashboard</a>
          </li>
          <li>
            <a href="/">Inbox</a>
          </li>
        </ul>
        <div>
          <button
            onClick={logout}
            className="bg-green-400 md:px-14 px-5 text-white py-2"
          >
            Logout
          </button>
        </div>
      </nav>

      <Apply
        job={selectedJob}
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
      />

      <div className="md:mt-14 mt-10 mb-10 md:px-10">
        <p className="font-medium">Filter:</p>
        <div className="flex flex-wrap gap-5 text-sm bg-white drop-shadow-lg mt-2 py-3 items-end justify-evenly">
          <div className="flex w-1/3 py-1 flex-col cursor-pointer">
            <p className="mr-3 font-medium">Location</p>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputStyle}
            >
              <option value="">All</option>
              {countries.map((country, index) => (
                <option key={index}>{country.name}</option>
              ))}
            </select>
          </div>
          <div className="flex w-1/3 py-1 flex-col cursor-pointer">
            <p className="mr-3 font-medium">Job Type</p>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className={inputStyle}
            >
              <option value="">All</option>
              {jobTypes.map((job, index) => (
                <option key={String(index)}>{job}</option>
              ))}
            </select>
          </div>
          <div className="flex w-1/3 py-1 flex-col cursor-pointer">
            <p className="mr-3 font-medium">Category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputStyle}
            >
              <option value="">All</option>
              {categories.map((category, index) => (
                <option key={String(index)}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex w-1/3 py-1 flex-col cursor-pointer">
            <p className="mr-3 font-medium">Sort By</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={inputStyle}
            >
              <option value={-1}>Newest</option>
              <option value={1}>Oldest</option>
            </select>
          </div>

          <div className="flex py-1 relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="bg-gray-200 py-2 mr-2 rounded w-full px-4"
            />
            <span className="bg-green-400 rounded-full w-8 h-8 absolute flex items-center justify-center right-3 top-0 bottom-0 md:mt-0.5 mt-1.5">
              <i className="fa fa-search text-white"></i>
            </span>
          </div>
        </div>

        <h3 className="mt-14 text-xl font-medium">
          {jobs.length} Job Positions
        </h3>

        <div className="flex flex-wrap gap-10 mt-5">
          {jobs.map((job: any) => (
            <div
              key={job._id}
              className="bg-white shadow-xl drop-shadow-xl rounded-lg py-5 px-10 w-full md:w-1/3 group hover:bg-green-400"
            >
              <h4 className="font-medium">{job.title}</h4>
              <p className="text-sm">{job.company}.</p>

              <div className="border-l border-l-green-400 mt-5 px-4">
                <div className="mb-5">
                  <p className="font-medium">{job.location}</p>
                  <p className="text-sm">Location</p>
                </div>
                <div className="mb-5">
                  <p className="font-medium">{job.salary} USD</p>
                  <p className="text-sm">Basic Salary</p>
                </div>
                <div className="mb-5">
                  <p className="font-medium">{job.jobType}</p>
                  <p className="text-sm">Job Type</p>
                </div>
                <div className="mb-5">
                  <p className="font-medium">{job.category}</p>
                  <p className="text-sm">Category</p>
                </div>
              </div>

              <div className="hidden group-hover:block">
                <div className="mt-10">
                  <h5 className="font-medium mb-3">Description</h5>
                  <p className="text-sm">{job.description}</p>
                </div>
              </div>

              <div className="flex mt-10 justify-end">
                <Button
                  onClick={() => apply(job)}
                  className="bg-green-400 group-hover:bg-white group-hover:text-green-500 text-sm px-5"
                >
                  Apply Now
                  <i className="fa fa-arrow-right ml-5"></i>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface IProps {
  isOpen: boolean;
  onRequestClose: () => void;
  job: any;
}

const Apply: React.FC<IProps> = ({ isOpen, onRequestClose, job }) => {
  const [loading, setLoading] = useState(false);
  const [race, setRace] = useState("White");
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState(countries[0].name);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = () => {
    if (!race || !name || !nationality || !email || !info) {
      return showDanger("Please fill all the fields");
    }

    setLoading(true);

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/application/create`, {
        job: job._id,
        name,
        nationality,
        email,
        phone,
        info,
        race,
      })
      .then(({ data }) => {
        setLoading(false);
        if (data.success) {
          showSuccess(data.message);
          onRequestClose();
        }
      })
      .catch(({ response }) => {
        setLoading(false);
        showDanger(response.data.message || "Something went wrong");
      });
  };

  return (
    <Modal
      shouldCloseOnOverlayClick={true}
      onRequestClose={onRequestClose}
      isOpen={isOpen}
      className="h-screen w-screen"
    >
      <div
        onClick={onRequestClose}
        className="h-full w-full bg-gray-500 bg-opacity-50 relative"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="h-[95%] absolute bottom-0 py-8 max-w-2xl bg-white px-5 flex flex-col items-center rounded-t-lg overflow-auto left-0 right-0 mx-auto"
        >
          <div className="rounded-lg w-20 h-1 bg-white absolute -top-5"></div>
          <h4 className="text-xl mb-5 font-medium">
            <span className="text-black text-opacity-50"> Apply for </span>"
            {job?.title}"
          </h4>

          <div className="flex flex-col mt-5 gap-5">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className={inputStyle}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className={inputStyle}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Mobile No. (optional)
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                className={inputStyle}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Race</label>
              <select
                value={race}
                onChange={(e) => setRace(e.target.value)}
                className={inputStyle}
              >
                <option>White</option>
                <option>Black or African American</option>
                <option>American Indian or Alaska Native</option>
                <option>Asian</option>
                <option>Native Hawaiian or Other Pacific Islander</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Nationality</label>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className={inputStyle}
              >
                {countries.map((country, index) => (
                  <option key={index}>{country.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">
                Say something about you
              </label>
              <textarea
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                className={inputStyle}
              />
            </div>

            <Button onClick={handleSubmit} className="mt-5">
              {loading ? <Spinner /> : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Dashboard;
