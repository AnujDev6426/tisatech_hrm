import React, { useEffect, useState } from "react";
import Sidebar from "./layout/sidebar";
import Header from "./layout/header";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAxiosInstances from "@/config/AxiosConfig";
import { catchResponse } from "@/utils/Helper";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Layout from "./layout/layout";

function Branchadd() {
  const navigate = useRouter();
  const { axios } = useAxiosInstances();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      branch_collection: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
      address: Yup.string().required("Address is required"),
      branch_collection: Yup.string().required("Branch collection is required"),
    }),
    onSubmit: (values) => {
      const body = {
        ...values,
        action: "create",
      };
      axios
        .post("/add-branch", body)
        .then((res) => {
          if (res?.data?.status) {
            toast.success(res?.data?.message);
            setTimeout(() => {
              navigate.push("/branch");
            }, 1000);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          catchResponse(err);
        });
    },
  });
  return (
    <Layout>
      <div class="emp_dash">
        <div class="page_manus">
          <ul class="text-center mb-2">
            <li class="nav-item">
              <a href="index.html" class="deactive-link">
                Dashboard
              </a>{" "}
              <span class="active-link">/ Reports</span>
            </li>
          </ul>
          <div class="page_heading display">
            <h4 class="pb-3">Add Branch</h4>
          </div>
        </div>

        <div class="apply_application_main mt-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-3 g-xl-5 g-xxl-5">
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.name && formik.errors.name
                      ? "is-invalid"
                      : ""
                  }`}
                  id="name"
                  placeholder="Enter name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="invalid-feedback">{formik.errors.name}</div>
                ) : null}
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control ${
                    formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  id="email"
                  placeholder="Enter email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="invalid-feedback">{formik.errors.email}</div>
                ) : null}
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className={`form-control ${
                    formik.touched.password && formik.errors.password
                      ? "is-invalid"
                      : ""
                  }`}
                  id="password"
                  placeholder="Enter password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="invalid-feedback">
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.address && formik.errors.address
                      ? "is-invalid"
                      : ""
                  }`}
                  id="address"
                  placeholder="Enter address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                />
                {formik.touched.address && formik.errors.address ? (
                  <div className="invalid-feedback">
                    {formik.errors.address}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="branch_collection" className="form-label">
                  Branch Collection
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.branch_collection &&
                    formik.errors.branch_collection
                      ? "is-invalid"
                      : ""
                  }`}
                  id="branch_collection"
                  placeholder="Enter branch collection"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.branch_collection}
                />
                {formik.touched.branch_collection &&
                formik.errors.branch_collection ? (
                  <div className="invalid-feedback">
                    {formik.errors.branch_collection}
                  </div>
                ) : null}
              </div>

              <div className="col-lg-12">
                <div className="btn_block">
                  <button
                    type="button"
                    className="cancel-btn btn me-3"
                    onClick={() => formik.resetForm()}
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

export default Branchadd;
