import axios from "axios";
import "./view.css"
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Verify ({data}){


  const [schduledUsers, setschduledUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/admin/Allschedules");
        setschduledUsers(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);


const filteredUsers = data
.map(user => {
  const matchedSchedule = schduledUsers.find(schedule => schedule.freelancerId === user._id);
  
  if (matchedSchedule) {
    return {
      ...user,
      verificationDate: matchedSchedule.verificationDate,
      verificationTime: matchedSchedule.verificationTime,
      notes: matchedSchedule.notes
    };
  }

  return null;
})
.filter(user => user !== null);



    const getProfilePicUrl = (fileName) => {
        return `http://localhost:4000/${fileName}`;
      };

 
      const convertDate = (data) => {
        const date = new Date(data);
        return date.toISOString().split("T")[0];
      };   
      
      const handleNavigation = (user) => {
      
        navigate("/admin/VerifyUser", { state: user });
      };

    return(
        <>
        <div className="specific-page">
       <div class="app-container">

  <div class="app-content">
    <div class="app-content-header">
      <h1 class="app-content-headerText">Users</h1>

    </div>
    <div class="app-content-actions">
      <input class="search-bar" placeholder="Search..." type="text"/>
      <div class="app-content-actions-wrapper">
        <div class="filter-button-wrapper">
          <button class="action-button filter jsFilter"><span>Filter</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg></button>
          <div class="filter-menu">
     
            <div class="filter-menu-buttons">
              <button class="filter-button reset">
                Reset
              </button>
              <button class="filter-button apply">
                Apply
              </button>
            </div>
          </div>
        </div>
        
       
      </div>
    </div>
    <div class="products-area-wrapper tableView">
      <div class="products-header">
        <div class="product-cell image">
          Full name
          
        </div>
        <div class="product-cell category">schedule Date</div>
        <div class="product-cell status-cell">schedules Time</div>
        <div class="product-cell sales">Phone Number</div>
        <div class="product-cell stock">Email</div>
        <div class="product-cell price">Type</div>
      </div>
      {filteredUsers.map((user) => (  
      <div class="products-row" onClick={() => handleNavigation(user)}>
        <button class="cell-more-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
          <div class="product-cell image">
          <img
                      src={
                        user.freelancerprofile.profilepic === "" ||
                        user.freelancerprofile.profilepic === null
                          ? `/image/profile.jpg`
                          : getProfilePicUrl(user.freelancerprofile.profilepic)
                      }
                      alt="Profile"
                    />
            <span>{user.Fullname}</span>
          </div>
        <div class="product-cell category"><span class="cell-label"></span>{convertDate(user.verificationDate)}</div>
        <div class="product-cell status-cell">
          {user.verificationTime}
        </div>
        <div class="product-cell sales"><span class="cell-label"></span>{user.Phonenumber}</div>
        <div class="product-cell stock"><span class="cell-label"></span>{user.Email}</div>
        <div class="product-cell price"><span class="cell-label"></span>{user.notes}</div>
      </div>
   
))}
    </div>
  </div>
</div>
</div>
        </>
    )
}