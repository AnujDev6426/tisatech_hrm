import React, { useEffect, useState } from "react";
import Sidebar from "./layout/sidebar";
import Header from "./layout/header";
import Link from "next/link";
import useAxiosInstances from "@/config/AxiosConfig";
import { catchResponse, MoneyFormat } from "@/utils/Helper";
import Layout from "./layout/layout";
function Branch() {
  const { axios } = useAxiosInstances();
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20); // Default to 10 per page

  // Fetch data based on current page and limit
  useEffect(() => {
    const body = {
      page: page,
      limit: limit,
    };
    axios
      .post("get-branch", body)
      .then((res) => {
        if (res?.data?.status) {
          setTotalPages(res?.data?.result?.totalPages);
          setData(res?.data?.result?.BranchList);
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  }, [page, limit]);

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

  return (
    <>
      <Layout>
        <div className="emp_dash">
          <div className="page_manus">{/* Your page menu components */}</div>
          <div className="search_show_entries display justify-content-between mt-4">
            <div className="page_heading display">
              <h4 className="pb-3">Branch Management</h4>
            </div>
            <div className="apply_application">
              <Link href="/branch-add" className="btn comman_btn">
                <i className="fa fa-plus me-2" />
                Add Branch
              </Link>
            </div>
          </div>
          <div className="punch_table table-responsive mt-4 pt-3">
            <table className="table">
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>Branch Name</th>
                  <th>Branch Email</th>
                  <th>Branch Address </th>
                  <th>Branch Collection</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0
                  ? data.map((res, i) => (
                      <tr key={i}>
                        <td>{(page - 1) * limit + (i + 1)}</td>{" "}
                        {/* Adjust S.NO based on the page */}
                        <td>{res?.name}</td>
                        <td>{res?.email}</td>
                        <td>{res?.address}</td>
                        <td>{MoneyFormat(res?.branch_collection)}</td>
                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={res?.status === "Y"}
                            />
                            <span className="slider round"></span>
                          </label>
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

export default Branch;
