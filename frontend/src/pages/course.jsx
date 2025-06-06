import React, { useEffect, useState, useMemo } from "react";
import Layout from "./layout/layout";

import useAxiosInstances from "@/config/AxiosConfig";
import {
  catchResponse,
  MoneyFormat,
  removeItem,
  setItem,
} from "@/utils/Helper";
import Link from "next/link";
import { useRouter } from "next/router";

function Course() {
  const { axios } = useAxiosInstances();
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20); // Default to 10 per page

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

  const navigate = useRouter();
  useEffect(() => {
    removeItem("edit_course_id");

    const body = {
      page: page,
      limit: limit,
    };
    axios
      .post("view-course", body)
      .then((res) => {
        console.log(res);
        if (res?.data?.status) {
          setTotalPages(res?.data?.result?.totalPages);
          setData(res?.data?.result?.courseList);
          setTotalCount(res?.data?.result?.totalCount);
          removeItem("edit_course_id");
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  }, [page, limit]);

  const handelNavigateUpdate = (e) => {
    setItem("edit_course_id", e);
    navigate.push("/course-add");
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
          </div>
          <div className="search_show_entries display justify-content-between mt-4">
            <div className="page_heading display">
              <h4 className="pb-3">Course Management</h4>
            </div>
            <div className="show_entries display ps-4">
              {/* <span className="pe-3">Show Entries</span>
          <a href="#" className="p-2 m-2"><i className="fa fa-minus" /></a> <span className="entries">10</span>
          <a href="#" className="p-2 m-2"><i className="fa fa-plus" /></a> */}
            </div>
            {/* <div className="leave_detail  position-relative W-100 display justify-content-between p-4 pt-2 pb-2">
          <div className="available pe-5 display justify-content-between">
            <span className="available-bg display me-2">{data?.length}</span><span>Active Course</span>
          </div>
          <div className="seperator" />
          <div className="taken  display justify-content-between ps-5">
            <span className="taken-bg display me-2">00</span><span>Inactive Course</span>
          </div>
        </div> */}
            <div className="apply_application">
              <Link href="/course-add" className="btn comman_btn">
                <i className="fa fa-plus me-2" />
                Add Course
              </Link>
            </div>
          </div>
          <div className="punch_table table-responsive mt-4 pt-3">
            <table className="table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Course Name</th>
                  <th>Duration</th>
                  <th>Fees</th>
                  <th>Approval Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0
                  ? data.map((res, i) => (
                      <tr>
                        <td>{(page - 1) * limit + (i + 1)}</td>
                        <td>{res?.name}</td>
                        <td>{res?.duration}</td>
                        <td>{MoneyFormat(res?.fees)}</td>
                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={res?.status == "Y" ? true : false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </td>
                        <td class="display">
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

            {/* Pagination Controls */}
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

export default Course;
