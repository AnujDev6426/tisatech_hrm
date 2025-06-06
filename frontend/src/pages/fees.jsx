import React, { useEffect, useState } from "react";
import Layout from "./layout/layout";

import useAxiosInstances from "@/config/AxiosConfig";
import {
  catchResponse,
  MoneyFormat,
  removeItem,
  setItem,
} from "@/utils/Helper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Moment from "react-moment";

function Legacy() {
  const { axios } = useAxiosInstances();
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState("0");
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const [totalPages, setTotalPages] = useState(0);
  const [totalActualAmount, setTotalActualAmount] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalDueAmount, setTotalDueAmount] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [course, setCourse] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20); // Default to 10 per page
  const [search, setSearch] = useState({
    term: "", // Default value for search term
    start_date: "", // Default value for start date
    end_date: "",
    course_id: "",
    // Default value for end date
  });
  useEffect(() => {
    const body = {
      page: page,
      limit: limit,
    };
    axios
      .post("/get-laser", body)
      .then((res) => {
        if (res?.data?.status) {
          setData(res?.data?.result?.legacyList);
          setTotalPages(res?.data?.result?.totalPages);
          setTotalActualAmount(res?.data?.result?.TotalActualAmount);
          setTotalPaidAmount(res?.data?.result?.TotalPayAmount);
          setTotalDueAmount(res?.data?.result?.DuoTotalamount);
          setTotalCount(res?.data?.result?.totalCount);
          setCurrentAmount(res?.data?.result?.current_month_fees);

          removeItem("edit_fees_id");
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  }, [limit, page]);

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
    setItem("edit_fees_id", e);
    navigate.push("/fees-update");
  };

  const handleDownloadPdf = (e) => {
    setLoading(e?.id);
    const body = {
      user_id: e?.user_id,
      course_id: e?.course_id,
      fees_id: e?.id,
    };
    axios
      .post("/fees-pdf-create", body)
      .then((res) => {
        if (res?.data?.status) {
          toast.success(res?.data?.message);
          const url = res?.data?.result;
          window.open(url, "_blank");
          setLoading(false);
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  };
  const handleInput = (e) => {
    const { name, value } = e.target;
    setSearch((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleExport = () => {
    if (data.length === 0) {
      toast.error("No data available to export");
      return;
    }
    // Define a mapping for custom headers
    const customHeaders = [
      { key: "user_details.name", header: "Student Name" }, // Extract 'name' from user_details
      { key: "course_details.name", header: "Course Name" },
      { key: "total_amount", header: "Course Fess" },
      { key: "discount_amount", header: "Discount Amount" },
      { key: "actual_amount", header: "Actual Amount" },
      { key: "pay_amount", header: "Pay Amount" },
      { key: "duo_amount", header: "Duo Amount" },
      { key: "payment_mode", header: "Payment Mode" },
      { key: "download_time", header: "Download Time" },
      { key: "created_at", header: "Created Date" },
    ];

    // Format the data with custom headers, including nested objects
    const formattedData = data.map((item) =>
      customHeaders.reduce((acc, { key, header }) => {
        // Handle nested object keys like 'user_details.name'
        const keys = key.split(".");
        const value = keys.reduce(
          (nestedObj, k) => (nestedObj ? nestedObj[k] : ""),
          item
        );
        acc[header] = value; // Map the value to the custom header
        return acc;
      }, {})
    );

    // Convert formatted data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "student fess data");

    // Write the workbook to a binary array
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Convert the binary array to a Blob and save it
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "fess.xlsx");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const body = {
      page: page,
      limit: limit,
      search: search?.term?.trim(), // Assuming you have a single input field bound to search.term
      start_date: search?.start_date,
      end_date: search?.end_date,
      course_id: search?.course,
    };
    axios
      .post("/get-laser", body)
      .then((res) => {
        if (res?.data?.status) {
          setData(res?.data?.result?.legacyList);
          setTotalPages(res?.data?.result?.totalPages);

          setTotalCount(res?.data?.result?.totalCount);
          removeItem("edit_fees_id");
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
      // Default value for end date
    });
    const body = {
      page: page,
      limit: limit,
    };
    axios
      .post("/get-laser", body)
      .then((res) => {
        if (res?.data?.status) {
          setData(res?.data?.result?.legacyList);
          setTotalCount(res?.data?.result?.totalCount);
          removeItem("edit_fees_id");
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  };
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

  return (
    <>
      <Layout>
        <div className="emp_dash">
          <div className="search_show_entries display justify-content-between mt-4">
            <div className=" display ps-4">
              <h4 className="pb-3">Fees Management</h4>
            </div>
            <div></div>
            <div className="apply_application">
              <button onClick={handleExport} className="btn comman_btn me-2">
                <i class="fa fa-download" aria-hidden="true mr-2">
                  {" "}
                </i>{" "}
                Export Excel
              </button>
              <Link href="fees-add" className="btn comman_btn">
                <i className="fa fa-plus me-2" />
                Add Fees
              </Link>
            </div>
          </div>
          <div className="row g-3 g-xl-5 g-xxl-5">
            <div className="col-sm-3 ">
              <div
                className="card text-white bg-primary mb-3"
                style={{ borderRadius: "10px", padding: "14px" }}
              >
                <div className="row">
                  <div className="col-8">
                    <div className="ps-4 pt-4 pe-3 pb-3">
                      <div className="">
                        <h6 className="mb-2 tx-12 text-white">
                          Total Actual Amount{" "}
                        </h6>
                      </div>
                      <div className="pb-0 mt-0 ">
                        <div className="d-flex">
                          <h4 className="tx-20 font-weight-semibold mb-2 text-white">
                            {totalActualAmount
                              ? MoneyFormat(totalActualAmount)
                              : 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 576 512"
                        fill="white"
                      >
                        <path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-3 ">
              <div
                className="card text-white bg-success mb-4"
                style={{ borderRadius: "10px", padding: "14px" }}
              >
                <div className="row">
                  <div className="col-8">
                    <div className="ps-4 pt-4 pe-3 pb-4">
                      <div>
                        <h6 className="mb-2 tx-12 text-white">
                          Total Received Amount{" "}
                        </h6>
                      </div>
                      <div className="pb-0 mt-0">
                        <div className="d-flex">
                          <h4 className="tx-20 font-weight-semibold mb-2 text-white">
                            {totalPaidAmount ? MoneyFormat(totalPaidAmount) : 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 576 512"
                        fill="white"
                      >
                        <path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-3">
              <div
                class="card text-white bg-info mb-4"
                style={{ borderRadius: "10px", padding: "14px" }}
              >
                <div class="row">
                  <div class="col-8">
                    <div class="ps-4 pt-4 pe-3 pb-4">
                      <div class="">
                        <h6 class="mb-2 tx-12 text-white">
                          {" "}
                          Total Pending Amount{" "}
                        </h6>
                      </div>
                      <div class="pb-0 mt-0">
                        <div class="d-flex">
                          <h4 class="tx-20 font-weight-semibold mb-2 text-white">
                            {MoneyFormat(totalDueAmount)}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 576 512"
                        fill="white"
                      >
                        <path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-3 ">
              <div
                className="card text-white bg-success mb-4"
                style={{ borderRadius: "10px", padding: "14px" }}
              >
                <div className="row">
                  <div className="col-8">
                    <div className="ps-4 pt-4 pe-3 pb-4">
                      <div>
                        <h6 className="mb-2 tx-12 text-white">
                          Current Month Fees Collection{" "}
                        </h6>
                      </div>
                      <div className="pb-0 mt-0">
                        <div className="d-flex">
                          <h4 className="tx-20 font-weight-semibold mb-2 text-white">
                            {currentAmount ? MoneyFormat(currentAmount) : 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 576 512"
                        fill="white"
                      >
                        <path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                      placeholder="Enter Student Name/Email/ Mobile..."
                      onChange={handleInput}
                      value={search.term}
                      name="term"
                    />
                  </div>
                  <div className="col-sm-3 col-md-3">
                    <label htmlFor="course" className="form-label">
                      Course
                    </label>
                    <select
                      className="form-select form-control"
                      name="course"
                      id="course"
                      onChange={handleInput}
                    >
                      <option value="" label="Select course" />
                      {course.map((res, i) => (
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

                  <div className="col-sm-3 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
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
                  <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
                    <div className="btn_block mt-4 d-flex">
                      <button
                        type="submit"
                        className="Submit_btn btn comman_btn me-3 "
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

          <div className="punch_table table-responsive mt-4 pt-3">
            <table className="table">
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>Receipt No</th>
                  <th>Student Name</th>
                  <th>Student Email</th>
                  <th>Course Name</th>
                  <th>Course Duration</th>
                  <th>Course Fess</th>
                  <th>Discount</th>
                  <th>Actual Amount</th>
                  <th>Total Paid Amount</th>
                  <th>Due Amount</th>

                  <th>Deposit Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((res, i) => (
                  <tr key={i}>
                    <td>{(page - 1) * limit + (i + 1)}</td>
                    <td>{res.id}</td>
                    {/* Adjust S.NO based on the page */}
                    <td>{res?.user_details?.name}</td>
                    <td>{res?.user_details?.email}</td>
                    <td>{res?.course_details?.name}</td>
                    <td>{res?.course_details?.duration}</td>
                    <td>{MoneyFormat(res?.total_amount)}</td>
                    <td>{MoneyFormat(res?.discount_amount)}</td>
                    <td>{MoneyFormat(res?.actual_amount)}</td>
                    <td>{MoneyFormat(res?.pay_amount)}</td>
                    <td>{MoneyFormat(res?.duo_amount)}</td>
                    <td>
                      {res?.deposit_date ? (
                        <Moment format="DD/MM/YYYY">{res?.deposit_date}</Moment>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td class="display">
                      {loading===res.id ? (
                        <span>
                          {" "}
                          <a class="view_btn display me-2">
                            <i class="fas fa-spinner"></i>
                          </a>
                        </span>
                      ) : (
                        <span>
                          {" "}
                          <a
                            class="view_btn display me-2"
                            onClick={() => handleDownloadPdf(res)}
                          >
                            <i class="fas fa-download"></i>
                          </a>
                        </span>
                      )}
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
                ))}
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
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
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
      </Layout>
    </>
  );
}

export default Legacy;
