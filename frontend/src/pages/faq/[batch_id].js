import React, { useEffect, useState } from 'react'
import Sidebar from '../layout/sidebar'
import Header from '../layout/header'
import useAxiosInstances from '@/config/AxiosConfig'
import { catchResponse, removeItem, setItem } from '@/utils/Helper'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
// import { useRouter } from 'next/navigation'
import { useRouter } from 'next/router';
import Moment from 'react-moment';
import Select from "react-select";
import Swal from 'sweetalert2';


function StudentAdd() {
  const {axios} = useAxiosInstances()
  const [data , setData] = useState([])
  // console.log("------------",data)
  const [course , setCourse ] = useState([])
  const [courseDetail , setCourseDetail] = useState({})
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [studentId  , setStudentId] = useState('')
  const [totalCount , setTotalCount] = useState('0')
  const [paginaction, setPaginaction] = useState({ page: 1, limit: 10 });
  const [student, setStudent] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [batchStudentIds , setBatchStudentIds] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([]);

  // const navigate = useRouter()
  const router = useRouter();
  const { batch_id } = router.query;
  useEffect(()=>{
    const body ={
      page:paginaction.page,
      limit:paginaction?.limit
    }
   axios.post('/get-batch',body).then((res)=>{
  if(res?.data?.status){
    // console.log("-----",res.data.result.BatchList)
   setData(res?.data?.result?.BatchList)
   setTotalCount(res?.data?.result?.totalCount)
   removeItem('edit_user_id')
  }
   }).catch((err)=>{
    catchResponse(err)
   })
  },[paginaction])
   useEffect(() => {
  
      // to get student
      axios.post("getLegacyStudent").then((res) => {
          if (res.data.status) {
            setStudent(res?.data?.result);
          }
        })
        .catch((err) => {
          catchResponse(err);
        });
    }, []);

    // Handle search input change
  const handleInputChange = (inputValue) => {
    setSearchInput(inputValue);
  };

  // Handle selection change
  const handleStudentChange = (selectedOption) => {
    setSelectedStudents(selectedOption);
    const studentarray =[]

    selectedOption.map((res)=>(
      studentarray.push(res.value)
    ))

    setBatchStudentIds(studentarray)
    // formik.setFieldValue("student", selectedOption ? selectedOption.value : "");
  };

 const handelPaginaction =()=>{
  setPaginaction({page:1, limit:paginaction.limit +10})
 }

 const handelPaginactionPrview =()=>{
  if(paginaction.limit > 10){
    setPaginaction({page:1, limit:paginaction.limit -10})
  }
 }

 const filteredOptions = student
 .filter((res) => res.name.toLowerCase().includes(searchInput.toLowerCase()))
 .map((res) => ({
   value: res.id,
   label: res.name,
 }));


const [isLoading,setIsLoading] = useState(false);

 const handleAddNew = (e)=>{
  e.preventDefault(); // Prevents page reload
  const body ={
    student_id: batchStudentIds,
    batch_id:batch_id
  }
  axios.post('/batch-add-student',body).then((res)=>{
if(res?.data?.status){
  toast.success(res?.data?.message)
  setIsLoading(true)
  setSelectedStudents([])
}else{
  toast.error(res?.data?.message)
}
  }).catch((err)=>{
    catchResponse(err)
  })
 }


 useEffect(()=>{
  if(batch_id){
  const body ={
    page:paginaction.page,
    limit:paginaction?.limit,
    search:batch_id
  }
 axios.post('/batch-list-student',body).then((res)=>{
if(res?.data?.status){
setStudentList(res.data.result.BatchList)
}
 }).catch((err)=>{
  catchResponse(err)
 })
}
},[paginaction , batch_id,isLoading])


// deleted batch
const deleteStudent = async (id) => {
  // console.log("iopou",id)
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      // Show processing alert
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we delete the batch.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const body = {
        id: id
      };
      try {
        // Make the API call
        const response = await axios.post('/student-deleted', body);
        setIsLoading(true)
        // Close the processing alert
        Swal.close();
        // Check for success response
        if (response.data && response.data.status) {
          Swal.fire({
            title: "Deleted!",
            text: response.data.message || "Your file has been deleted.",
            icon: "success"
          });
        } else {
          Swal.fire({
            title: "Error",
            text: response.data.message || "Batch could not be deleted.",
            icon: "error"
          });
        }
      } catch (error) {
        // Close the processing alert
        Swal.close();
        // Show error alert
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "An error occurred while deleting the batch.",
          icon: "error"
        });
      }
    }
  });
};









  return (
    <>
    <div className="employee_dashboard ">
  <aside>
    <div className="dashboard_left_block" id="sidebar">
      <div className="closemenu d-lg-none d-md-block">
        <i className="fas fa-times" />
      </div>
      <Sidebar/>
    </div>
  </aside>
  <main className="dashboard_right_block">
   <Header/>
    <div className="emp_dash">
      <div className="page_manus">
        <ul className="text-center mb-2">
          <li className="nav-item">
            <a href="index.html" className="deactive-link">Dashboard</a> <span className="active-link">/ Batch</span>
          </li>
        </ul>
        <div className="page_heading display">
          <h4 className="pb-3">Add Students</h4>
        </div>
      </div>
      {/* <div className="search_show_entries display justify-content-between mt-4">
        <div className="show_entries display ps-4">
          <span className="pe-3">Show Entries</span>
          <a onClick={()=>handelPaginactionPrview()} className="p-2 m-2"><i className="fa fa-minus" /></a> <span className="entries">{paginaction?.limit}</span>
          <a onClick={()=>handelPaginaction()} className="p-2 m-2"><i className="fa fa-plus" /></a>
        </div>
        <div className="leave_detail  position-relative W-100 display justify-content-between p-4 pt-2 pb-2">
          <div className="available pe-5 display justify-content-between">
            <span className="available-bg display me-2">{data?.length}</span><span>Active Batch</span>
          </div>
          <div className="seperator" />
          <div className="taken  display justify-content-between ps-5">
            <span className="taken-bg display me-2">00</span><span>Inactive Batch</span>
          </div>
        </div>
        <div className="apply_application">
          <Link  href="/batch/add" className="btn comman_btn"><i className="fa fa-plus me-2" />Add Batch</Link>
        </div>
      </div> */}
      <div class="card mt-4">
              <div class="card-body">
                <form className='mb-3' onSubmit={handleAddNew} >
                  <div className="row g-3 g-xl-5 g-xxl-5">
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                      <label htmlFor="father_name" className="form-label">Student Name</label>
<Select
        id="student"
        options={filteredOptions}
        classNamePrefix="react-select"
        className="form-control"
        placeholder="Type to search..."
        onInputChange={handleInputChange}
        onChange={handleStudentChange}
        // onBlur={() => formik.setFieldTouched("student", true)}
        value={selectedStudents}
        isMulti
        isClearable // Adds a clear button
        required
        noOptionsMessage={() =>
          searchInput === "" ? "Type to search..." : "No options found"
        }
      />

                    </div>
                    <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
                      <div className="btn_block mt-4 d-flex">
                        <button type="submit" className="Submit_btn btn comman_btn me-3 " >Add Student</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div></div>


      <div className="punch_table table-responsive mt-4 pt-3">
        <table className="table">
          <thead>
            <tr>
              <th>S.NO</th>
              <th>Branch</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Course</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {studentList?.length > 0 ? studentList.map((res , i )=>(
            <tr  key={i}>
              <td>{i+1}</td>
              {/* <td>{res?.batch_code}</td> */}
              <td> {res.batch_details.branch_details.name} </td>
              <td>{res.student_details.name}</td>
              <td>{res.student_details.mobile}</td>
              <td>{res.batch_details.course_details.name}</td>
        
                <td class="display">
                  {/* <span> <a class="view_btn display" onClick={()=>handelNavigateUpdate(res?.id)}  ><i class="fas fa-pencil-alt"></i></a></span> */}
                  <td><button className="btn btn-danger" title="Delete" onClick={()=>deleteStudent(res?.id)}   ><i class="fas fa-trash"></i></button></td>
                </td>
            </tr>
            )) : null}
          </tbody>
        </table>
        {totalCount.length > 10 ? 
        <>
        <a onClick={()=>handelPaginactionPrview()} className="previous">&laquo; Previous</a>
        {/* {totalCount.length > 10 && totalCount > paginaction.limit  ?   */}
        <a onClick={()=>handelPaginaction()} className="next">Next &raquo;</a>
        {/* // :null} */}
        </> 
         :null}
      </div>   
    </div>
  </main>

</div>

<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="apply_application_main mt-4">
  <form action>
    <div className="row g-3 g-xl-5 g-xxl-5">
      <div className=" col-sm-6  col-md-6 col-lg-6 col-xl-6 col-xxl-6 leave_type">
        <label htmlFor="leave-type" className="form-label">Course</label>
        <select className="form-select form-control p-4 pt-0 pb-0" aria-label="Default select example" onChange={(e)=>handelSelectCourse(e.target.value)}  >
        <option value="" label="Select course" />
            {course?.map((res , i)=>(
              <option value={res?.id} key={i} >{res?.name}</option>
            ))}
        </select>
      </div>
      {courseDetail?.name ? 
      <>
      <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
          <label htmlFor="total_amount" className="form-label">Course Name</label>
          <input
            type="text"
            className="form-control"
            id="total_amount"
            value={courseDetail?.name || ''}
            disabled
            />
        </div>
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
          <label htmlFor="total_amount" className="form-label">Course Fees</label>
          <input
            type="text"
            className="form-control"
            id="total_amount"
            value={courseDetail?.fees || ''}
            disabled
            />
        </div>
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
          <label htmlFor="total_amount" className="form-label">Course Duration</label>
          <input
            type="text"
            className="form-control"
            id="total_amount"
            value={courseDetail?.duration || ''}
            disabled
            />
        </div>
            </>
:null}
      <div className="col-lg-12">
        <div className="btn_block text-center">
          <a onClick={()=>handleClose()} className="cancel-btn btn  me-3">Cancel</a>
          <a onClick={()=>handelAssignCourse()} className="Submit_btn btn comman_btn">Submit</a>
        </div>
      </div>
    </div>
  </form>
</div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default StudentAdd
