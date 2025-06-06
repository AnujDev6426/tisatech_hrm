import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import useAxiosInstances from '@/config/AxiosConfig'
import { catchResponse, removeItem, setItem } from '@/utils/Helper'
// import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Moment from 'react-moment';
import Swal from 'sweetalert2';
import { FaRegComment } from 'react-icons/fa';  // Comment icon from react-icons
import { Modal, Button,Form  } from 'react-bootstrap';  // Modal component from react-bootstrap
import Layout from '../layout/layout'


function FollowUps() {
  const {axios} = useAxiosInstances()
  const [data , setData] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [totalCount , setTotalCount] = useState('0')
  const [paginaction, setPaginaction] = useState({ page: 1, limit: 10 });
  const [isLoading,setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10) // Default to 10 per page

  const [details , setDetails] = useState({})
  const navigate = useRouter()
  useEffect(()=>{
    const body ={
      page: page,
      limit: limit
    }
   axios.post('/view-list-followup',body).then((res)=>{
  if(res?.data?.status){
 // Process the FollowUpList to extract the last message
 const processedData = res?.data?.result?.FollowUpList.map((item) => {
  let lastMessage = null;
  try {
    // Parse the message field and get the last message
    const messages = JSON.parse(item.message);
    lastMessage = messages.at(-1); // or messages.slice(-1)[0];
  } catch (error) {
    console.error('Error parsing message:', error);
  }
  // Return the modified item with the lastMessage field
  return { ...item, lastMessage };
});
setData(processedData)
setTotalCount(res?.data?.result?.totalCount)
setTotalPages(res?.data?.result?.totalPages)
// setData(res?.data?.result?.FollowUpList)
  }
   }).catch((err)=>{
    catchResponse(err)
   })
  },[page, limit])

 const handelPaginaction =()=>{
  setPaginaction({page:1, limit:paginaction.limit +10})
 }

 const handelPaginactionPrview =()=>{
  if(paginaction.limit > 10){
    setPaginaction({page:1, limit:paginaction.limit -10})
  }
 }


// search data for batch Management
const handleSearch = (e) => {
  e.preventDefault();
  const updatedDate = document.getElementById('updatedDate').value;
  const body = {
    // page:paginaction.page,
    // limit:paginaction?.limit,
    page: page,
    limit: limit,
    updatedAt: updatedDate,
    status:selectStatus
    // Add other fields if needed
  };

  axios.post("/view-list-followup", body)
    .then((res) => {
      if (res?.data?.status) {
        setData(res?.data?.result?.FollowUpList)
        setTotalCount(res?.data?.result?.totalCount)
        setPaginaction({ page: res?.data?.result?.currentPage })
        setTotalPages(res?.data?.result?.totalCount)
      } else {
        // Handle error response
        console.error('Error: No data returned');
      }
    })
    .catch((err) => {
      console.error('API call failed:', err);
    });
};

const [showModal, setShowModal] = useState(false); // Modal visibility
const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState(''); // New comment input
const [status, setStatus] = useState('1'); // Current status
const [selectStatus, setSelectStatus] = useState(null); // Current status

// Toggle modal visibility
const handleModalToggle = () => setShowModal(!showModal);

// Add a new comment with the current timestamp
const handleAddComment = (e) => {
  e.preventDefault();
   const body ={
    message_id:details.id,
    message:newComment
   }
  axios.post('/send-message',body).then((res)=>{
   if(res.data.status){
    setNewComment('')
    const body = {
      id: details.id,
    }
    axios.post('/details-FollowUp',body).then((resp)=>{
     if(resp?.data?.status){
      setComments(JSON.parse(resp?.data?.result?.message))
     }
    }).catch((err)=>{
      catchResponse(err)
    })
   }
  }).catch((err)=>{
    console.log(err)
  })
};

const [successMessage, setSuccessMessage] = useState('');
// Update the status
const handleStatusUpdate = async () => {
  try {
    const body = {
      id: details.id,
      status: status,
    };
    // Call the API
    const response = await axios.post('/follow-up-status', body);
    if (response?.data?.status) {
      const message = response.data.message || 'Status updated successfully!';
      setSuccessMessage(message); // Set success message in state
       // Remove the success message after 2 seconds
       setTimeout(() => setSuccessMessage(''), 2000);
    } else {
      toast.error(response.data.message || 'Failed to update status.');
    }
  } catch (error) {
    console.error('Error updating status:', error);
    toast.error(error.response?.data?.message || 'An error occurred while updating status.');
  }
};



const handleOpen = (data)=>{
setDetails(data)
setShowModal(true)

const body = {
  id: data.id,
}
axios.post('/details-FollowUp',body).then((res)=>{
 if(res?.data?.status){
  setComments(JSON.parse(res?.data?.result?.message))
  setStatus(res?.data?.result?.status)
 }
}).catch((err)=>{
  catchResponse(err)
})
}


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






  return (
    <>
   <Layout>
    <div className="emp_dash">
      <div className="page_manus">
        <ul className="text-center mb-2">
          <li className="nav-item">
            <a href="index.html" className="deactive-link">Dashboard</a> <span className="active-link">/ Follow-ups</span>
          </li>
        </ul>
        <div className="page_heading display">
          <h4 className="pb-3">Follow -Up Management</h4>
        </div>
      </div>
      <div className="search_show_entries display justify-content-between mt-4">
        <div className="show_entries display ps-4">
          <span className="pe-3">Show Entries</span>
          <a onClick={()=>handelPaginactionPrview()} className="p-2 m-2"><i className="fa fa-minus" /></a> <span className="entries">{paginaction?.limit}</span>
          <a onClick={()=>handelPaginaction()} className="p-2 m-2"><i className="fa fa-plus" /></a>
        </div>
      
        <div className="apply_application">
          <Link  href="/follow-ups/import-excel" className="btn comman_btn"><i className="fa fa-plus me-2" />Import Excel</Link>
        </div>
        <div className="apply_application">
          <Link  href="/follow-ups/add" className="btn comman_btn"><i className="fa fa-plus me-2" />Add Follow-Ups</Link>
        </div>
      </div>
      {/* <div class="card mt-4">
  <div class="card-body"> */}
   <form className="mb-3 mt-4" onSubmit={handleSearch}>
  <div className="row g-3 align-items-center">
    <div className="col-sm-6 col-md-3">
      <label htmlFor="updatedDate" className="form-label">
        Last Updated
      </label>
      <input type="date" className="form-control" id="updatedDate" name="updatedDate" />
    </div>

    <div className="col-sm-6 col-md-3">
      <label htmlFor="Status" className="form-label">
        Status
      </label>
      <Form.Control
                as="select"
                value={selectStatus}
                onChange={(e) => setSelectStatus(e.target.value)}
              >
                <option value="">-Select Status-</option>
                <option value="1">Interested</option>
                <option value="2">Not Interested</option>
                <option value="3">Converted</option>
              </Form.Control>
    </div>


    <div className="col-md-auto">
      <div className="d-flex gap-3">
        <button type="submit" className="Submit_btn btn comman_btn">
          Search
        </button>
        <button type="button" className="cancel-btn btn" onClick={() => window.location.reload()}>
          Reset
        </button>
      </div>
    </div>
  </div>
</form>

  {/* </div>
</div> */}





      <div className="punch_table table-responsive mt-4 pt-3">
        <table className="table">
          <thead>
            <tr>
              <th>S.NO</th>
              {/* <th>Batch Code</th> */}
              <th style={{ width: "15%", whiteSpace: "nowrap" }}>Name</th>
              <th style={{ width: "15%", whiteSpace: "nowrap" }}>Father's Name</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Remark</th>
              <th>Last Updated</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? data.map((res , i )=>(
            <tr  key={i}>
              <td>{i+1}</td>
              <td> {res.name}</td>
              <td>{res.father_name?res.father_name:"N/A"}</td>
              <td>{res.mobile}</td>
              <td>{res.address?res.address:"N/A"}</td>
              <td>{res.lastMessage?res.lastMessage:"N/A"}</td>
              <td> <Moment format="DD-MMM-YYYY">{res?.updatedAt}</Moment></td>
              {/* <td>{res?.status === "Y" ? "In progress" : "Convert"}</td> */}
              <td
  style={{
    color:
      res?.status === "1"
        ? "blue"
        : res?.status === "2"
        ? "red"
        : res?.status === "3"
        ? "green"
        : "black",
    fontWeight: "bold",
  }}
>
  {res?.status === "1"
    ? "Interested"
    : res?.status === "2"
    ? "Not Interested"
    : res?.status === "3"
    ? "Converted"
    : "Unknown"}
</td>

                <td class="display">
                <button
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        onClick={()=>handleOpen(res)}  // Toggle modal visibility on click
      >
        <FaRegComment size={30} color="#007bff" />
      </button>
                </td>
            </tr>
            )) : null}
          </tbody>
        </table>        
     

        <div className="search_show_entries display justify-content-between mt-4">
  <div className="show_entries display ps-4">
    <span className="pe-3">Show Entries</span>
    <a onClick={handleLimitDecrease} className="p-2 m-2">
      <i className="fa fa-minus" />
    </a>
    <span className="entries">{limit}</span>
    <a onClick={handleLimitIncrease} className="p-2 m-2">
      <i className="fa fa-plus" />
    </a>
  </div>
  <nav aria-label="Page navigation example">
    <ul className="pagination justify-content-end">
      {/* Previous Button */}
      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
        <button
          className="comman_btn"
          tabIndex={page === 1 ? '-1' : undefined}
          aria-disabled={page === 1}
          onClick={() => page > 1 && handlePageChange(page - 1)}
        >
          Previous
        </button>
      </li>

      {/* Dynamic Page Numbers */}
      {(() => {
  const pageNumbersToShow = 3; // Number of page numbers to display at a time
  const startPage = Math.max(1, page - Math.floor(pageNumbersToShow / 2));
  const endPage = Math.min(totalPages, startPage + pageNumbersToShow - 1);

  // Adjust startPage if endPage is less than the total pages
  const adjustedStartPage = Math.max(1, endPage - pageNumbersToShow + 1);

  return Array.from({ length: endPage - adjustedStartPage + 1 }, (_, index) => {
    const pageNumber = adjustedStartPage + index;
    return (
      <li
        className={`page-item ${page === pageNumber ? 'active' : ''}`}
        key={pageNumber}
      >
        <a className="page-link" onClick={() => handlePageChange(pageNumber)}>
          {pageNumber}
        </a>
      </li>
    );
  });
})()}


      {/* Next Button */}
      <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
        <button
          className="comman_btn"
          tabIndex={page === totalPages ? '-1' : undefined}
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
  

     {/* Modal Component */}
     <Modal show={showModal} onHide={handleModalToggle}>
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {/* Display Comments */}
          {comments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {comments.map((comment, index) => (
                <div
                  key={index}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    background: '#f1f1f1',
                    alignSelf: 'flex-start',
                  }}
                >
                  <p style={{ margin: 0 }}>{comment}</p>
                  {/* Timestamp below the comment */}
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#888',
                      marginTop: '5px',
                      display: 'block',
                    }}
                  >
                    {comment.date}
                  </span>
                </div>
              ))}
              {/* <p>{details?.updatedAt}</p> */}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#888' }}>No comments yet.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div style={{ width: '100%' }}>

  {/* Success Message */}
  {successMessage && (
          <div
            style={{
              textAlign: 'center',
              color: 'green',
              marginBottom: '10px',
              fontWeight: 'bold',
            }}
          >
            {successMessage}
          </div>
        )}


            {/* Input Field for New Comment */}
            <form onSubmit={handleAddComment}style={{ width: '100%' }}>
            <textarea
              placeholder="Write a comment..."
              rows="1"
              style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
              required
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              variant="primary"
              type="submit"
              style={{ width: '100%', marginBottom: '10px' }}
              // onClick={handleAddComment}
            >
              Add Comment
            </Button>
            </form>
            {/* Status Dropdown */}
            <Form.Group controlId="statusSelect" style={{ marginBottom: '10px' }}>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="1">Interested</option>
                <option value="2">Not Interested</option>
                <option value="3">Converted</option>
              </Form.Control>
            </Form.Group>

            {/* Update Status Button */}
            <Button variant="success" style={{ width: '100%' }} onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </div>
        </Modal.Footer>
      </Modal>



</Layout>
    </>
  )
}

export default FollowUps 