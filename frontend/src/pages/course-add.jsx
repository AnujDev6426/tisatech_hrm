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

function Courseadd() {
  const navigate = useRouter();
  const { axios } = useAxiosInstances();
  const course_id = getItem("edit_course_id");
  const formik = useFormik({
    initialValues: {
      name: "",
      fees: "",
      duration: "",
      description: "",
      seo_title: "",
      seo_keyword: "",
      seo_desc: "",
      sort_name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      fees: Yup.string().required("fees number is required"),
      duration: Yup.string().required("duration is required"),
      description: Yup.string().required("description is required"),
      seo_title: Yup.string().required("Seo title mobile is required"),
      seo_keyword: Yup.string().required("Seo keyword is required"),
      seo_desc: Yup.string().required("Seo desc is required"),
      sort_name: Yup.string().required("sort name is required"),
    }),
    onSubmit: (values) => {
      if (course_id) {
        const body = {
          ...values,
          action: "modified",
          course_id: course_id,
        };
        axios
          .post("add-course", body)
          .then((res) => {
            if (res?.data?.status) {
              toast.success(res?.data?.message);
              setTimeout(() => {
                navigate.push("/course");
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
        };

        // console.log("--------------",body)

        // return false
        axios
          .post("add-course", body)
          .then((res) => {
            if (res?.data?.status) {
              toast.success(res?.data?.message);
              setTimeout(() => {
                navigate.push("/course");
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
    if (course_id) {
      const body = {
        course_id: course_id,
      };
      axios
        .post("/course-details", body)
        .then((res) => {
          if (res?.data?.status) {
            formik.setFieldValue(
              "name",
              res?.data?.result?.name ? res?.data?.result?.name : ""
            );
            formik.setFieldValue(
              "fees",
              res?.data?.result?.fees ? res?.data?.result.fees : ""
            );
            formik.setFieldValue(
              "duration",
              res?.data?.result?.duration ? res?.data?.result?.duration : ""
            );
            formik.setFieldValue(
              "description",
              res?.data?.result?.description
                ? res?.data?.result?.description
                : ""
            );
            formik.setFieldValue(
              "seo_title",
              res?.data?.result?.seo_title ? res?.data?.result?.seo_title : ""
            );
            formik.setFieldValue(
              "seo_keyword",
              res?.data?.result?.seo_keyword
                ? res?.data?.result?.seo_keyword
                : ""
            );
            formik.setFieldValue(
              "seo_desc",
              res?.data?.result?.seo_desc ? res?.data?.result?.seo_desc : ""
            );
            formik.setFieldValue(
              "sort_name",
              res?.data?.result?.sort_name ? res?.data?.result?.sort_name : ""
            );
          }
        })
        .catch((err) => {
          catchResponse(err);
        });
    }
  }, [course_id]);

  return (
    <Layout>
      <div className="emp_dash">
        <div className="page_manus">
          <div className="page_heading display">
            <h4 className="pb-3">Add Course</h4>
          </div>
        </div>

        <div className="apply_application_main mt-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-3 g-xl-5 g-xxl-5">
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 ">
                <label for="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter name "
                  {...formik.getFieldProps("name")}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 ">
                <label for="sort_name" className="form-label">
                  Sort Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="sort_name"
                  placeholder="Enter Course Sort name"
                  {...formik.getFieldProps("sort_name")}
                />
                {formik.touched.sort_name && formik.errors.sort_name ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.sort_name}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 ">
                <label for="name" className="form-label">
                  Fees
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fees"
                  placeholder="Enter fees"
                  {...formik.getFieldProps("fees")}
                />
                {formik.touched.fees && formik.errors.fees ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.fees}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 ">
                <label for="name" className="form-label">
                  Duration
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="duration"
                  placeholder="Enter duration "
                  {...formik.getFieldProps("duration")}
                />
                {formik.touched.duration && formik.errors.duration ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.duration}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 ">
                <label for="name" className="form-label">
                  Description
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  placeholder="Enter description"
                  {...formik.getFieldProps("description")}
                />
                {formik.touched.description && formik.errors.description ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.description}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 ">
                <label for="name" className="form-label">
                  Seo Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="seo_title"
                  placeholder="Enter seo title "
                  {...formik.getFieldProps("seo_title")}
                />
                {formik.touched.seo_title && formik.errors.seo_title ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.seo_title}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 ">
                <label for="name" className="form-label">
                  Seo keyword
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="seo_keyword"
                  placeholder="Enter seo keyword "
                  {...formik.getFieldProps("seo_keyword")}
                />
                {formik.touched.seo_keyword && formik.errors.seo_keyword ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.seo_keyword}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 ">
                <label for="name" className="form-label">
                  Seo desc
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="seo_desc"
                  placeholder="Enter seo desc"
                  {...formik.getFieldProps("seo_desc")}
                />
                {formik.touched.seo_desc && formik.errors.seo_desc ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.seo_desc}
                  </div>
                ) : null}
              </div>
              <div className="col-lg-12">
                <div className="btn_block ">
                  <button
                    type="button"
                    className="cancel-btn btn me-3"
                    onClick={() => navigate.push("/course")}
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

export default Courseadd;
