import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch,faPlus,faMinus,faArrowRight} from '@fortawesome/free-solid-svg-icons';
import "./css/joblist.css"


export default function Joblist(){
    const [readData, setreadData] = useState([]);
   const [jobtype,setjobtype] =useState("")
const [serach,setsearch] = useState("")
    let defalutjobtype =["onsite","remote","hybrid" ]
    const[searchicon,setsearchicon] = useState("")

    const searchclicked =()=>{
      setsearchicon("active")
    }
    const searchclickednot= ()=>{
      setsearchicon("")
    }

    const handlejobtype = (type)=>{
      setjobtype( type)
      console.log(jobtype)

    }
    const handlejobtyped =()=>{
      setjobtype("")
    }

    const handelsearch =(e) =>{
      setsearch(e.target.value)
    }

    const isempty = (arr) =>{
      if( arr.length === 0){
      return false;
      }else{
        return true;
      }
    } 
    

    useEffect(() => {
      const fetchData = async () => {
        try {
         await axios.get("http://localhost:4000/post/readpost" ,{
          params: {search:jobtype , serachtitle:serach}})
            .then((Post) => setreadData(Post.data));
            
        } catch (error) {
          console.error("error", error);
        }
      };
      fetchData();
    }, [jobtype,serach]);


    let navigate = useNavigate();

    const handleclick = (postid) => {
        navigate("Apply", { state: {postid: postid }});}
        

    return(
       <>
     
       <div className="jobparent">
        <div className={`serachparent`}>
       <FontAwesomeIcon className={`search${searchicon} end-0`} icon={faSearch}  /> 
       <input className={`another${searchicon} end-0`} type="text" placeholder="Search Job"
              onChange={handelsearch}
              onClick={searchclicked}
           />
           </div>
     <div class={`sidebar${searchicon} end-0`}>
  
<FontAwesomeIcon className={`arrow start-0`} icon={faArrowRight} 
     onClick={searchclickednot} /> 
     <br/>  <br/>
            <div className="type">
      Job Title <br/>
     {defalutjobtype.map((type) =>
    <>       
               <div className='skills'>
                <FontAwesomeIcon className='delete' icon={faPlus} /> 
               {type} 
               </div>
                
                </>
            ) } 
     </div>
      <br/>
     <div className="type">
      Job Type <br/>
     {defalutjobtype.map((type) =>
            jobtype === type ?
                   <>       
                     <div className='skills' onClick={handlejobtyped}>
                      <FontAwesomeIcon className='delete' icon={faMinus} /> 
                     {type} 
                     </div>
                      
                      </>
                      : <>       
                      <div className='skills'  onClick={() => {handlejobtype(type)}}>
                       <FontAwesomeIcon className='delete' icon={faPlus} /> 
                      {type} 
                      </div>
                       
                       </>
            
            ) } 
     </div>
     </div> 
     {isempty(readData) ?
    <div >
       {readData.map((data) => (
        <div onClick={() => handleclick(data._id)} className="postblock">
          <p className="employer">{data.JobTask}</p>
            <div>
            <h3 className="text">Job Type </h3>
         <p className="title">{data.Jobtype}</p>
         </div>
            <h3 className="text">Job Title </h3>
         <p className="title">{data.Jobtitle}</p>
         <h3 className="text">Location </h3>
         <p className="title">{data.location}</p>
         <button className="btn-job">More Information</button>
          </div>
        ))}
         </div>
         : 
         <div className="nojob">
           <img 
           src={`/image/nojob.png`}/>
         </div>
         }
         </div>


       </>
    )
}