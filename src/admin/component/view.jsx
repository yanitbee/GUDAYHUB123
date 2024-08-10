import "./view.css"


export default function View ({data}){



    const getProfilePicUrl = (fileName) => {
        return `http://localhost:4000/${fileName}`;
      };
    

      const isFreelancerProfileComplete = (freelancerProfile) => {
        if (!freelancerProfile) return false;
     
        const { profilepic, title, skills, cv, additionaldoc, gudayhistory, workhistory, rating, description, portfolio } = freelancerProfile;
      
        if (
          !profilepic ||
          !title ||
          skills.length === 0 ||
          !cv ||
          additionaldoc.educations.length === 0 ||
          additionaldoc.certifications.length === 0 ||
          gudayhistory.jobs === 0 ||
          gudayhistory.hired === 0 ||
          workhistory.length === 0 ||
          rating === 0 ||
          !description ||
          (portfolio && (!portfolio.link || !portfolio.title))
        ) {
          return false;
        }
      
        return true;
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
        <div class="product-cell category">User type</div>
        <div class="product-cell status-cell">Profile status</div>
        <div class="product-cell sales">Phone Number</div>
        <div class="product-cell stock">Email</div>
        <div class="product-cell price">Created Date</div>
      </div>
      {data.map((user) => (  
      <div class="products-row">
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
        <div class="product-cell category"><span class="cell-label"></span>{user.Usertype}</div>
        <div class="product-cell status-cell">
            {isFreelancerProfileComplete( user.freelancerprofile) ?(
          <span class="cell-label">Completed</span>)
          :(
          <span class="status disabled">Not Completed</span>)
            }
        </div>
        <div class="product-cell sales"><span class="cell-label"></span>{user.Phonenumber}</div>
        <div class="product-cell stock"><span class="cell-label"></span>{user.Email}</div>
        <div class="product-cell price"><span class="cell-label"></span>{user.CreatedDate}</div>
      </div>
   
))}
    </div>
  </div>
</div>
</div>
        </>
    )
}