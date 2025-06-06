import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import useAxiosInstances from '@/config/AxiosConfig'
import { catchResponse, MoneyFormat, removeItem, setItem } from '@/utils/Helper'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Moment from 'react-moment';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import
import {  REACT_IMAGE_URL } from '../../config/Apiconfig'
import Layout from '../layout/layout'
function BCAList() {
  const { axios , axiosFormData } = useAxiosInstances()
  const [data, setData] = useState([])
  const [show, setShow] = useState(false);
  const [studentId, setStudentId] = useState('')


  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10) 
  const [images , setImages] = useState({})
  const [alredyImage , setAlredyImage] = useState({})
  const [perviewImages , setPerviewImages] = useState({})
  const [totalActualAmount, setTotalActualAmount] = useState(0)
  const [totalPaidAmount, setTotalPaidAmount] = useState(0)
  const [totalDueAmount, setTotalDueAmount] = useState(0)
  const [search, setSearch] = useState({
    term: "", // Default value for search term
    start_date: "", // Default value for start date
    end_date: "",
    course_id: ""
    // Default value for end date
  });
  const handleShow = (id) => {
    setStudentId(id?.user_id)
    setShow(true)
  };

  
  const handleClose = () => {
    setShow(false);
    setImages({})
    setPerviewImages({})
    setAlredyImage({})
  }

  useEffect(() => {
    const body = {
      page: page,
      limit: limit
    }
    axios.post('/bac-list', body).then((res) => {
      if (res?.data?.status) {
        setData(res?.data?.result?.List)
        setTotalActualAmount(res?.data?.result?.TotalActualAmount)
        setTotalPaidAmount(res?.data?.result?.TotalPayAmount)
        setTotalDueAmount(res?.data?.result?.DuoTotalamount)
        setTotalPages(res?.data?.result?.totalPages)
        removeItem('edit_user_id')
      }
    }).catch((err) => {
      catchResponse(err)
    })
  }, [page, limit])
  useEffect(() => {
    //  to get course
    axios.post('get-assign-course').then((res) => {
      if (res.data.status) {
        setCourse(res?.data?.result)
      }
    }).catch((err) => {
      catchResponse(err)
    })

  }, [])


 
  // Handle limit change (increase the limit by 10)
  const handleLimitIncrease = () => {
    setLimit(limit + 10)
    setPage(1) // Reset to the first page when limit changes
  }

  // Handle limit decrease (decrease the limit by 10)
  const handleLimitDecrease = () => {
    if (limit > 10) {
      setLimit(limit - 10)
      setPage(1) // Reset to the first page when limit changes
    }
  }

  // Handle page change (navigate to the specific page)
  const handlePageChange = (newPage) => {
    setPage(newPage)
  }
  
  const handleInput = (e) => {
    const { name, value } = e.target;
    setSearch(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleSearch = (e) => {
    e.preventDefault()
    const body = {
      page: page,
      limit: limit,
      search: search?.term?.trim(), // Assuming you have a single input field bound to search.term
      start_date: search?.start_date,
      end_date: search?.end_date,
      course_id: search?.course_id,
    }
    axios.post('/bac-list', body).then((res) => {
      if (res?.data?.status) {
        setData(res?.data?.result?.List)
        setPaginaction({ page: res?.data?.result?.currentPage })
        setTotalPages(res?.data?.result?.totalCount)
        removeItem('edit_user_id')
      }
    }).catch((err) => {
      catchResponse(err)
    })
  }
  const handleReset = (e) => {
    e.preventDefault()
    setSearch({
      term: "", // Default value for search term
      start_date: "", // Default value for start date
      end_date: "",
      course_id: ""
      // Default value for end date
    })
    const body = {
      page: page,
      limit: limit,
    }
    axios.post('/bac-list', body).then((res) => {
      if (res?.data?.status) {
        setData(res?.data?.result?.List)
        setTotalPages(res?.data?.result?.totalCount)
        removeItem('edit_user_id')
      }
    }).catch((err) => {
      catchResponse(err)
    })
  }
  
  const handleImages = (e, type) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (file && allowedTypes.includes(file.type)) {
      const previewUrl = URL.createObjectURL(file);
   if(type == "user_image"){
    setImages((images) => ({...images, ['user_image']: file,}));
    setPerviewImages((perviewImages) => ({...perviewImages, ['user_image']: previewUrl,}));  
   }else if(type == 'aadhar_front_document'){
    setImages((images) => ({...images, ['aadhar_front_document']: file,}));
    setPerviewImages((perviewImages) => ({...perviewImages, ['aadhar_front_document']: previewUrl,}));
   }
   else if(type == 'aadhar_back_document'){
    setImages((images) => ({...images, ['aadhar_back_document']: file,}));
    setPerviewImages((perviewImages) => ({...perviewImages, ['aadhar_back_document']: previewUrl,}));
   }
   else if(type == 'mark_sheet10'){
    setImages((images) => ({...images, ['mark_sheet10']: file,}));
    setPerviewImages((perviewImages) => ({...perviewImages, ['mark_sheet10']: previewUrl,}));
   }
   else if(type == 'mark_sheet12'){
    setImages((images) => ({...images, ['mark_sheet12']: file,}));
    setPerviewImages((perviewImages) => ({...perviewImages, ['mark_sheet12']: previewUrl,}));
   }
    } else {
      toast.error("Please select a valid file type (JPG, PNG, JPEG).");
    }
  };

  const hadleUploadImages =()=>{
    if(!images?.user_image && !alredyImage.user_image){
     toast.error('Please enter student image')
    }
    else if(!images?.aadhar_front_document && !alredyImage.aadhar_front_document){
     toast.error('Please enter student aadhar card front image')
    }
    else if(!images?.aadhar_back_document && !alredyImage.aadhar_back_document){
      toast.error('Please enter student aadhar card back image')
     }
     else if(!images?.mark_sheet10 && !alredyImage.mark_sheet_10){
      toast.error('Please enter student 10th mark sheet  image')
     }
     else if(!images?.mark_sheet12 && !alredyImage.mark_sheet_12){
      toast.error('Please enter student 12th mark sheet  image')
     }else{
      const body ={
        document_type:'user_image',
        // document_type:'aadhar_document',
        // document_type:'mark_sheet10',
        // document_type:'merk_sheet_12',
        mark_sheet_12:images?.mark_sheet12,
        mark_sheet_10:images?.mark_sheet10,
        user_image:images?.user_image,
        aadhar_front_document:images?.aadhar_front_document,
        aadhar_back_document:images?.aadhar_back_document,
        user_id:studentId
      }

      axiosFormData.post('/upload-document',body).then((res)=>{
        if(res?.data?.status){
          toast.success(res?.data?.message)
          setShow(false)
          setImages({})
          setPerviewImages({})
          setAlredyImage({})
        }
      }).catch((err)=>{
        catchResponse(err)
      })

      console.log(body)
     }

  }
  useEffect(()=>{
  if(studentId){
    const body ={
      user_id:studentId
    }
   axios.post('/document-details',body).then((res)=>{
    if(res?.data?.status){
      res?.data?.result?.map((res)=>{
        setAlredyImage((perviewImages) => ({...perviewImages, [res.document_type]: res?.document}));
        console.log()
      })
    }
   }).catch((err)=>{
    catchResponse(err)
   }) 
  }
  },[studentId])


  return (
    <>
     <Layout>
          <div className="emp_dash">
            <div className="page_manus">
              <ul className="text-center mb-2">
              
              </ul>
              <div className="page_heading display">
                <h4 className="pb-3">Bca Student Management</h4>
              </div>
            </div>
            <div className="search_show_entries display justify-content-between mt-4">
              <div className="  position-relative W-100 display justify-content-between p-4 pt-2 pb-2">
              </div>
              <div className="apply_application">
              </div>
            </div>

            <div className="row g-3 g-xl-5 g-xxl-5">
<div className="col-sm-4 ">
<div className="card text-white bg-primary mb-3" style={{borderRadius:"10px",padding:"14px"}}>
<div className="row"><div className="col-8"><div className="ps-4 pt-4 pe-3 pb-4"><div className=""><h6 className="mb-2 tx-12 text-white">Total Actual Amount	</h6>
</div>
<div className="pb-0 mt-0 ">
  <div className="d-flex">
    <h4 className="tx-20 font-weight-semibold mb-2 text-white">{MoneyFormat(totalActualAmount?totalActualAmount:0)}</h4>
    </div>
    </div>
    </div>
    </div>
    <div className="col-4">
      <div className="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
      <svg xmlns="http://www.w3.org/2000/svg"  height="30" width="30" viewBox="0 0 576 512" fill="white"><path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z"/></svg></div></div></div>

</div>
</div>
<div className="col-sm-4 ">
<div className="card text-white bg-success mb-3" style={{borderRadius:"10px",padding:"14px"}}>
<div className="row"><div className="col-8"><div className="ps-4 pt-4 pe-3 pb-4"><div ><h6 className="mb-2 tx-12 text-white">Total Received  Amount	</h6>
</div>
<div className="pb-0 mt-0">
  <div className="d-flex">
    <h4 className="tx-20 font-weight-semibold mb-2 text-white">{MoneyFormat(totalPaidAmount?totalPaidAmount:0)}</h4>
    </div>
    </div>
    </div>
    </div>
    <div className="col-4">
      <div className="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
      <svg xmlns="http://www.w3.org/2000/svg"  height="30" width="30" viewBox="0 0 576 512" fill="white"><path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z"/></svg></div></div></div>

</div>
</div>

<div className="col-sm-4">
<div class="card text-white bg-info mb-3" style={{borderRadius:"10px",padding:"14px"}}>
<div class="row"><div class="col-8"><div class="ps-4 pt-4 pe-3 pb-4"><div class=""><h6 class="mb-2 tx-12 text-white"> Total Pending Amount	</h6>
</div>
<div class="pb-0 mt-0">
  <div class="d-flex">
    <h4 class="tx-20 font-weight-semibold mb-2 text-white">{MoneyFormat(totalDueAmount)}</h4>
    </div>
    </div>
    </div>
    </div>
    <div class="col-4">
      <div class="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
      <svg xmlns="http://www.w3.org/2000/svg"  height="30" width="30" viewBox="0 0 576 512" fill="white"><path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z"/></svg></div></div></div>

</div>
</div>
</div>
            <div class="row g-2">
              <div class="col-12">

                <div class="card mt-4">
                  <div class="card-body">
                    <form className='mb-3' onSubmit={handleSearch}>
                      <div className="row g-3 g-xl-5 g-xxl-5">
                        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                          <label htmlFor="father_name" className="form-label">Enter With</label>
                          <input
                            type="text"
                            className="form-control"
                            id="father_name"
                            placeholder="Enter Name/Email/ Mobile..."
                            onChange={handleInput}
                            value={search.term}
                            name="term"
                          />

                        </div>
                        
                        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                          <label htmlFor="dob" className="form-label">Start Date</label>
                          <input
                            type="date"
                            className="form-control"
                            id="dob"
                            name="start_date"

                            onChange={handleInput}
                            value={search.start_date}
                          />

                        </div>

                        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                          <label htmlFor="dob" className="form-label">End Date</label>
                          <input
                            type="date"
                            className="form-control"
                            name="end_date"
                            onChange={handleInput}
                            value={search.end_date}
                            min={search.start_date} />

                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                          <div className="btn_block" style={{display:'flex'}} >
                            <button type="submit" className="Submit_btn btn comman_btn me-3" >Search</button>
                            <button type="button" className="cancel-btn btn " onClick={handleReset} >Reset</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div></div>

              </div>
              <div className='col-12'>

                <div className="punch_table table-responsive mt-4 pt-3">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>S.NO</th>
                        <th>Student Name</th>
                        <th>Student Email</th>
                        <th>Student Mobile</th>
                        <th className="reason">Father Name</th>
                        <th className="reason">Father Mobile</th>
                        <th>Registration Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.length > 0 ? data.map((res, i) => (
                        <tr key={i}>
                          <td>{(page - 1) * limit + (i + 1)}</td>
                          <td>{res?.user_details?.name}</td>
                          <td>{res?.user_details?.email}</td>
                          <td>{res?.user_details?.mobile}</td>
                          <td>{res?.user_details?.father_name ? res?.user_details?.father_name : 'N/A'}</td>
                          <td>{res?.user_details?.father_mobile ? res?.user_details?.father_mobile : 'N/A'}</td>               
                          <td>
                          <Moment format="DD/MM/YYYY">{res?.created_at}</Moment>

                          </td>
                          <td class="display" onClick={() => handleShow(res)}>
                            <a class="view_btn display me-2">
                              <i class="fa-solid fa-upload" title='Assign Course' ></i>
                            </a>
                          </td>
                        </tr>
                      )) : null}
                    </tbody>

                  </table>
                  <div className="search_show_entries display justify-content-between mt-4">
                    <div className="show_entries display ps-4">
                      <span className="pe-3">Show Entries</span>
                      <a onClick={handleLimitDecrease} className="p-2 m-2"><i className="fa fa-minus" /></a> <span className="entries">{limit}</span>
                      <a onClick={handleLimitIncrease} className="p-2 m-2"><i className="fa fa-plus" /></a>
                    </div>
                    <nav aria-label="Page navigation example">
                      <ul className="pagination justify-content-end">
                        {/* Previous Button */}
                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                          <button
                            className="comman_btn"
                            tabIndex={page === 1 ? '-1' : ''}
                            aria-disabled={page === 1}
                            onClick={() => page > 1 && handlePageChange(page - 1)}
                          >
                            Previous
                          </button>
                        </li>

                        {/* Dynamic Page Numbers */}
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1
                          return (
                            <li className={`page-item ${page === pageNumber ? 'active' : ''}`} key={pageNumber}>
                              <a className="page-link" onClick={() => handlePageChange(pageNumber)}>
                                {pageNumber}
                              </a>
                            </li>
                          )
                        })}

                        {/* Next Button */}
                        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="comman_btn"
                            tabIndex={page === totalPages ? '-1' : ''}
                            aria-disabled={page === totalPages}
                            onClick={() => page < totalPages && handlePageChange(page + 1)}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>


                  </div>

                </div>

              </div>
            </div>

          </div>
     </Layout>
      <Modal show={show} onHide={handleClose}
              size="sm"

      >
  <Modal.Header closeButton>
    <Modal.Title>Upload Student Document</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="apply_application_main mt-4">
      <form action>
        <div className="row g-3 g-xl-5 g-xxl-5">
        <div className="col-md-6">
            <div className='form-group'>
              <div className="fileUploadBtn">
                <label htmlFor="userImage" className="md-button md-raised md-primary">
                  Upload Student Image<span>*</span>
                </label>
                <div className='file-upload-wrapper'>
                  <img src="assets/images/upload.svg" style={{ height: "20px" }} alt="upload icon" />
                  <span>Upload Student Image</span>
                  <input
                    type="file"
                    id='userImage'
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleImages(e, "user_image")}
                  />
                </div>
                <p className="error" style={{ color: 'red' }}></p>
              </div>
            </div>
         

          </div>
          <div className='col-md-6'>
            <div className='form-group imageupload-box'>
             {perviewImages?.user_image ? (
            <img src={perviewImages.user_image} alt="user_image" width="100px" />
            ) : alredyImage?.user_image ? (
             <img src={`${REACT_IMAGE_URL}${alredyImage.user_image}`} alt="user_image" width="100px" />
            ) : null}
            </div>
          </div>
          <div className="col-md-6">
            <div className='form-group'>
              <div className="fileUploadBtn">
                <label htmlFor="userAddressImage" className="md-button md-raised md-primary">
                  Upload User Adhar Card Front Image<span>*</span>
                </label>
                <div className='file-upload-wrapper'>
                  <img src="assets/images/upload.svg" style={{ height: "20px" }} alt="upload icon" />
                  <span>Upload Adhar Card Image</span>
                  <input
                    type="file"
                    id='userAddressImage'
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleImages(e, "aadhar_front_document")}
                  />
                </div>
                <p className="error" style={{ color: 'red' }}></p>
              </div>
            </div>
         

          </div>
          <div className='col-md-6'>
            <div className='form-group imageupload-box'>
          {perviewImages?.aadhar_front_document ? (
            <img src={perviewImages.aadhar_front_document} alt="aadhar_front_document" width="100px" />
            ) : alredyImage?.aadhar_front_document ? (
             <img src={`${REACT_IMAGE_URL}${alredyImage?.aadhar_front_document}`} alt="aadhar_front_document" width="100px" />
            ) : null}
            </div>
          </div>

          <div className="col-md-6">
            <div className='form-group'>
              <div className="fileUploadBtn">
                <label htmlFor="userAddressImage" className="md-button md-raised md-primary">
                  Upload User Adhar Card Back Image<span>*</span>
                </label>
                <div className='file-upload-wrapper'>
                  <img src="assets/images/upload.svg" style={{ height: "20px" }} alt="upload icon" />
                  <span>Upload Adhar Card Back Image</span>
                  <input
                    type="file"
                    id='userAddressImage'
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleImages(e, "aadhar_back_document")}
                  />
                </div>
                <p className="error" style={{ color: 'red' }}></p>
              </div>
            </div>
         

          </div>
          <div className='col-md-6'>
            <div className='form-group imageupload-box'>
          {perviewImages?.aadhar_back_document ? (
            <img src={perviewImages.aadhar_back_document} alt="aadhar_back_document" width="100px" />
            ) : alredyImage?.aadhar_back_document ? (
             <img src={`${REACT_IMAGE_URL}${alredyImage?.aadhar_back_document}`} alt="aadhar_back_document" width="100px" />
            ) : null}
            </div>
          </div>
          <div className="col-md-6">
            <div className='form-group'>
              <div className="fileUploadBtn">
                <label htmlFor="userMark10" className="md-button md-raised md-primary">
                  Upload User 10th Mark Sheet Image<span>*</span>
                </label>
                <div className='file-upload-wrapper'>
                  <img src="assets/images/upload.svg" style={{ height: "20px" }} alt="upload icon" />
                  <span>Upload 10th Mark Sheet Image</span>
                  <input
                    type="file"
                    id='userMark10'
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleImages(e, "mark_sheet10")}
                  />
                </div>
                <p className="error" style={{ color: 'red' }}></p>
              </div>
            </div>
         

          </div>
          <div className='col-md-6'>
            <div className='form-group imageupload-box'>
            {perviewImages?.mark_sheet10 ? (
            <img src={perviewImages.mark_sheet10} alt="mark_sheet10" width="100px" />
            ) : alredyImage?.mark_sheet_10 ? (
             <img src={`${REACT_IMAGE_URL}${alredyImage?.mark_sheet_10}`} alt="mark_sheet_10" width="100px" />
            ) : null}
            </div>
          </div>

          <div className="col-md-6">
            <div className='form-group'>
              <div className="fileUploadBtn">
                <label htmlFor="userMark12" className="md-button md-raised md-primary">
                  Upload User 12th Mark Sheet Image<span>*</span>
                </label>
                <div className='file-upload-wrapper'>
                  <img src="assets/images/upload.svg" style={{ height: "20px" }} alt="upload icon" />
                  <span>Upload 12th Mark Sheet Image</span>
                  <input
                    type="file"
                    id='userMark12'
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleImages(e, "mark_sheet12")}
                  />
                </div>
                <p className="error" style={{ color: 'red' }}></p>
              </div>
            </div>
         

          </div>
          <div className='col-md-6'>
            <div className='form-group imageupload-box'>
           {perviewImages?.mark_sheet12 ? (
            <img src={perviewImages.mark_sheet12} alt="mark_sheet12" width="100px" />
            ) : alredyImage?.mark_sheet_12 ? (
             <img src={`${REACT_IMAGE_URL}${alredyImage?.mark_sheet_12}`} alt="mark_sheet_12" width="100px" />
            ) : null}
            </div>
          </div>

          <div className="col-12">
            <div className="btn_block text-center">
              <a onClick={() => handleClose()} className="cancel-btn btn me-3">Cancel</a>
              <a  className="Submit_btn btn comman_btn" onClick={()=>hadleUploadImages()}  >Submit</a>
            </div>
          </div>
        </div>
      </form>
    </div>
  </Modal.Body>
</Modal>

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

export default BCAList