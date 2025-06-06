import React from "react";
import Sidebar from "../layout/sidebar";
import Header from "../layout/header";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import useAxiosInstances from "@/config/AxiosConfig";
import { catchResponse, getItem } from "@/utils/Helper";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Select from "react-select";

import Layout from "../layout/layout";

function BatchEdit() {
  const [branch, setBranch] = useState([]);
  const [course, setCourse] = useState([]);
  const [courseDetails, setCourseDetails] = useState({});
  const [student, setStudent] = useState([]);
  const [feesdata, setFeesData] = useState({});
  const { axios } = useAxiosInstances();
  const batch_id = getItem("batch_id");
  const [employeeData, setEmployeeData] = useState([]);

  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    //  to get branch
    const body = {
      page: 1,
      limit: 50,
    };
    axios
      .post("getLegacyBranch")
      .then((res) => {
        if (res.data.status) {
          setBranch(res?.data?.result);
        }
      })
      .catch((err) => {
        catchResponse(err);
      });

    // to get student
    axios
      .post("getLegacyStudent")
      .then((res) => {
        if (res.data.status) {
          setStudent(res?.data?.result);
        }
      })
      .catch((err) => {
        catchResponse(err);
      });

    // to facth employee list
    axios
      .post("/view-employee", body)
      .then((res) => {
        if (res?.data?.status) {
          setEmployeeData(res?.data?.result?.UserList);
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      branch: "1",
      batch_code: "",
      course: "",
      faculty: "",
      // student: "",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
    },
    validationSchema: Yup.object({
      branch: Yup.string().required("Branch is required"),
      course: Yup.string().required("Course is required"),
      batch_code: Yup.string().required("Batch Code is required"),
      // student: Yup.string().required("Student is required"),
      start_date: Yup.string().required("Start date is required"),
      end_date: Yup.string().required("End date is required"),
      start_time: Yup.string().required("Time start is required"),
      end_time: Yup.string().required("Time end is required"),
      faculty: Yup.string().required("Faculty is required"),
    }),
    onSubmit: (values) => {
      setLoading(true); // Show loader
      const body = {
        branch_id: values?.branch,
        course_id: values?.course,
        batch_code: values?.batch_code,
        start_date: values?.start_date,
        end_date: values?.end_date,
        start_time: values?.start_time,
        end_time: values?.end_time,
        faculty: values?.faculty,
        batch_id: batch_id,
        action: "modified",
      };

      axios
        .post("/add-batch", body)
        .then((res) => {
          setLoading(false); // Hide loader
          if (res?.data?.status) {
            toast.success(res?.data?.message);
            setTimeout(() => {
              window.location.href = "/batch";
            }, 1000);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          setLoading(false); // Hide loader
          catchResponse(err);
        });
    },
  });

  // View - Student details
  // const batch_id= 8
  useEffect(() => {
    if (batch_id) {
      const body = {
        id: batch_id,
      };
      axios
        .post("/batch-detail", body)
        .then((res) => {
          // console.log("---------------",res?.data?.result)
          if (res?.data?.status) {
            formik.setFieldValue(
              "batch_code",
              res?.data?.result?.batch_code ? res?.data?.result?.batch_code : ""
            );
            formik.setFieldValue(
              "course",
              res?.data?.result?.course_id ? res?.data?.result?.course_id : ""
            );
            formik.setFieldValue(
              "end_time",
              res?.data?.result?.end_time ? res?.data?.result?.end_time : ""
            );
            formik.setFieldValue(
              "start_time",
              res?.data?.result?.start_time ? res?.data?.result?.start_time : ""
            );
            formik.setFieldValue(
              "branch",
              res?.data?.result?.branch_id ? res?.data?.result?.branch_id : ""
            );
            formik.setFieldValue(
              "faculty",
              res?.data?.result?.faculty ? res?.data?.result?.faculty : ""
            );
          }
        })
        .catch((err) => {
          catchResponse(err);
        });
    }
  }, [batch_id]);

  useEffect(() => {
    const body = {
      page: 1,
      limit: 50,
    };
    axios
      .post("view-course", body)
      .then((res) => {
        if (res.data.status) {
          setCourse(res?.data?.result?.courseList);
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  }, []);

  useEffect(() => {
    if (formik?.values?.course) {
      const selectCourserDetails = course.filter(
        (res) => res.id == formik?.values?.course
      );
      setCourseDetails(...selectCourserDetails);
      if (feesdata?.duo_amount) {
        formik.setValues({
          ...formik.values, // Keep the current values
          total_amount: selectCourserDetails[0]?.fees,
          actual_amount: selectCourserDetails[0]?.fees,
        });
      } else {
        formik.setValues({
          ...formik.values, // Keep the current values
          total_amount: selectCourserDetails[0]?.fees,
          actual_amount: selectCourserDetails[0]?.fees,
          duo_amount: selectCourserDetails[0]?.fees,
        });
        // Automatically calculate the batch end date
        if (formik?.values?.start_date || courseDetails?.duration) {
          const startDate = new Date(); // Current date
          const endDate = new Date(startDate);
          endDate.setMonth(
            endDate.getMonth() + parseInt(courseDetails.duration)
          );
          formik.setFieldValue(
            "start_date",
            startDate.toISOString().split("T")[0]
          ); // Format as YYYY-MM-DD
          formik.setFieldValue("end_date", endDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
        }
      }
    }
  }, [formik?.values?.course, course, courseDetails?.duration]);

  const [searchInput, setSearchInput] = useState("");

  // Filter students based on search input
  const filteredOptions = student
    .filter((res) => res.name.toLowerCase().includes(searchInput.toLowerCase()))
    .map((res) => ({
      value: res.id,
      label: res.name,
    }));

  return (
    <Layout>
      <div class="emp_dash">
        <div class="page_manus">
          <ul class="text-center mb-2">
            <li class="nav-item">
              <a href="index.html" class="deactive-link">
                Dashboard
              </a>{" "}
              <span class="active-link">/ Batch</span>
            </li>
          </ul>
          <div class="page_heading display">
            <h4 class="pb-3">Add Edit</h4>
          </div>
        </div>

        <div class="apply_application_main mt-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-3 g-xl-5 g-xxl-5">
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 leave_type">
                <label htmlFor="branch" className="form-label">
                  Branch
                </label>
                <select
                  className="form-select form-control p-4 pt-0 pb-0"
                  id="branch"
                  {...formik.getFieldProps("branch")}
                >
                  <option value="1" selected label="Tisa" />
                </select>
                {formik.touched.branch && formik.errors.branch ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.branch}
                  </div>
                ) : null}
              </div>

              {/* <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
          <label htmlFor="batch_code" className="form-label">Batch Code</label>
          <input
            type="text"
            className="form-control"
            id="batch_code"
            placeholder="Enter batch code"
            {...formik.getFieldProps('batch_code')}
          />
          {formik.touched.batch_code && formik.errors.batch_code ? (
            <div className="error" style={{ color: 'red' }}>{formik.errors.batch_code}</div>
          ) : null}
        </div> */}

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 leave_type">
                <label htmlFor="course" className="form-label">
                  Course
                </label>
                <select
                  className="form-select form-control p-4 pt-0 pb-0"
                  id="course"
                  {...formik.getFieldProps("course")}
                >
                  <option value="" label="Select course" />
                  {course.map((res, i) => (
                    <option value={res?.id} key={i}>
                      {res?.name}
                    </option>
                  ))}
                </select>
                {formik.touched.course && formik.errors.course ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.course}
                  </div>
                ) : null}
              </div>

              {courseDetails?.fees ? (
                <>
                  <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                    <label htmlFor="total_amount" className="form-label">
                      Course Duration
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="total_amount"
                      placeholder="Enter total amount"
                      value={courseDetails?.duration}
                      disabled
                    />
                  </div>
                </>
              ) : null}

              {/* Batch Start Date */}
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="batch_start_date" className="form-label">
                  Batch Start Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="start_date"
                  placeholder="Batch start date"
                  {...formik.getFieldProps("start_date")}
                />
                {formik.touched.start_date && formik.errors.start_date ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.start_date}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="end_date" className="form-label">
                  Batch end date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="end_date"
                  placeholder="batch end date"
                  {...formik.getFieldProps("end_date")}
                />
                {formik.touched.end_date && formik.errors.end_date ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.end_date}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="start_time" className="form-label">
                  Batch start time
                </label>
                <input
                  type="time"
                  className="form-control"
                  id="start_time"
                  placeholder="batch start date"
                  {...formik.getFieldProps("start_time")}
                />
                {formik.touched.start_time && formik.errors.start_time ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.start_time}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="end_time" className="form-label">
                  Batch end time
                </label>
                <input
                  type="time"
                  className="form-control"
                  id="end_time"
                  placeholder="batch start date"
                  {...formik.getFieldProps("end_time")}
                />
                {formik.touched.end_time && formik.errors.end_time ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.end_time}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 leave_type">
                <label htmlFor="faculty" className="form-label">
                  Faculty
                </label>
                {/* {console.log(employeeData)} */}
                <Select
                  id="faculty"
                  name="faculty"
                  options={employeeData}
                  isMulti
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  value={employeeData.filter((option) =>
                    formik.values.faculty.includes(option.id)
                  )}
                  onChange={(selectedOptions) =>
                    formik.setFieldValue(
                      "faculty",
                      selectedOptions.map((option) => option.id).join(",")
                    )
                  }
                  onBlur={() => formik.setFieldTouched("faculty", true)}
                />
                {formik.touched.faculty && formik.errors.faculty ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.faculty}
                  </div>
                ) : null}
              </div>

              <div className="col-lg-12">
                <div className="btn_block">
                  <button
                    type="button"
                    onClick={() => router.push("/batch")}
                    className="cancel-btn btn me-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="Submit_btn btn comman_btn"
                    disabled={loading} // Disable button while loading
                  >
                    {/* Submit */}
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading...
                      </>
                    ) : (
                      "Submit"
                    )}
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

export default BatchEdit;
