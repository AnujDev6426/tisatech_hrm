import React, { useEffect, useState } from "react";
import Sidebar from "./layout/sidebar";
import Header from "./layout/header";
import Link from "next/link";
import useAxiosInstances from "@/config/AxiosConfig";
import { catchResponse } from "@/utils/Helper";
import Layout from "./layout/layout";

function Assign() {
  const { axios } = useAxiosInstances();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .post("get-assignCourse")
      .then((res) => {
        if (res?.data?.status) {
          setData(res?.data?.result);
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  }, []);

  console.log(data);

  return (
    <Layout>
      <div className="emp_dash">
        <div className="page_manus">
          <ul className="text-center mb-2">
            <li className="nav-item">
              <a href="index.html" className="deactive-link">
                Dashboard
              </a>{" "}
              <span className="active-link">/ Reports</span>
            </li>
          </ul>
          <div className="page_heading display">
            <h4 className="pb-3">Assign Management</h4>
          </div>
        </div>
        <div className="search_show_entries display justify-content-between mt-4">
          <div className="show_entries display ps-4">
            <span className="pe-3">Show Entries</span>
            <a href="#" className="p-2 m-2">
              <i className="fa fa-minus" />
            </a>{" "}
            <span className="entries">10</span>
            <a href="#" className="p-2 m-2">
              <i className="fa fa-plus" />
            </a>
          </div>
          <div className="leave_detail  position-relative W-100 display justify-content-between p-4 pt-2 pb-2">
            <div className="available pe-5 display justify-content-between">
              <span className="available-bg display me-2">02</span>
              <span>Available</span>
            </div>
            <div className="seperator" />
            <div className="taken  display justify-content-between ps-5">
              <span className="taken-bg display me-2">00</span>
              <span>taken</span>
            </div>
          </div>
          <div className="apply_application">
            <Link href="/Assign-add" className="btn comman_btn">
              <i className="fa fa-plus me-2" />
              Add Assign
            </Link>
          </div>
        </div>
        <div className="punch_table table-responsive mt-4 pt-3">
          <table className="table">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>Student Name</th>
                <th>Student Email</th>
                <th>Course Name</th>
                <th>Course Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0
                ? data?.map((res, i) => (
                    <tr>
                      <td>{i + 1}</td>
                      <td>{res?.user_details?.name}</td>
                      <td>{res?.user_details?.email}</td>
                      <td>{res?.course_details?.name}</td>
                      <td>{res?.course_details?.duration}</td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={res?.status == "1" ? true : false}
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default Assign;
