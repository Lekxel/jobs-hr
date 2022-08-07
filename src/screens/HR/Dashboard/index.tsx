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

const Dashboard: React.FC = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const fetchJobs = async () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/job/fetch`)
      .then(({ data }) => {
        if (data.success) {
          setJobs(data.jobs);
        }
      })
      .catch(({ response }) => {
        showDanger(response.data.message || "Something went wrong");
      });
  };

  const fetchApplications = async () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/application/fetch`)
      .then(({ data }) => {
        if (data.success) {
          setApplications(data.applications);
        }
      })
      .catch(({ response }) => {
        showDanger(response.data.message || "Something went wrong");
      });
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  return (
    <div className="md:px-10 px-5 py-5 min-h-screen w-screen bg-gray-100">
      <CreateJobModal
        fetchJobs={fetchJobs}
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
      />
      <nav className="flex justify-between items-center">
        <Logo />
        <ul className="md:flex gap-20 font-medium text-lg">
          <li>
            <button type="button" onClick={() => setIsOpen(true)}>
              Post Job
            </button>
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

      <div className="mb-10 flex flex-col md:flex-row gap-10 pt-16">
        <div className="md:w-2/3">
          <h3 className="text-xl font-medium">Applications</h3>

          <div className="flex gap-10 mt-5">
            {applications.map((application: any) => (
              <div
                key={application._id}
                className="bg-white shadow-xl drop-shadow-xl rounded-lg py-5 px-10 group hover:bg-green-50"
              >
                <div className="flex items-center">
                  <span className="fa fa-user text-white rounded-full p-3 bg-green-300 mr-3"></span>
                  <div>
                    <h4 className="font-medium">{application.name}</h4>
                    <p className="text-xs">{application.nationality}</p>
                  </div>
                </div>

                <p className="my-4">
                  Job: <b>{application.job?.title}</b>
                </p>
                <div className="border-l border-l-green-400 mt-8 px-4">
                  <div className="mb-5">
                    <p className="font-medium">{application.email}</p>
                    <p className="text-sm">E-mail address</p>
                  </div>
                  <div className="mb-5">
                    <p className="font-medium">{application.phone}</p>
                    <p className="text-sm">Phone number</p>
                  </div>
                  <div className="mb-5">
                    <p className="font-medium">{application.race}</p>
                    <p className="text-sm">Ethic/Race</p>
                  </div>
                </div>
                <div className="mb-5">
                  <p className="font-medium">Biography/Info</p>
                  <p className="text-black text-opacity-60 text-sm">
                    {application.info}
                  </p>
                </div>

                <div className="flex justify-center mt-10">
                  <Button className="bg-green-400 text-sm w-72">Contact</Button>
                </div>
              </div>
            ))}

            {applications.length === 0 && (
              <div className="text-center text-gray-500">
                <p className="text-lg">No applications submitted yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/3">
          <h3 className="text-xl font-medium">Created Jobs</h3>

          {jobs?.map((job: any) => (
            <div key={job._id} className="mt-5">
              <div className="bg-white rounded-lg py-5 px-10 group hover:bg-green-400">
                <h4 className="font-medium">{job.title}</h4>
                <p className="text-sm">{job.company}</p>

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
                    <p className="font-medium">{job.category}</p>
                    <p className="text-sm">Category</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-green-400 group-hover:bg-white group-hover:text-green-500 text-sm px-5">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="text-center text-gray-500">
              <p className="text-lg">No jobs created yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface IProps {
  isOpen: boolean;
  onRequestClose: () => void;
  fetchJobs: () => void;
}

const jobTypes = ["Full Time", "Part Time"];

const categories = ["Hardware", "Software", "Marketing"];

const CreateJobModal: React.FC<IProps> = ({
  isOpen,
  onRequestClose,
  fetchJobs,
}) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobType, setJobType] = useState(jobTypes[0]);
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = () => {
    if (
      title.length === 0 ||
      company.length === 0 ||
      description.length === 0 ||
      location.length === 0 ||
      salary.length === 0 ||
      deadline.length === 0
    ) {
      return showDanger("Please fill all the fields");
    }

    setLoading(true);

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/job/create`, {
        title,
        company,
        jobType,
        category,
        description,
        location,
        salary,
        deadline,
      })
      .then(({ data }) => {
        setLoading(false);
        if (data.success) {
          showSuccess(data.message);
          onRequestClose();
          fetchJobs();
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
          <h4 className="text-xl mb-5 font-medium">Post a New Job</h4>

          <div className="flex flex-col mt-5 gap-5">
            <div>
              <label className="text-sm font-medium">Job Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                className={inputStyle}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Company</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                type="text"
                className={inputStyle}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className={inputStyle}
              >
                {jobTypes.map((job, index) => (
                  <option key={String(index)}>{job}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Job Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputStyle}
              >
                {categories.map((category, index) => (
                  <option key={String(index)}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputStyle}
              >
                {countries.map((country, index) => (
                  <option key={index}>{country.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Basic Salary</label>
              <input
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                type="text"
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Deadline</label>
              <input
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                type="date"
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputStyle}
              />
            </div>

            <Button onClick={handleSubmit} className="mt-5">
              {loading ? <Spinner /> : "Post Job"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Dashboard;
