import React from "react";
import Sidebar from "./layout/sidebar";
import Header from "./layout/header";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import useAxiosInstances from "@/config/AxiosConfig";
import { catchResponse, getItem } from "@/utils/Helper";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Select from "react-select";
import Layout from "./layout/layout";

function Legacyadd() {
  const [branch, setBranch] = useState([]);
  const [course, setCourse] = useState([]);
  const [courseDetails, setCourseDetails] = useState({});
  const [student, setStudent] = useState([]);
  const [feesdata, setFeesData] = useState(null);
  const { axios } = useAxiosInstances();
  const router = useRouter();
  const Fees_id = getItem("edit_fees_id");
  const [selectedStudent, setSelectedStudent] = useState(null); // Track the selected student
  // Format data for react-select
  const studentOptions = student.map((stu) => ({
    value: stu.id, // Assuming each student has an 'id'
    label: stu.name, // Assuming each student has a 'name'
  }));

  // Handle selection change
  const handleStudentChange = (selectedOption) => {
    setSelectedStudent(selectedOption); // Set the selected student
    formik.setFieldValue("student", selectedOption ? selectedOption.value : ""); // Update Formik field value
  };

  useEffect(() => {
    //  to get branch
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
  }, []);

  const formik = useFormik({
    initialValues: {
      branch: "1",
      course: "",
      student: "",
      total_amount: "",
      duo_amount: "",
      discount_amount: "",
      actual_amount: "",
      pay_amount: "",
      payment_mode: "",
      already_paid: "",
      deposit_date: new Date().toISOString().split("T")[0],
    },
    validationSchema: Yup.object({
      branch: Yup.string().required("Branch is required"),
      course: Yup.string().required("Course is required"),
      student: Yup.string().required("Student is required"),
      payment_mode: Yup.string().required("Payment mode is required"),
      deposit_date: Yup.date().required("Deposit Date is required").nullable(),
      pay_amount: Yup.number().required("Pay Amount is required"),
      already_paid: Yup.string().optional(),
      total_amount: Yup.number()
        .required("Total amount is required")
        .positive()
        .integer(),
      duo_amount: Yup.number().optional().integer(),
      discount_amount: Yup.number().optional().integer(),
    }),
    onSubmit: (values) => {
      if (Fees_id) {
        const body = {
          branch_id: values?.branch,
          course_id: values?.course,
          user_id: values?.student,
          total_amount: values?.total_amount,
          duo_amount: values?.duo_amount,
          discount_amount: values?.discount_amount,
          actual_amount: values?.actual_amount,
          pay_amount: values?.pay_amount,
          action: "modified",
          fees_id: Fees_id,
          payment_mode: values?.payment_mode,
          deposit_date: values?.deposit_date,
        };

        axios
          .post("/add-laser", body)
          .then((res) => {
            if (res?.data?.status) {
              toast.success(res?.data?.message);
              router.push("/fees");
            } else {
              toast.error(res?.data?.message);
            }
          })
          .catch((err) => {
            catchResponse(err);
          });
      } else {
        const body = {
          branch_id: values?.branch,
          course_id: values?.course,
          user_id: values?.student,
          total_amount: values?.total_amount,
          duo_amount: values?.duo_amount,
          discount_amount: values?.discount_amount,
          actual_amount: values?.actual_amount,
          pay_amount: values?.pay_amount,
          action: "create",
          payment_mode: values?.payment_mode,
          deposit_date: values?.deposit_date,
        };

        axios
          .post("/add-laser", body)
          .then((res) => {
            if (res?.data?.status) {
              toast.success(res?.data?.message);
              setTimeout(() => {
                window.location.href = "fees";
              }, 1000);
            } else {
              toast.error(res?.data?.message);
            }
          })
          .catch((err) => {
            catchResponse(err);
          });
      }
    },
  });

  useEffect(() => {
    if (formik?.values?.student) {
      const body = {
        student_id: formik?.values?.student,
      };
      axios
        .post("getLegacyCourse", body)
        .then((res) => {
          if (res.data.status) {
            setCourse(res?.data?.result);
          }
        })
        .catch((err) => {
          catchResponse(err);
        });
    }
  }, [formik?.values?.student]);

  useEffect(() => {
    if (formik?.values?.course) {
      setCourseDetails({});
      const selectCourserDetails = course.filter(
        (res) => res.id == formik?.values?.course
      );
      console.log(...selectCourserDetails);
      setCourseDetails(...selectCourserDetails);
      if (feesdata !== 0) {
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
      }
    }
  }, [formik?.values?.course, course]);

  useEffect(() => {
    const totalAmount = formik.values.total_amount;
    const DiscountAmount = formik.values.discount_amount;
    if (formik?.values?.discount_amount != "") {
      formik.setValues({
        ...formik.values, // Keep the current values
        actual_amount: totalAmount - DiscountAmount || 0, // Update total_amount
        duo_amount:
          totalAmount - DiscountAmount - formik.values.already_paid || 0,
      });
    }
  }, [formik?.values?.discount_amount]);

  useEffect(() => {
    const totalAmount = formik.values.actual_amount;
    const PayAmount = formik.values.pay_amount;
    if (formik?.values?.pay_amount != "") {
      formik.setValues({
        ...formik.values,
        duo_amount: totalAmount - PayAmount - formik.values.already_paid || 0,
      });
    }
  }, [formik?.values?.pay_amount]);

  useEffect(() => {
    if (formik.values.course && formik?.values?.student) {
      const body = {
        course_id: formik?.values?.course,
        user_id: formik?.values?.student,
      };
      axios
        .post("/already-paid-fees", body)
        .then((res) => {
          if (res?.data?.status) {
            let sum = 0;
            for (const iterator of res.data.result) {
              sum += Number(iterator.pay_amount) || 0; // Convert to number, default to 0 if invalid
            }
            setFeesData(sum);

            formik.setFieldValue("already_paid", sum);
            formik.setFieldValue(
              "discount_amount",
              res.data?.result[0]?.discount_amount
            );

            console.log(res.data?.result, "res.data?.result?");

            formik.setFieldValue("duo_amount", courseDetails?.fees - sum || 0);
          }
          console.log(courseDetails, "hhhhhhhhhhhhhh");
        })
        .catch((err) => {
          catchResponse(err);
        });
    }
  }, [formik.values.course, formik?.values?.student, courseDetails]);

  useEffect(() => {
    if (Fees_id) {
      const body = {
        fees_id: Fees_id,
      };
      axios
        .post("/laser-details", body)
        .then((res) => {
          if (res?.data?.status) {
            formik.setFieldValue(
              "branch",
              res?.data?.result?.branch_id ? res?.data?.result?.branch_id : ""
            );
            formik.setFieldValue(
              "course",
              res?.data?.result?.course_id ? res?.data?.result?.course_id : ""
            );
            formik.setFieldValue(
              "student",
              res?.data?.result?.user_id ? res?.data?.result?.user_id : ""
            );
            formik.setFieldValue(
              "total_amount",
              res?.data?.result?.total_amount
                ? res?.data?.result?.total_amount
                : ""
            );
            formik.setFieldValue(
              "duo_amount",
              res?.data?.result?.duo_amount ? res?.data?.result?.duo_amount : ""
            );
            formik.setFieldValue(
              "discount_amount",
              res?.data?.result?.discount_amount
                ? res?.data?.result?.discount_amount
                : ""
            );
            formik.setFieldValue(
              "actual_amount",
              res?.data?.result?.actual_amount
                ? res?.data?.result?.actual_amount
                : ""
            );
            formik.setFieldValue(
              "pay_amount",
              res?.data?.result?.pay_amount ? res?.data?.result?.pay_amount : ""
            );
            formik.setFieldValue(
              "deposit_date",
              res?.data?.result?.deposit_date
                ? res?.data?.result?.deposit_date
                : ""
            );
          }
        })
        .catch((err) => {
          catchResponse(err);
        });
    }
  }, [Fees_id]);

  return (
    <Layout>
      <div class="emp_dash">
        <div class="page_manus">
          <div class="page_heading display">
            <h4 class="pb-3">Add Fees</h4>
          </div>
        </div>
        <div class="search_show_entries display justify-content-end mt-4"></div>
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

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 leave_type">
                <label htmlFor="student" className="form-label">
                  Student
                </label>
                <Select
                  options={studentOptions} // Pass the formatted options
                  value={selectedStudent} // Display the selected student
                  onChange={handleStudentChange} // Handle the change event
                  placeholder="Select a student"
                  className="form-control"
                />
                {formik.touched.student && formik.errors.student ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.student}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 leave_type">
                <label htmlFor="course" className="form-label">
                  Course
                </label>
                <select
                  className="form-select form-control p-4 pt-0 pb-0"
                  id="course"
                  {...formik.getFieldProps("course")} // Ensure correct binding to Formik
                >
                  {/* Default Option */}
                  <option value="" label="Select course" />

                  {/* Dynamically Render Options */}
                  {course.map((e) => (
                    <option value={e.id} key={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>

                {/* Validation Message */}
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
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="total_amount" className="form-label">
                  Course Fees
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="total_amount"
                  placeholder="Enter total course fees"
                  {...formik.getFieldProps("total_amount")}
                  disabled
                />
                {formik.touched.total_amount && formik.errors.total_amount ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.total_amount}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="discount_amount" className="form-label">
                  Discount Amount
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="discount_amount"
                  placeholder="Enter discount amount"
                  {...formik.getFieldProps("discount_amount")}
                />
                {formik.touched.discount_amount &&
                formik.errors.discount_amount ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.discount_amount}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="actual_amount" className="form-label">
                  Actual amount
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="actual_amount"
                  placeholder="Enter actual amount"
                  {...formik.getFieldProps("actual_amount")}
                  disabled
                />
                {formik.touched.actual_amount && formik.errors.actual_amount ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.actual_amount}
                  </div>
                ) : null}
              </div>
              {feesdata !== 0 ? (
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                  <label htmlFor="discount_amount" className="form-label">
                    Already Paid Amount
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="discount_amount"
                    placeholder="Enter already paid amount"
                    disabled
                    {...formik.getFieldProps("already_paid")}
                  />
                </div>
              ) : null}
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="pay_amount" className="form-label">
                  Pay Amount
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="pay_amount"
                  placeholder="Enter pay amount"
                  {...formik.getFieldProps("pay_amount")}
                />
                {formik.touched.pay_amount && formik.errors.pay_amount ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.pay_amount}
                  </div>
                ) : null}
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="duo_amount" className="form-label">
                  Due Amount
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="duo_amount"
                  placeholder="Enter duo amount"
                  {...formik.getFieldProps("duo_amount")}
                  disabled
                />
                {formik.touched.duo_amount && formik.errors.duo_amount ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.duo_amount}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 leave_type">
                <label htmlFor="branch" className="form-label">
                  Payment Mode
                </label>
                <select
                  className="form-select form-control p-4 pt-0 pb-0"
                  id="branch"
                  {...formik.getFieldProps("payment_mode")}
                >
                  <option value="" label="Select payment mode" />
                  <option value="Cash"> Cash</option>
                  <option value="Online"> Online</option>
                </select>
                {formik.touched.payment_mode && formik.errors.payment_mode ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.payment_mode}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                <label htmlFor="deposit_date" className="form-label">
                  Deposit Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="deposit_date"
                  value={formik.values.deposit_date} // Controlled value from Formik
                  onChange={formik.handleChange} // Update Formik state on change
                  onBlur={formik.handleBlur} //
                />
                {formik.touched.deposit_date && formik.errors.deposit_date ? (
                  <div className="error" style={{ color: "red" }}>
                    {formik.errors.deposit_date}
                  </div>
                ) : null}
              </div>

              <div className="col-lg-12">
                <div className="btn_block">
                  <button
                    type="button"
                    onClick={() => router.push("/fees")}
                    className="cancel-btn btn me-3"
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

export default Legacyadd;
