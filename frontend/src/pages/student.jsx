import React, { useEffect, useState } from "react";
import Layout from "./layout/layout";

import Link from "next/link";
import useAxiosInstances from "@/config/AxiosConfig";
import { catchResponse, removeItem, setItem } from "@/utils/Helper";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Moment from "react-moment";

function Student() {
  const { axios } = useAxiosInstances();
  const [data, setData] = useState([]);
  const [course, setCourse] = useState([]);
  const [courseDetail, setCourseDetail] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [studentId, setStudentId] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20); // Default to 10 per page

  const [search, setSearch] = useState({
    term: "", // Default value for search term
    start_date: "", // Default value for start date
    end_date: "",
    course_id: "",
    // Default value for end date
  });
  const navigate = useRouter();
  const handleShow = (id) => {
    setStudentId(id);
    setShow(true);
  };
  useEffect(() => {
    const body = {
      page: page,
      limit: limit,
    };
    axios
      .post("/view-student", body)
      .then((res) => {
        console.log(res?.data);
        if (res?.data?.status) {
          setData(res?.data?.result?.UserList);
          setTotalPages(res?.data?.result?.totalPages);
          removeItem("edit_user_id");
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  }, [page, limit]);
  useEffect(() => {
    //  to get course
    axios
      .post("get-assign-course")
      .then((res) => {
        if (res.data.status) {
          setCourse(res?.data?.result);
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  }, []);

  const handelSelectCourse = (e) => {
    const data = course.filter((res) => {
      return res.id == e;
    });
    setCourseDetail(...data);
  };
  const handelAssignCourse = () => {
    const body = {
      user_id: studentId,
      course_id: courseDetail?.id,
    };
    axios
      .post("student-assignCourse", body)
      .then((res) => {
        if (res?.data?.status) {
          setShow(false);
          toast.success(res?.data?.message);

          const body = {
            page: page,
            limit: limit,
          };
          axios
            .post("/view-student", body)
            .then((res) => {
              console.log(res?.data);
              if (res?.data?.status) {
                setData(res?.data?.result?.UserList);
                setTotalPages(res?.data?.result?.totalPages);
                removeItem("edit_user_id");
              }
            })
            .catch((err) => {
              catchResponse(err);
            });
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  };
  // Handle limit change (increase the limit by 10)
  const handleLimitIncrease = () => {
    setLimit(limit + 10);
    setPage(1); // Reset to the first page when limit changes
  };

  // Handle limit decrease (decrease the limit by 10)
  const handleLimitDecrease = () => {
    if (limit > 10) {
      setLimit(limit - 10);
      setPage(1); // Reset to the first page when limit changes
    }
  };

  // Handle page change (navigate to the specific page)
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handelNavigateUpdate = (e) => {
    setItem("edit_user_id", e);
    navigate.push("/student-add");
  };
  const handleInput = (e) => {
    const { name, value } = e.target;
    setSearch((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const body = {
      page: page,
      limit: limit,
      search: search?.term?.trim(), // Assuming you have a single input field bound to search.term
      start_date: search?.start_date,
      end_date: search?.end_date,
      course_id: search?.course_id,
    };
    axios
      .post("/view-student", body)
      .then((res) => {
        if (res?.data?.status) {
          setData(res?.data?.result?.UserList);
          setPaginaction({ page: res?.data?.result?.currentPage });
          setTotalPages(res?.data?.result?.totalCount);
          removeItem("edit_user_id");
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  };
  const handleReset = (e) => {
    e.preventDefault();
    setSearch({
      term: "", // Default value for search term
      start_date: "", // Default value for start date
      end_date: "",
      course_id: "",
      // Default value for end date
    });
    const body = {
      page: page,
      limit: limit,
    };
    axios
      .post("/view-student", body)
      .then((res) => {
        if (res?.data?.status) {
          setData(res?.data?.result?.UserList);
          setTotalPages(res?.data?.result?.totalCount);
          removeItem("edit_user_id");
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  };
  const handleToggleChange = async (id, isChecked) => {
    try {
      const response = await axios.put("/student-statusupdate", {
        id, // ID of the record
        status: isChecked, // Updated status
      });

      if (response.status === 200) {
        const body = {
          page: page,
          limit: limit,
        };
        axios.post("/view-student", body).then((res) => {
          if (res?.data?.status) {
            setData(res?.data?.result?.UserList);
            setTotalPages(res?.data?.result?.totalCount);
            removeItem("edit_user_id");
          }
        });
        toast.success("Status updated successfully!");
      } else {
        toast.error("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating status.");
    }
  };

  return (
    <>
      <Layout>
        <div className="emp_dash">
          <div className="page_manus">
            <ul className="text-center mb-2">
              {/* <li className="nav-item">
            <a href="index.html" className="deactive-link">Dashboard</a> <span className="active-link">/ Reports</span>
          </li> */}
            </ul>
            <div className="page_heading display">
              <h4 className="pb-3">Student Management</h4>
            </div>
          </div>
          <div className="search_show_entries display justify-content-between mt-4">
            <div className="  position-relative W-100 display justify-content-between p-4 pt-2 pb-2">
              {/* <div className="available pe-5 display justify-content-between">
                  <span className="available-bg display me-2">{data?.length}</span><span>Active Student</span>
                </div>
                <div className="seperator" />
                <div className="taken  display justify-content-between ps-5">
                  <span className="taken-bg display me-2">00</span><span>Inactive Student</span>
                </div> */}
            </div>
            <div className="apply_application">
              <Link href="/student-add" className="btn comman_btn">
                <i className="fa fa-plus me-2" />
                Add Student
              </Link>
            </div>
          </div>
          <div class="row g-2">
            <div class="col-12">
              <div class="card mt-4">
                <div class="card-body">
                  <form className="mb-3" onSubmit={handleSearch}>
                    <div className="row g-3 g-xl-5 g-xxl-5">
                      <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                        <label htmlFor="father_name" className="form-label">
                          Enter With
                        </label>
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
                        <label htmlFor="address" className="form-label">
                          Course{" "}
                        </label>
                        <select
                          className="form-select form-control p-4 pt-0 pb-0"
                          id="branch"
                          onChange={handleInput}
                          value={search.course_id}
                          name="course_id"
                        >
                          <option label="Select Course" />
                          {course?.map((res, i) => (
                            <option value={res?.id} key={i}>
                              {res?.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                        <label htmlFor="dob" className="form-label">
                          Start Date
                        </label>
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
                        <label htmlFor="dob" className="form-label">
                          End Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="end_date"
                          onChange={handleInput}
                          value={search.end_date}
                          min={search.start_date}
                        />
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                        <div className="btn_block">
                          <button
                            type="submit"
                            className="Submit_btn btn comman_btn me-3"
                          >
                            Search
                          </button>
                          <button
                            type="button"
                            className="cancel-btn btn "
                            onClick={handleReset}
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-12">
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
                      <th>Status</th>
                      {/* <th></th> */}
                      <th>Course Assign</th>
                      <th>Registration Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0
                      ? data.map((res, i) => (
                          <tr key={i}>
                            <td>{(page - 1) * limit + (i + 1)}</td>
                            <td>{res?.name}</td>
                            <td>{res?.email}</td>
                            <td>{res?.mobile}</td>
                            <td>
                              {res?.father_name ? res?.father_name : "N/A"}
                            </td>
                            <td>
                              {res?.father_mobile ? res?.father_mobile : "N/A"}
                            </td>
                            <td>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={res?.status === "Y"}
                                  onChange={(e) =>
                                    handleToggleChange(res.id, res.status)
                                  }
                                />
                                <span className="slider round"></span>
                              </label>
                            </td>

                            <td>
                              {res?.course_details.map((result) => (
                                <p>{result?.course_details?.name}</p>
                              ))}
                            </td>
                            <td>
                              <Moment format="DD/MM/YYYY">
                                {res?.created_at}
                              </Moment>
                            </td>
                            <td class="display">
                              <a class="view_btn display me-2">
                                <i
                                  class="fas fa-book "
                                  title="Assign Course"
                                  onClick={() => handleShow(res?.id)}
                                ></i>
                              </a>
                              <span>
                                {" "}
                                <a
                                  class="view_btn display"
                                  onClick={() => handelNavigateUpdate(res?.id)}
                                >
                                  <i class="fas fa-pencil-alt"></i>
                                </a>
                              </span>
                            </td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
                <div className="search_show_entries display justify-content-between mt-4">
                  <div className="show_entries display ps-4">
                    <span className="pe-3">Show Entries</span>
                    <a onClick={handleLimitDecrease} className="p-2 m-2">
                      <i className="fa fa-minus" />
                    </a>{" "}
                    <span className="entries">{limit}</span>
                    <a onClick={handleLimitIncrease} className="p-2 m-2">
                      <i className="fa fa-plus" />
                    </a>
                  </div>
                  <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-end">
                      {/* Previous Button */}
                      <li
                        className={`page-item ${page === 1 ? "disabled" : ""}`}
                      >
                        <button
                          className="comman_btn"
                          tabIndex={page === 1 ? "-1" : ""}
                          aria-disabled={page === 1}
                          onClick={() => page > 1 && handlePageChange(page - 1)}
                        >
                          Previous
                        </button>
                      </li>

                      {/* Dynamic Page Numbers */}
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <li
                            className={`page-item ${
                              page === pageNumber ? "active" : ""
                            }`}
                            key={pageNumber}
                          >
                            <a
                              className="page-link"
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </a>
                          </li>
                        );
                      })}

                      {/* Next Button */}
                      <li
                        className={`page-item ${
                          page === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="comman_btn"
                          tabIndex={page === totalPages ? "-1" : ""}
                          aria-disabled={page === totalPages}
                          onClick={() =>
                            page < totalPages && handlePageChange(page + 1)
                          }
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

      <Modal show={show} onHide={handleClose} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Assign Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="apply_application_main mt-4">
            <form action>
              <div className="row g-3 g-xl-5 g-xxl-5">
                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6 leave_type">
                  <label htmlFor="leave-type" className="form-label">
                    Course
                  </label>
                  <select
                    className="form-select form-control p-4 pt-0 pb-0"
                    aria-label="Default select example"
                    onChange={(e) => handelSelectCourse(e.target.value)}
                  >
                    <option value="" label="Select course" />
                    {course?.map((res, i) => (
                      <option value={res?.id} key={i}>
                        {res?.name}
                      </option>
                    ))}
                  </select>
                </div>

                {courseDetail?.name ? (
                  <>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                      <label htmlFor="total_amount" className="form-label">
                        Course Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="total_amount"
                        value={courseDetail?.name || ""}
                        disabled
                      />
                    </div>

                    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                      <label htmlFor="total_amount" className="form-label">
                        Course Fees
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="total_amount"
                        value={courseDetail?.fees || ""}
                        disabled
                      />
                    </div>

                    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                      <label htmlFor="total_amount" className="form-label">
                        Course Duration
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="total_amount"
                        value={courseDetail?.duration || ""}
                        disabled
                      />
                    </div>
                  </>
                ) : null}

                <div className="col-12">
                  <div className="btn_block text-center">
                    <a
                      onClick={() => handleClose()}
                      className="cancel-btn btn me-3"
                    >
                      Cancel
                    </a>
                    <a
                      onClick={() => handelAssignCourse()}
                      className="Submit_btn btn comman_btn"
                    >
                      Submit
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Student;
