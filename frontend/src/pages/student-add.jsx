import React, { useEffect, useState } from "react";
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
  const [branchlist, setBranchlist] = useState([]);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      reference_code: "",
      father_name: "",
      father_mobile: "",
      address: "",
      dob: "",
      branch: "1",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      mobile: Yup.string().required("Mobile number is required"),
      reference_code: Yup.string().optional(),
      father_name: Yup.string().required("Father name is required"),
      father_mobile: Yup.string().required("Father mobile is required"),
      address: Yup.string().required("Address is required"),
      dob: Yup.date().required("Date of birth is required").nullable(),
      branch: Yup.string().required("Branch is required"),
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
          .post("add-student", Updatebody)
          .then((res) => {
            console.log(res);
            if (res?.data?.status) {
              toast.success(res?.data?.message);
              setTimeout(() => {
                navigate.push("/student");
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
          .post("add-student", body)
          .then((res) => {
            if (res?.data?.status) {
              toast.success(res?.data?.message);
              setTimeout(() => {
                navigate.push("/student");
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
        .post("/student-details", body)
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
              "reference_code",
              res?.data?.result?.reference_code
                ? res?.data?.result?.reference_code
                : ""
            );
            formik.setFieldValue(
              "branch_id",
              res?.data?.result?.branch_id ? res?.data?.result?.branch_id : ""
            );
            formik.setFieldValue(
              "dob",
              res?.data?.result?.dob ? res?.data?.result?.dob : ""
            );
            formik.setFieldValue(
              "address",
              res?.data?.result?.address ? res?.data?.result?.address : ""
            );
            formik.setFieldValue(
              "father_mobile",
              res?.data?.result?.father_mobile
                ? res?.data?.result?.father_mobile
                : ""
            );
            formik.setFieldValue(
              "father_name",
              res?.data?.result?.father_name
                ? res?.data?.result?.father_name
                : ""
            );
            formik.setFieldValue(
              "branch",
              res?.data?.result?.branch_id ? res?.data?.result?.branch_id : ""
            );
          }
        })
        .catch((err) => {
          catchResponse(err);
        });
    }
  }, [user_id]);

  useEffect(() => {
    const body = {
      page: "1",
      limit: "100",
    };
    axios
      .post("get-branch", body)
      .then((res) => {
        setBranchlist(res?.data?.result?.BranchList);
      })
      .catch((err) => {
        catchResponse(err);
      });
  }, []);

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
            <h4 className="pb-3"> Add Student</h4>
          </div>
        </div>
        <div className="search_show_entries display justify-content-center mt-4"></div>
        <div className="apply_application_main mt-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-3 g-xl-5 g-xxl-5">
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3 leave_type">
                <label htmlFor="branch" className="form-label">
                  Branch
                </label>
                <select
                  className="form-select form-control p-4 pt-0 pb-0"
                  id="branch"
                  {...formik.getFieldProps("branch")}
                >
                  <option value="" selected>
                    Select branch
                  </option>
                  {branchlist?.map((res, i) => (
                    <option value={res?.id} label={res?.name} />
                  ))}
                </select>
                {formik.touched.branch && formik.errors.branch ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.branch}
                  </div>
                ) : null}
              </div>
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
                />
                {formik.touched.mobile && formik.errors.mobile ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.mobile}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="reference_code" className="form-label">
                  Reference Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="reference_code"
                  placeholder="Enter reference code"
                  {...formik.getFieldProps("reference_code")}
                />
                {formik.touched.reference_code &&
                formik.errors.reference_code ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.reference_code}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="father_name" className="form-label">
                  Father Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="father_name"
                  placeholder="Enter father name"
                  {...formik.getFieldProps("father_name")}
                />
                {formik.touched.father_name && formik.errors.father_name ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.father_name}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="father_mobile" className="form-label">
                  Father Mobile
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="father_mobile"
                  placeholder="Enter father mobile"
                  {...formik.getFieldProps("father_mobile")}
                />
                {formik.touched.father_mobile && formik.errors.father_mobile ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.father_mobile}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  placeholder="Enter address"
                  {...formik.getFieldProps("address")}
                />
                {formik.touched.address && formik.errors.address ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.address}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="dob" className="form-label">
                  DOB
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="dob"
                  {...formik.getFieldProps("dob")}
                />
                {formik.touched.dob && formik.errors.dob ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.dob}
                  </div>
                ) : null}
              </div>
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
