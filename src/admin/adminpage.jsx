import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminpage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBriefcase,faEllipsisH ,faEye,faEdit,faPen,faComment } from "@fortawesome/free-solid-svg-icons";
import PieChart from "./assets/pieChart";
import useAuth from "../Hooks/UseAuth";
import LineGraph from "./assets/lineGraph";
import { use } from "i18next";
import View from "./component/view";
import Add from "./component/add";

export default function AdminPage() {
  const { getUserData, getUserToken } = useAuth();
  const userData = getUserData();
  const token = getUserToken();

  const [users, setUsers] = useState([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [latestUsers, setLatestUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [poatloading, setPostLoading] = useState(true);
  const [posterror, setPostError] = useState("");
  const [showMain, setShowMain] = useState("analytic");

  const showView = () =>{
	setShowMain("view")
  }
  const showAnalytic = () =>{
	setShowMain("analytic")
  }
  const showAdd = () =>{
	setShowMain("Add")
  }


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/admin/allUser",
          {
            params: {
              type,
            },
          }
        );

        const sortedUsers = response.data.sort(
          (a, b) => new Date(a.CreatedDate) - new Date(b.CreatedDate)
        );
        setUsers(sortedUsers);
        setLoading(false);

        const latest = sortedUsers.slice(-3).reverse();
        setLatestUsers(latest);
      } catch (err) {
        setError("Error fetching users");
        setLoading(false);
      }
    };

    const fetchPost = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/admin/readpost",
          {
            params: {
              type,
            },
          }
        );

        const sortedPost = response.data.sort(
          (a, b) => new Date(a.CreatedDate) - new Date(b.CreatedDate)
        );
        setPosts(sortedPost);
        setPostLoading(false);
      } catch (err) {
        setPostError("Error fetching users");
        setPostLoading(false);
      }
    };

    fetchUsers();
    fetchPost();
  }, [type]);
  const Activeusers = users.filter((user) => user.status !== "deleted").length;

  const freelancerCount = users.filter(
    (user) => user.status !== "deleted" && user.Usertype === "freelancer"
  ).length;
  const employerCount = users.filter(
    (user) => user.status !== "deleted" && user.Usertype === "employer"
  ).length;

  const data = [
    { label: "Freelancers", value: freelancerCount },
    { label: "Employers", value: employerCount },
  ];

  const jobCount = posts.filter(
    (post) =>  post.JobTask === "Job"
  ).length;
  const taskCount = posts.filter(
    (post) =>  post.JobTask === "Task"
  ).length;

  const postData = [
    { label: "Jobs", value: jobCount },
    { label: "Tasks", value: taskCount },
  ];

  const onsiteCount = posts.filter(
    (post) =>  post.Jobtype === "onsite"
  ).length;
  const remontCount = posts.filter(
    (post) =>  post.Jobtype === "remote"
  ).length;
  const hybridCount = posts.filter(
    (post) =>  post.Jobtype === "hybrid"
  ).length;

  const typedata = [
    { label: "Onsite", value: onsiteCount },
    { label: "remote", value: remontCount },
	{ label: "hybrid", value: hybridCount },
  ];

 

 


  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };

  return (
    <>
      <div className="dashboard">
        <aside className="search-wrap">
          <div className="admsearch">
            <label for="search">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" />
              </svg>
              <input type="text" id="search" />
            </label>
          </div>

    
        </aside>

        <header className="menu-wrap">
          <figure className="user">
            <div className="user-avatar">
              <img
                src="https://images.unsplash.com/photo-1440589473619-3cde28941638?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=42ebdb92a644e864e032a2ebccaa25b6&auto=format&fit=crop&w=100&q=80"
                alt="Amanda King"
              />
            </div>
            <figcaption>{userData.UserName}</figcaption>
          </figure>

          <div className="adminNav">
            <section className="dicover">
              <h3>Dashboard</h3>

              <ul className="adminui" onClick={showAnalytic}>
                <li className="adminsidelist">
                  <a href="#userAnalytic">
                    <FontAwesomeIcon
                      icon={faUser}
                      size="1x"
                      color="rgba(0, 0, 0, 0.701)"
                    />
                    User Analytics
                  </a>
                </li>

                <li className="adminsidelist">
                  <a href="#postAnalytic">
                    <FontAwesomeIcon
                      icon={faBriefcase}
                      size="1x"
                      color="rgba(0, 0, 0, 0.701)"
                    />
                    Post Analytics
                  </a>
                </li>

                <li className="adminsidelist">
                  <a href="#OtherAnaltics">
				  <FontAwesomeIcon
                      icon={faEllipsisH }
                      size="1x"
                      color="rgba(0, 0, 0, 0.701)"
                    />
                    Other Analtics
                  </a>
                </li>

                <li className="adminsidelist">
                  <a href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5.707 19.707L12 13.414l4.461 4.461L14.337 20H20v-5.663l-2.125 2.124L13.414 12l4.461-4.461L20 9.663V4h-5.663l2.124 2.125L12 10.586 5.707 4.293 4.293 5.707 10.586 12l-6.293 6.293z" />
                    </svg>
                    Shuffle
                  </a>
                </li>
              </ul>
            </section>

            <section className="tools">
              <h3>Acount Manage</h3>

              <ul className="adminui">
                <li className="adminsidelist" onClick={showView}>
                  <a href="#" className="activea"
				  >
                    <FontAwesomeIcon
                      icon={faEye }
                      size="1x"
                      color="rgba(0, 0, 0, 0.701)"
                    />
                    View
                  </a>
                </li>

                <li className="adminsidelist" onClick={showAdd}>
                  <a href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13 7L11 7 11 11 7 11 7 13 11 13 11 17 13 17 13 13 17 13 17 11 13 11z" />
                      <path d="M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10c5.514,0,10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8 s3.589-8,8-8s8,3.589,8,8S16.411,20,12,20z" />
                    </svg>
                   Add
                  </a>
                </li>

                <li className="adminsidelist">
                  <a href="#">
                  <FontAwesomeIcon
                      icon={faEdit }
                      size="1x"
                      color="rgba(0, 0, 0, 0.701)"
                    />
                    Update
                  </a>
                </li>
              </ul>
            </section>


            <section className="dicover">
              <h3>Post Analtics</h3>

              <ul className="adminui">
                <li className="adminsidelist">
				<a href="#" className="activea"
				  >
                    <FontAwesomeIcon
                      icon={faEye }
                      size="1x"
                      color="rgba(0, 0, 0, 0.701)"
                    />
                    View
                  </a>
                </li>

                <li className="adminsidelist">
				<a href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13 7L11 7 11 11 7 11 7 13 11 13 11 17 13 17 13 13 17 13 17 11 13 11z" />
                      <path d="M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10c5.514,0,10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8 s3.589-8,8-8s8,3.589,8,8S16.411,20,12,20z" />
                    </svg>
                   Add
                  </a>
                </li>

                <li className="adminsidelist">
                  <a href="#">
				  <FontAwesomeIcon
                      icon={faEdit }
                      size="1x"
                      color="rgba(0, 0, 0, 0.701)"
                    />
                    Update
                  </a>
                </li>

              </ul>
            </section>
			<section className="dicover">
			<h3>Other</h3>

<ul className="adminui">
  <li className="adminsidelist">
  <a href="#" className="activea"
	>
	  <FontAwesomeIcon
		icon={faPen }
		size="1x"
		color="rgba(0, 0, 0, 0.701)"
	  />
	  Compliant
	</a>
  </li>

  <li className="adminsidelist">
  <a href="#">
  <FontAwesomeIcon
		icon={faComment }
		size="1x"
		color="rgba(0, 0, 0, 0.701)"
	  />
	  Testimony
	</a>
  </li>

  <li className="adminsidelist">
	<a href="#">
	<FontAwesomeIcon
		icon={faEdit }
		size="1x"
		color="rgba(0, 0, 0, 0.701)"
	  />
	  Update
	</a>
  </li>

</ul>
</section>
          </div>
        </header>
		{showMain === "view" && (
		<main className="content-wrap">
<View data={users} />
			</main>
			)}

{showMain === "Add" && (
		<main className="content-wrap">
<Add />
			</main>
			)}


{showMain === "analytic" && (
        <main className="content-wrap">
          <header className="content-head">
            <h1>Registration Analytics</h1>

            <div className="action">
              <button>Save search</button>
            </div>
          </header>

          <div className="content">
            <div className="lineGraph">
              <LineGraph data={users}  dateField="CreatedDate" />
            </div>

            <section id="userAnalytic" className="info-boxes">
              <br />
              <h3> User Analytics</h3>
              <br />
              <div className="info-row">
                <div className="">
                  <div className="pie-chat">
                    <PieChart data={data} />
                  </div>
                </div>
                <div className="info-box">
                  <div className="box-icon">
                    <FontAwesomeIcon
                      icon={faUser}
                      size="2x"
                      color="rgba(107, 233, 126, 0.701)"
                    />
                  </div>

                  <div className="box-content">
                    <span className="big">{Activeusers}</span>
                    Users
                  </div>
                </div>

                <div className="info-box">
                  <div className="box-icon">
                    <FontAwesomeIcon icon={faUser} size="2x" color="#03a1a4" />
                  </div>

                  <div className="box-content">
                    <span className="big">{freelancerCount}</span>
                    Freelancers
                  </div>
                </div>

                <div className="info-box activea">
                  <div className="box-icon">
                    <FontAwesomeIcon icon={faUser} size="2x" color="#FCB03C" />
                  </div>

                  <div className="box-content">
                    <span className="big">{employerCount}</span>
                    Employers
                  </div>
                </div>
              </div>
            </section>

            <section className="person-boxes">
              {latestUsers.map((user) => (
                <div className="person-box">
                  <div className="box-avatar">
                    <img
                      src={
                        user.freelancerprofile.profilepic === "" ||
                        user.freelancerprofile.profilepic === null
                          ? `/image/profile.jpg`
                          : getProfilePicUrl(user.freelancerprofile.profilepic)
                      }
                      alt="Profile"
                    />
                  </div>

                  <div className="box-bio">
                    <h2 className="bio-name">{user.Fullname}</h2>
                    <p className=" titles">{user.freelancerprofile.title}</p>
                  </div>
                  <div className="box-actions">
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6.855 14.365l-1.817 6.36a1.001 1.001 0 0 0 1.517 1.106L12 18.202l5.445 3.63a1 1 0 0 0 1.517-1.106l-1.817-6.36 4.48-3.584a1.001 1.001 0 0 0-.461-1.767l-5.497-.916-2.772-5.545c-.34-.678-1.449-.678-1.789 0L8.333 8.098l-5.497.916a1 1 0 0 0-.461 1.767l4.48 3.584zm2.309-4.379c.315-.053.587-.253.73-.539L12 5.236l2.105 4.211c.144.286.415.486.73.539l3.79.632-3.251 2.601a1.003 1.003 0 0 0-.337 1.056l1.253 4.385-3.736-2.491a1 1 0 0 0-1.109-.001l-3.736 2.491 1.253-4.385a1.002 1.002 0 0 0-.337-1.056l-3.251-2.601 3.79-.631z" />
                      </svg>
                    </button>

                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 18H6V6h7V4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8h-2v7z" />
                        <path d="M17.465 5.121l-6.172 6.172 1.414 1.414 6.172-6.172 2.12 2.121L21 3h-5.657z" />
                      </svg>
                    </button>

                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 3C6.486 3 2 6.364 2 10.5c0 2.742 1.982 5.354 5 6.678V21a.999.999 0 0 0 1.707.707l3.714-3.714C17.74 17.827 22 14.529 22 10.5 22 6.364 17.514 3 12 3zm0 13a.996.996 0 0 0-.707.293L9 18.586V16.5a1 1 0 0 0-.663-.941C5.743 14.629 4 12.596 4 10.5 4 7.468 7.589 5 12 5s8 2.468 8 5.5-3.589 5.5-8 5.5z" />
                      </svg>
                    </button>

                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 8L17 8 17 11 14 11 14 13 17 13 17 16 19 16 19 13 22 13 22 11 19 11zM3 20h10c.553 0 1-.447 1-1v-.5c0-2.54-1.212-4.651-3.077-5.729C11.593 12.063 12 11.1 12 10c0-2.28-1.72-4-4-4s-4 1.72-4 4c0 1.1.407 2.063 1.077 2.771C3.212 13.849 2 15.96 2 18.5V19C2 19.553 2.448 20 3 20zM6 10c0-1.178.822-2 2-2s2 .822 2 2-.822 2-2 2S6 11.178 6 10zM8 14c2.43 0 3.788 1.938 3.977 4H4.023C4.212 15.938 5.57 14 8 14z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </section>

			<br/><br/><br/><br/>
			  <div className="lineGraph">
<h4>Content Analytics</h4>
              <LineGraph data={posts}  dateField="PostedDate"  />
            </div><br/><br/><br/>
			<section id="postAnalytic" className="info-boxes">
            <br />
              <h3> Post Analytics</h3>
              <br />
              <div className="info-row">
                <div className="">
                  <div className="pie-chat">
                    <PieChart data={postData} />
                  </div>
                </div>
                <div className="info-box">
                  <div className="box-icon">
                    <FontAwesomeIcon
                      icon={faBriefcase}
                      size="2x"
                      color="rgba(107, 233, 126, 0.701)"
                    />
                  </div>

                  <div className="box-content">
                    <span className="big">{posts.length}</span>
                    Post
                  </div>
                </div>

                <div className="info-box">
                  <div className="box-icon">
                    <FontAwesomeIcon icon={faBriefcase} size="2x" color="#03a1a4" />
                  </div>

                  <div className="box-content">
                    <span className="big">{jobCount}</span>
                    Jobs
                  </div>
                </div>

                <div className="info-box activea">
                  <div className="box-icon">
                    <FontAwesomeIcon icon={faBriefcase} size="2x" color="#FCB03C" />
                  </div>

                  <div className="box-content">
                    <span className="big">{taskCount}</span>
                    Tasks
                  </div>
                </div>
				
              </div>
			
            </section>

			
            <section className="person-boxes">
              {latestUsers.map((user) => (
                <div className="person-box">
                  <div className="box-avatar">
                    <img
                      src={
                        user.freelancerprofile.profilepic === "" ||
                        user.freelancerprofile.profilepic === null
                          ? `/image/profile.jpg`
                          : getProfilePicUrl(user.freelancerprofile.profilepic)
                      }
                      alt="Profile"
                    />
                  </div>

                  <div className="box-bio">
                    <h2 className="bio-name">{user.Fullname}</h2>
                    <p className=" titles">{user.freelancerprofile.title}</p>
                  </div>
                  <div className="box-actions">
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6.855 14.365l-1.817 6.36a1.001 1.001 0 0 0 1.517 1.106L12 18.202l5.445 3.63a1 1 0 0 0 1.517-1.106l-1.817-6.36 4.48-3.584a1.001 1.001 0 0 0-.461-1.767l-5.497-.916-2.772-5.545c-.34-.678-1.449-.678-1.789 0L8.333 8.098l-5.497.916a1 1 0 0 0-.461 1.767l4.48 3.584zm2.309-4.379c.315-.053.587-.253.73-.539L12 5.236l2.105 4.211c.144.286.415.486.73.539l3.79.632-3.251 2.601a1.003 1.003 0 0 0-.337 1.056l1.253 4.385-3.736-2.491a1 1 0 0 0-1.109-.001l-3.736 2.491 1.253-4.385a1.002 1.002 0 0 0-.337-1.056l-3.251-2.601 3.79-.631z" />
                      </svg>
                    </button>

                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 18H6V6h7V4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8h-2v7z" />
                        <path d="M17.465 5.121l-6.172 6.172 1.414 1.414 6.172-6.172 2.12 2.121L21 3h-5.657z" />
                      </svg>
                    </button>

                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 3C6.486 3 2 6.364 2 10.5c0 2.742 1.982 5.354 5 6.678V21a.999.999 0 0 0 1.707.707l3.714-3.714C17.74 17.827 22 14.529 22 10.5 22 6.364 17.514 3 12 3zm0 13a.996.996 0 0 0-.707.293L9 18.586V16.5a1 1 0 0 0-.663-.941C5.743 14.629 4 12.596 4 10.5 4 7.468 7.589 5 12 5s8 2.468 8 5.5-3.589 5.5-8 5.5z" />
                      </svg>
                    </button>

                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 8L17 8 17 11 14 11 14 13 17 13 17 16 19 16 19 13 22 13 22 11 19 11zM3 20h10c.553 0 1-.447 1-1v-.5c0-2.54-1.212-4.651-3.077-5.729C11.593 12.063 12 11.1 12 10c0-2.28-1.72-4-4-4s-4 1.72-4 4c0 1.1.407 2.063 1.077 2.771C3.212 13.849 2 15.96 2 18.5V19C2 19.553 2.448 20 3 20zM6 10c0-1.178.822-2 2-2s2 .822 2 2-.822 2-2 2S6 11.178 6 10zM8 14c2.43 0 3.788 1.938 3.977 4H4.023C4.212 15.938 5.57 14 8 14z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </section>
			<br/><br/>
			<section id="OtherAnaltics"  className="info-boxes">
			<br/>
			<h3>Other Analytics</h3><br/>
                  <div className="pie-chat">
					<h4>Post Type</h4>
                    <PieChart data={typedata} />
                  </div>
				 
            </section>
          </div>
        </main>
		)}
      </div>
    </>
  );
}
