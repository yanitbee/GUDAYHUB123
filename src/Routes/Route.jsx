import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Layout from "../Layouts/Layout";
import Freelancerpage from "../Pages/FreelancerPage";
import Apply from "../Pages/Applay";
import Taskmanager from "../Pages/Taskmanager";
import Employerpage from "../Pages/EmployerPage";
import Freelancerdetails from "../components/employer/Freelancerdetails";
import Write from "../Pages/postjob";
import Posthistory from "../Pages/posthistory";
import Applicantsdetails from "../Pages/Applicantsdetails";
import Hire from "../Pages/Hire";
import PrivateRoute from "./PrivateRoute";
import Messenger from "../Pages/messenger/Messenger"

export default function RouthPath() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/freelancerpage"
            element={<PrivateRoute element={<Freelancerpage />} />}
          />
          <Route
            path="/employerpage"
            element={<PrivateRoute element={<Employerpage />} />}
          />
          <Route
            path="/freelancerpage/Apply"
            element={<PrivateRoute element={<Apply />} />}
          />
          <Route
            path="/freelancerpage/Taskmanager"
            element={<PrivateRoute element={<Taskmanager />} />}
          />
           <Route
            path="/freelancerpage/Messenger"
            element={<PrivateRoute element={<Messenger />} />}
          />
          <Route
            path="/employerpage/Freelancerdetails"
            element={<PrivateRoute element={<Freelancerdetails />} />}
          />
          <Route
            path="/employerpage/Post"
            element={<PrivateRoute element={<Write />} />}
          />
          <Route
            path="/employerpage/Applicantsdetails"
            element={<PrivateRoute element={<Posthistory />} />}
          />
          <Route
            path="/employerpage/Applicantsdetails/more"
            element={<PrivateRoute element={<Applicantsdetails />} />}
          />
             <Route
            path="/employerpage/Applicantsdetails/more/Hire"
            element={<PrivateRoute element={<Hire />} />}
          />
             <Route
            path="/employerpage/Applicantsdetails/postdetails"
            element={<PrivateRoute element={<Postdetails />} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

