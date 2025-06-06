import React, { useEffect, useState } from "react";
import Layout from "../layout/layout";
import Link from "next/link";
import useAxiosInstances from "@/config/AxiosConfig";
import { catchResponse, removeItem, setItem } from "@/utils/Helper";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Moment from "react-moment";
import Swal from "sweetalert2";

function Batch() {
  const { axios } = useAxiosInstances();
  const [data, setData] = useState([]);
  const [course, setCourse] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [studentId, setStudentId] = useState("");
  const [totalCount, setTotalCount] = useState("0");
  const [facultyList, setFacultyList] = useState([]);
  const [paginaction, setPaginaction] = useState({ page: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useRouter();
  useEffect(() => {
    const body = {
      page: paginaction.page,
      limit: paginaction?.limit,
    };
    axios
      .post("/get-batch", body)
      .then((res) => {
        if (res?.data?.status) {
          // console.log("-----",res.data.result.BatchList)
          setData(res?.data?.result?.BatchList);
          setTotalCount(res?.data?.result?.totalCount);
          removeItem("batch_id");

          // console.log('-------------->>>>>>', res.data.result.BatchList)
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  }, [paginaction, isLoading]);

  useEffect(() => {
    //  to get EMployees
  axios
    .post("/view-employee", {
      page: 1,
      limit: 50,
      attribute:["id","name"]
    })
    .then((res) => {
      if (res?.data?.status) {
        console.log("==========>>>", res?.data?.result?.UserList);
        setFacultyList(res?.data?.result?.UserList);
      }
    })
    .catch((err) => {
      catchResponse(err);
    });
  }, []);

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

  // console.log(facultyList, '----------------><>')
// To get Faculty Names
  const facultyNames = (idString) => {
    if (!idString) return "N/A";
  
    const ids = idString.split(",").map((id) => id.trim());
  
    const names = ids
      .map((id) => {
        const faculty = facultyList.find((f) => f.id.toString() === id);
        return faculty ? faculty.name : null;
      })
      .filter(Boolean);
  
    return names.join(", ");
  };

  // console.log('--=============---------234',facultyNames("49,50"))

  const handelPaginaction = () => {
    setPaginaction({ page: 1, limit: paginaction.limit + 10 });
  };

  const handelPaginactionPrview = () => {
    if (paginaction.limit > 10) {
      setPaginaction({ page: 1, limit: paginaction.limit - 10 });
    }
  };

  const handelNavigateUpdate = (e) => {
    setItem("batch_id", e);
    navigate.push("/batch/edit");
  };

  // deleted batch
  const deleteBatch = async (id) => {
    console.log("id", id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
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
          id: id,
        };
        try {
          // Make the API call
          const response = await axios.post("/batch-deleted", body);
          setIsLoading(true);
          // Close the processing alert
          Swal.close();
          // Check for success response
          if (response.data && response.data.status) {
            Swal.fire({
              title: "Deleted!",
              text: response.data.message || "Your file has been deleted.",
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Error",
              text: response.data.message || "Batch could not be deleted.",
              icon: "error",
            });
          }
        } catch (error) {
          // Close the processing alert
          Swal.close();
          // Show error alert
          Swal.fire({
            title: "Error",
            text:
              error.response?.data?.message ||
              "An error occurred while deleting the batch.",
            icon: "error",
          });
        }
      }
    });
  };

  // Status update
  const callStatusApi = async (Id, status) => {
    try {
      // Show confirmation dialog
      const confirmationResult = await Swal.fire({
        title: "Are you sure you want to change the status?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, change!",
        cancelButtonText: "No, cancel",
      });

      // If the user cancels, do nothing
      if (!confirmationResult.isConfirmed) return;

      // Show a processing alert
      const processingSwal = Swal.fire({
        title: "Processing...",
        text: "Please wait while we update the status.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Prepare the request body with the new status
      const body = {
        id: Id,
        status: status,
      };
      // return false
      // Make the API call
      const response = await axios.post("/batch-status", body);

      // Close the processing alert
      Swal.close();

      if (response.data) {
        const msg = response.data.message || "Status updated successfully!";
        Swal.fire({
          title: "Done",
          text: msg,
          icon: "success",
        });
        const body = {
          page: paginaction.page,
          limit: paginaction?.limit,
        };
        axios
          .post("/get-batch", body)
          .then((res) => {
            if (res?.data?.status) {
              // console.log("-----",res.data.result.BatchList)
              setData(res?.data?.result?.BatchList);
              setTotalCount(res?.data?.result?.totalCount);
              removeItem("batch_id");
            }
          })
          .catch((err) => {
            catchResponse(err);
          });
        setIsLoading(true);
      } else {
        throw new Error("No data returned from the server");
      }
    } catch (error) {
      // Close the processing alert in case of an error
      Swal.close();
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "An error occurred",
        icon: "error",
      });
    }
  };

  // search data for batch Management
  const handleSearch = (e) => {
    e.preventDefault();
    const student_name = document.getElementById("student_name").value.trim();
    const course = document.getElementById("course").value;
    const branch = document.getElementById("branch").value;
    const start_time = document.getElementById("start_time").value;
    const body = {
      // page: pageIndex + 1, // Page numbers are usually 1-based
      // limit: pageSize,
      page: paginaction.page,
      limit: paginaction?.limit,
      search: student_name,
      course_id: course,
      branch_id: branch,
      start_time: start_time,
      // Add other fields if needed
    };

    axios
      .post("/get-batch", body)
      .then((res) => {
        if (res?.data?.status) {
          setData(res?.data?.result?.BatchList);
          setTotalCount(res?.data?.result?.totalCount);
          // console.log("---------------------------->>>", data);
        } else {
          // Handle error response
          console.error("Error: No data returned");
        }
      })
      .catch((err) => {
        console.error("API call failed:", err);
      });
  };

const handleDownloadPdf = (e) => {
  setLoading(e?.id); 
  const body = {
    batch_id: e?.id,
  };

  axios
    .post("/student-attendance-pdf", body)
    .then((res) => {
      if (res?.data?.status) {
        toast.success(res?.data?.message);
        const url = res?.data?.result;
        window.open(url, "_blank");
      }
    })
    .catch((err) => {
      catchResponse(err);
    })
    .finally(() => {
      setLoading(null); // Stop spinner
    });
};

  return (
    <>
      <Layout>
        <div className="emp_dash">
          <div className="page_manus">
            <div className="page_heading display">
              <h4 className="pb-3">Batch Management</h4>
            </div>
          </div>
          <div className="search_show_entries display justify-content-between mt-4">
            <div className="show_entries display ps-4">
              <span className="pe-3">Show Entries</span>
              <a onClick={() => handelPaginactionPrview()} className="p-2 m-2">
                <i className="fa fa-minus" />
              </a>{" "}
              <span className="entries">{paginaction?.limit}</span>
              <a onClick={() => handelPaginaction()} className="p-2 m-2">
                <i className="fa fa-plus" />
              </a>
            </div>
            {/* <div className="leave_detail  position-relative W-100 display justify-content-between p-4 pt-2 pb-2">
          <div className="available pe-5 display justify-content-between">
            <span className="available-bg display me-2">{data?.length}</span><span>Active Batch</span>
          </div>
          <div className="seperator" />
          <div className="taken  display justify-content-between ps-5">
            <span className="taken-bg display me-2">00</span><span>Inactive Batch</span>
          </div>
        </div> */}
            <div className="apply_application">
              <Link href="/batch/add" className="btn comman_btn">
                <i className="fa fa-plus me-2" />
                Add Batch
              </Link>
            </div>
          </div>
          {/* <div class="card mt-4">
  <div class="card-body"> */}
          <form className="mb-3 mt-4" onSubmit={handleSearch}>
            <div className="row g-3 align-items-center">
              <div className="col-sm-3 col-md-3">
                <label htmlFor="student_name" className="form-label">
                  Student Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="student_name"
                  placeholder="Enter Student Name."
                  name="student_name"
                />
              </div>

              <div className="col-sm-3 col-md-3">
                <label htmlFor="course" className="form-label">
                  Course
                </label>
                <select className="form-select form-control" id="course">
                  <option value="" label="Select course" />
                  {course.map((res, i) => (
                    <option value={res?.id} key={i}>
                      {res?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-sm-6 col-md-3">
                <label htmlFor="branch" className="form-label">
                  Branch
                </label>
                <select className="form-select form-control" id="branch">
                  <option value="" label="Select Branch" />
                  <option value="1" label="Tisa" />
                </select>
              </div>

              <div className="col-sm-6 col-md-3">
                <label htmlFor="start_time" className="form-label">
                  Start Time
                </label>
                <input
                  type="time"
                  className="form-control"
                  id="start_time"
                  name="start_time"
                />
              </div>

              <div className="col-md-auto">
                <div className="d-flex gap-3">
                  <button type="submit" className="Submit_btn btn comman_btn">
                    Search
                  </button>
                  <button
                    type="button"
                    className="cancel-btn btn"
                    onClick={() => window.location.reload()}
                  >
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
                  <th style={{ width: "15%", whiteSpace: "nowrap" }}>
                    Batch Code
                  </th>
                  <th>Course</th>
                  <th>Branch</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Time</th>
                  <th>Faculty</th>
                  <th>Status</th>
                  <th>Students</th>

                  {/* <th>Status</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0
                  ? data.map((res, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        {/* <td>{res?.batch_code}</td> */}
                        <td>
                          {" "}
                          <Link href={`/batch/${res?.id}`}>
                            {res?.batch_code}
                          </Link>
                        </td>
                        <td>
                          {res?.course_details
                            ? res?.course_details.name
                            : "N/A"}
                        </td>
                        <td>{res?.branch_details.name}</td>
                        <td>
                          {" "}
                          <Moment format="DD-MMM-YYYY">
                            {res?.start_date}
                          </Moment>
                        </td>
                        <td>
                          <Moment format="DD-MMM-YYYY">{res?.end_date}</Moment>
                        </td>
                        <td>
                          <Moment format="hh:mm" parse="HH:mm:ss">
                            {res?.start_time}
                          </Moment>{" "}
                          -
                          <Moment format="hh:mm" parse="HH:mm:ss">
                            {res?.end_time}
                          </Moment>
                        </td>

                        <td>{facultyNames(res?.faculty)}</td>
                        <td>{res?.status === "Y" ? "Running" : "Completed"}</td>
                        <td>
                          ({res?.batch_details.length}),
                          {res?.batch_details
                            .map((e) => e.student_details?.name)
                            .filter((name) => name)
                            .join(", ")}
                        </td>
                        <td class="display">
                          <button
                            className="btn btn-success"
                            onClick={() => handelNavigateUpdate(res?.id)}
                          >
                            <i class="fas fa-pencil-alt"></i>
                          </button>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={res?.status === "Y"}
                                onChange={() =>
                                  callStatusApi(res?.id, res?.status)
                                }
                              />
                              <span className="slider round"></span>
                            </label>
                          </td>
                          <td>
                            {loading === res.id ? (
                              <span>
                                <a className="view_btn display me-2">
                                  <i className="fas fa-spinner fa-spin"></i>
                                </a>
                              </span>
                            ) : (
                              <span>
                                <a
                                  className="view_btn display me-2"
                                  onClick={() => handleDownloadPdf(res)}
                                >
                                  <i className="fas fa-download"></i>
                                </a>
                              </span>
                            )}
                          </td>

                          <td>
                            <button
                              className="btn btn-danger"
                              title="Delete"
                              onClick={() => deleteBatch(res?.id)}
                            >
                              <i class="fas fa-trash"></i>
                            </button>
                          </td>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>

            {totalCount.length > 10 ? (
              <>
                <a
                  onClick={() => handelPaginactionPrview()}
                  className="previous"
                >
                  &laquo; Previous
                </a>
                {/* {totalCount.length > 10 && totalCount > paginaction.limit  ?   */}
                <a onClick={() => handelPaginaction()} className="next">
                  Next &raquo;
                </a>
                {/* // :null} */}
              </>
            ) : null}
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Batch;
