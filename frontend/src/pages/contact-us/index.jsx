import React, { useEffect, useState } from 'react'

import useAxiosInstances from '@/config/AxiosConfig'
import { catchResponse, removeItem, setItem } from '@/utils/Helper'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useMemo } from 'react'
import Layout from '../layout/layout'

function ContactUs() {
  const {axios} = useAxiosInstances()
  const [data , setData] = useState([])
  const [totalCount , setTotalCount] = useState('0')
  const [loading ,  setLoading] = useState(false)
  const navigate = useRouter()
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10) // Default to 10 per page
  const [search, setSearch] = useState({
    term: "", // Default value for search term
    start_date: "", // Default value for start date
    end_date: "",
    course_id: ""
    // Default value for end date
  });
  useEffect(()=>{
    const body ={
      page:page,
      limit:limit,
      start_date: search?.start_date,
      end_date: search?.end_date,
    }
   axios.post('/get-contact-list',body).then((res)=>{
    if(res?.data?.status){
     setData(res?.data?.result?.UserList)
     setTotalPages(res?.data?.result?.totalPages)

     setTotalCount(res?.data?.result?.totalCount)
     removeItem('edit_fees_id')
    }
   }).catch((err)=>{
    catchResponse(err)
   })
  },[limit,page , loading])

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

const handleSearch = (e)=>{
  e.preventDefault()
  setLoading(true)
}  


const handleReset = ()=>{
  setSearch({})
  setLoading(!loading)

}
  

  return (
    <>
   <Layout>
    
    <div className="emp_dash">
      <div className="search_show_entries display justify-content-between mt-4">
        <div className=" display ps-4">
          <h4 className="pb-3">Contact  Us Management</h4>
        </div>
   
        <div className="apply_application">
          {/* <Link href="fees-add" className="btn comman_btn"><i className="fa fa-plus me-2" />Add Fees</Link> */}
        </div>
      </div>

      <div class="card mt-4">
              <div class="card-body">
                <form className='mb-3' onSubmit={handleSearch} >
                  <div className="row g-3 g-xl-5 g-xxl-5">
                    
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
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3 ">
                      <div className="btn_block mt-4" style={{display:'flex'}} >
                        <button type="submit" className="Submit_btn btn comman_btn me-3 " >Search</button>
                        <button type="button" className="cancel-btn btn " onClick={()=>handleReset()} >Reset</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              
              </div>
               
      <div className="punch_table table-responsive mt-4 pt-3">
        <table className="table">
          <thead>
            <tr>
              <th>S.NO</th>
              <th>Name</th>
              <th>Email</th>
              <th>Course Name</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((res,i)=>(
              <tr key={i}>
                      <td>{(page - 1) * limit + (i + 1)}</td> {/* Adjust S.NO based on the page */}
              <td>{res?.name}</td>
              <td>{res?.email}</td>
              <td>{res?.course}</td>
              <td>{res?.message}</td>
              <td>{res?.created_at}</td>
            </tr>
            ))}
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
  
    </Layout>
    </>
  )
}

export default ContactUs