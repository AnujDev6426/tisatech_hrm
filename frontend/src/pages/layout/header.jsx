import React ,{useEffect,useState}from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import
import { getItem } from '@/utils/Helper'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import useAxiosInstances from '@/config/AxiosConfig'
import { REACT_APP_API_BASE, REACT_IMAGE_URL } from "../../config/Apiconfig";


function Header({toggleSidebar }) {
  const Router= useRouter()
  const tokan=getItem('access_token')
  useEffect(() => {
    viewProfile();
 if(!tokan){
  Router.push('/')
 }
  }, [tokan])

  const {axios , axiosFormData} = useAxiosInstances();
  const [profile, setProfile] = useState({})
 const viewProfile = async () => {
    try {
      // Get token from localStorage
      const token = getItem('access_token');
      // Configure headers with Bearer token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Send GET request with token in headers
      const response = await axios.get(`${REACT_APP_API_BASE}user`, config);
      setProfile(response.data.result);

    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    viewProfile();
  }, []);


  return (
    <>
     <div className="header">
      <div className="emplpoyee_name d-flex align-items-center">
        <button className=" me-md-4 me-sm-2 " id="toggle_btn" type="button" onClick={toggleSidebar} >
          <i className="fas fa-bars" />
        </button>
        <h4 className="mb-0 text-white" ><span>Welcome back</span> Tisa Admin</h4>
      </div>
      <Link href="/profile">

      <div className="employee_degination">
     
        <div className="emp_detail d-flex align-items-center">
          <div className="profile_img">
            {/* <a href="profile.html"><img src="assets/images/emp.jpg" alt="profile" className="img-fluid" /></a> */}
                                  {profile?.user_profile? <img src={`${REACT_IMAGE_URL}${profile?.user_profile}`} alt=""/>: <img src="/assets/images/emp.jpg" alt=""/>}
            
          </div>
          <div className="name_degination">
            <div  className="emp__name">{profile?profile.name:"N/A"} </div>
          </div>
        </div>
      </div>
      </Link>

    </div>
    <ToastContainer
        position="top-center" // Positioning the toast at the top center
        autoClose={2000}     // Auto close after 2 seconds
        hideProgressBar      // Optionally hide the progress bar
        closeOnClick         // Optionally close on click
        pauseOnHover         // Optionally pause on hover
        draggable            // Optionally make it draggable
        pauseOnFocusLoss     // Optionally pause on focus loss
      />
    </>
  )
}

export default Header