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

export default function RouthPath() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/freelancerpage" element={<Freelancerpage />} />
          <Route path="/freelancerpage/Apply" element={<Apply />} />
          <Route path="/freelancerpage/Taskmanager" element={<Taskmanager />} />
          <Route path="/employerpage" element={<Employerpage />} />
          <Route
            path="/employerpage/Freelancerdetails"
            element={<Freelancerdetails />}
          />
        <Route path="/employerpage/Post" element={<Write />} />
        <Route
            path="/employerpage/Applicantsdetails"
            element={<Posthistory />}
          />
              <Route
            path="/employerpage/Applicantsdetails/more"
            element={<Applicantsdetails />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
