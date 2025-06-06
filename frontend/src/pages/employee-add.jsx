import React, { useEffect } from "react";
import Sidebar from "./layout/sidebar";
import Header from "./layout/header";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAxiosInstances from "@/config/AxiosConfig";
import { catchResponse, getItem } from "@/utils/Helper";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import Layout from "./layout/layout";

function StudentAdd() {
  const { axios } = useAxiosInstances();
  const user_id = getItem("edit_user_id");
  const navigate = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      salary: "",
      designation: "",
      join_date: new Date().toISOString().split("T")[0], // Set default to today's date
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      mobile: Yup.string().required("Mobile number is required"),
      salary: Yup.string().required("Salary is required"),
      designation: Yup.string().required("Designation  is required"),
      join_date: Yup.date()
        .required("Join Date of birth is required")
        .nullable(),
    }),
    onSubmit: (values) => {
      if (user_id) {
        const Updatebody = {
          ...values,
          action: "modified",
          username: values.name,
          password: "2375037784abda8f568ce1369d67b8ad",
          branch_id: values.branch,
          user_id: user_id,
        };
        axios
          .post("add-employee", Updatebody)
          .then((res) => {
            console.log(res);
            if (res?.data?.status) {
              toast.success(res?.data?.message);
              setTimeout(() => {
                navigate.push("/employee");
              }, 1000);
            } else {
              toast.error(res?.data?.message);
            }
          })
          .catch((err) => {
            console.log(err);
            catchResponse(err);
          });
      } else {
        const body = {
          ...values,
          action: "create",
          username: values.name,
          password: "2375037784abda8f568ce1369d67b8ad",
          branch_id: values.branch,
        };
        axios
          .post("/add-employee", body)
          .then((res) => {
            console.log(res);
            if (res?.data?.status) {
              toast.success(res?.data?.message);
              setTimeout(() => {
                navigate.push("/employee");
              }, 1000);
            } else {
              toast.error(res?.data?.message);
            }
          })
          .catch((err) => {
            console.log(err);
            catchResponse(err);
          });
      }
    },
  });

  return (
    <Layout>
      <div className="emp_dash">
        <div className="page_manus">
          <div className="page_heading display">
            <h4 className="pb-3"> Add Employee</h4>
          </div>
        </div>
        <div className="search_show_entries display justify-content-center mt-4"></div>
        <div className="apply_application_main mt-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-3 g-xl-5 g-xxl-5">
              {/* <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3 leave_type">
          <label htmlFor="branch" className="form-label">Branch</label>
          <select
            className="form-select form-control p-4 pt-0 pb-0"
            id="branch"
            {...formik.getFieldProps('branch')}
          >
            <option value="1" selected label="Tisa" />
          </select>
          {formik.touched.branch && formik.errors.branch ? (
            <div className="error" style={{ color: 'red' }}>{formik.errors.branch}</div>
          ) : null}
        </div> */}
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter name"
                  {...formik.getFieldProps("name")}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="mobile" className="form-label">
                  Mobile
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="mobile"
                  placeholder="Enter mobile"
                  {...formik.getFieldProps("mobile")}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Removes non-numeric characters
                  }}
                />
                {formik.touched.mobile && formik.errors.mobile ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.mobile}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="designation" className="form-label">
                  Designation
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="Designation"
                  placeholder="Enter Designation"
                  {...formik.getFieldProps("designation")}
                />
                {formik.touched.designation && formik.errors.designation ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.designation}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="salary" className="form-label">
                  Salary
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="salary"
                  placeholder="Enter Salary"
                  {...formik.getFieldProps("salary")}
                  onKeyPress={(e) => {
                    if (!/^\d*$/.test(e.key)) {
                      e.preventDefault(); // Prevents non-numeric input
                    }
                  }}
                  onInput={(e) => {
                    if (e.target.value.length > 0) {
                      e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Removes non-numeric characters
                    }
                  }}
                />
                {formik.touched.salary && formik.errors.salary ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.salary}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="join_date" className="form-label">
                  Join Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="join_date"
                  value={formik.values.join_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.join_date && formik.errors.join_date ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.join_date}
                  </div>
                ) : null}
              </div>
              {/* <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
          <label htmlFor="father_mobile" className="form-label">Father Mobile</label>
          <input
            type="text"
            className="form-control"
            id="father_mobile"
            placeholder="Enter father mobile"
            {...formik.getFieldProps('father_mobile')}
          />
          {formik.touched.father_mobile && formik.errors.father_mobile ? (
            <div className="error" style={{ color: 'red' }}>{formik.errors.father_mobile}</div>
          ) : null}
        </div>
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            placeholder="Enter address"
            {...formik.getFieldProps('address')}
          />
          {formik.touched.address && formik.errors.address ? (
            <div className="error" style={{ color: 'red' }}>{formik.errors.address}</div>
          ) : null}
        </div>
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
          <label htmlFor="dob" className="form-label">DOB</label>
          <input
            type="date"
            className="form-control"
            id="dob"
            {...formik.getFieldProps('dob')}
          />
          {formik.touched.dob && formik.errors.dob ? (
            <div className="error" style={{ color: 'red' }}>{formik.errors.dob}</div>
          ) : null}
        </div> */}
              <div className="col-lg-12">
                <div className="btn_block">
                  <button
                    type="button"
                    className="cancel-btn btn me-3"
                    onClick={() => navigate.push("/student")}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="Submit_btn btn comman_btn">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default StudentAdd;
