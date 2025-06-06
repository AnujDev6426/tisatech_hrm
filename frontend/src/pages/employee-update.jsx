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
      join_date: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      mobile: Yup.string().required("Mobile number is required"),
      salary: Yup.string().required("Salary is required"),
      designation: Yup.string().required("Designation  is required"),
      join_date: Yup.date().required("Join Date is required").nullable(),
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
          action: "modified",
          username: values.name,
          password: "2375037784abda8f568ce1369d67b8ad",
          branch_id: values.branch,
        };
        axios
          .post("/add-employee", body)
          .then((res) => {
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

  useEffect(() => {
    if (user_id) {
      const body = {
        id: user_id,
      };
      axios
        .post("/get-employeedetails", body)
        .then((res) => {
          if (res?.data?.status) {
            formik.setFieldValue(
              "name",
              res?.data?.result?.name ? res?.data?.result?.name : ""
            );
            formik.setFieldValue(
              "email",
              res?.data?.result?.email ? res?.data?.result?.email : ""
            );
            formik.setFieldValue(
              "mobile",
              res?.data?.result?.mobile ? res?.data?.result?.mobile : ""
            );
            formik.setFieldValue(
              "salary",
              res?.data?.result?.salary ? res?.data?.result?.salary : ""
            );
            formik.setFieldValue(
              "designation",
              res?.data?.result?.designation
                ? res?.data?.result?.designation
                : ""
            );
            formik.setFieldValue(
              "join_date",
              res?.data?.result?.join_date ? res?.data?.result?.join_date : ""
            );
          }
        })
        .catch((err) => {
          catchResponse(err);
        });
    }
  }, [user_id]);
  return (
    <Layout>
      <div className="emp_dash">
        <div className="page_manus">
          <div className="page_heading display">
            <h4 className="pb-3"> Update Employee</h4>
          </div>
        </div>
        <div className="search_show_entries display justify-content-center mt-4"></div>
        <div className="apply_application_main mt-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-3 g-xl-5 g-xxl-5">
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
                  {...formik.getFieldProps("join_date")}
                />
                {formik.touched.join_date && formik.errors.join_date ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.join_date}
                  </div>
                ) : null}
              </div>
              <div className="col-lg-12">
                <div className="btn_block">
                  <button
                    type="button"
                    className="cancel-btn btn me-3"
                    onClick={() => navigate.push("/employee")}
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
