import React, { useEffect, useState } from 'react'
import Sidebar from '../layout/sidebar'
import Header from '../layout/header'
import Link from 'next/link'
import useAxiosInstances from '@/config/AxiosConfig'
import { REACT_APP_API_BASE, REACT_IMAGE_URL } from "@/config/ApiConfig";
import { catchResponse, removeItem, setItem,getItem } from '@/utils/Helper'
// import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Moment from 'react-moment';
import Swal from 'sweetalert2';
import { Modal, Button, Form ,Row,Col} from 'react-bootstrap';
import Layout from '../layout/layout'

function Profile() {
  const {axios , axiosFormData} = useAxiosInstances()
  // view profile
  const [profile, setProfile] = useState({})
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [image, setImage] = useState(null);
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
      setName(response.data.result.name)
      setEmail(response.data.result.email)
      setMobile(response.data.result.mobile)

    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    viewProfile();
  }, []);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal,setShow] = useState(false)
  const [open,setOpen] = useState(false)


  const handlePasswordChange = async (e) => {
    e.preventDefault();
  
    // Validation logic
    if (!newPassword || !confirmPassword) {
      setErrorMessage('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New Password and Confirm Password do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
  
    try {
      // Fetch the access token
      const token = getItem('access_token');
      if (!token) {
        setErrorMessage('Authorization token is missing.');
        return;
      }
  
      // Configure request headers and body
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Ensure the content type is set
        },
      };
      const requestBody = {
        password: newPassword,
      };
  
      // Send PUT request
      const response = await axios.put(
        `${REACT_APP_API_BASE}changepassword`,
        requestBody,
        config
      );
  
      // Handle the response
      if (response?.data?.status) {
          toast.success(response.data.message || 'Password changed successfully!')
          setErrorMessage('');
          setNewPassword('');
          setConfirmPassword('');
          setShow(false); // Close modal
      } else {
        // Handle API error response
        setErrorMessage(response?.data?.message || 'Failed to change password.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage(
        error.response?.data?.message || 'An error occurred. Please try again later.'
      );
    }
  };
  
  // update profile
  const handleSubmit = async(e) => {
    e.preventDefault();
    // Create a FormData object to handle image uploads
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
      formData.append("user_profile", image);
 
    // updateProfile(formData);
    const token = getItem('access_token');
    if (!token) {
      setErrorMessage('Authorization token is missing.');
      return;
    }

    // Send PUT request
    const response = await axiosFormData.put(`${REACT_APP_API_BASE}updatepofile`,formData);
    // Handle the response
    if (response?.data?.status) {
        toast.success(response.data.message || 'Profile Update successfully!!')
        viewProfile();
        setOpen(false)
    } else {
      // Handle API error response
   
    }
  };













  return (
    <Layout>
  
          <div class="emp_dash">
           <div class="page_manus">
            <ul class="text-center mb-2">
                <li class="nav-item">
                    <a href="index.html" class="deactive-link">Dashboard</a> <span class="active-link">/ Profile</span>
                </li>
            </ul>
            <div class="page_heading display">
                <h4 class="pb-3">Profile</h4>
            </div>
           </div>
           <div class="row mt-5">
            <div class="col-lg-6 col-xl-5 col-xxl-4 "style={{width:"97.666667%"}}>
                <div class="profile_card ps-xl-3 pe-lx-3">
                    <div class="card_img text-center position-relative ">
                      {profile?.user_profile? <img src={`${REACT_IMAGE_URL}${profile?.user_profile}`} alt=""/>: <img src="assets/images/emp.jpg" alt=""/>}
                    </div>
                    <div class="emp-name text-center">
                        <h2>{profile?profile.name:"N/A"} <a  onClick={()=>setOpen(true)} style={{cursor:"pointer"}}> <img src="assets/images/profile._edit.svg" alt="edit"    /></a></h2>
                        <p>  {profile.role_id === 1 ? "Admin" : "N/A"}</p>
                    </div>
                    <hr class="card_seperator"/>
                    <div class="profile_detail">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td>Phone :</td>
                                    <td>{profile?profile.mobile:"N/A"}</td>
                                </tr>
                                <tr>
                                    <td>Email :</td>
                                    <td>{profile?profile.email:"N/A"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <hr class="card_seperator"/>
                    <div class="reset_btn text-center pt-2">
                        <button class="reset_pwd" onClick={()=>{setShow(true)}} > Change Password</button>
                    </div>
                </div>
            </div>
           </div>
          </div>
      


{/* edit profile */}
<Modal show={open}  centered>
      <Modal.Header>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          <div className="position-relative">
            {profile.user_profile ? (
              <img
                src={`${REACT_IMAGE_URL}${profile?.user_profile}`}
                alt="Profile"
                className="img-fluid rounded-circle"
                style={{ width: "120px", height: "120px" }}
              />
            ) : (
              <img
                src="assets/images/emp.jpg"
                alt="Default Profile"
                className="img-fluid rounded-circle"
                style={{ width: "120px", height: "120px" }}
              />
            )}
          </div>
        </div>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col xs={12} md={6}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="formMobile">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </Form.Group>
            </Col>


 <Col xs={12} md={6}>
              <Form.Group controlId="formMobile">
                <Form.Label>Update Profile</Form.Label>
                <Form.Control
                  type="file"
                  placeholder="update Image"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e)=> setImage(e.target.files[0])}
                />
              </Form.Group>
            </Col>



          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={()=>{setOpen(false)}}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>




{/* change password modal */}
      <Modal show={showModal} >
      <Modal.Header >
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && (
          <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>
            {successMessage}
          </div>
        )}
        <Form onSubmit={handlePasswordChange}>
          <Form.Group controlId="newPassword" style={{ marginBottom: '15px' }}>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword" style={{ marginBottom: '15px' }}>
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" style={{ width: '100%' }}>
            Update Password
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={()=>{setShow(false)}}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>











    </Layout  >
  )
}

export default Profile 