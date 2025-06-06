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
import Layout from '../layout/layout'



function BatchAdd() {
  const FAQId = getItem('edit_faq_id')
  const [branch, setBranch] = useState([]);
  const [course, setCourse] = useState([]);
  const [courseDetails, setCourseDetails] = useState({});
  const [student, setStudent] = useState([]);
  const [feesdata , setFeesData] = useState({})
  const { axios } = useAxiosInstances();
  const router = useRouter()
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const body ={
      page:1,
      limit:50
    }
    axios.post("view-course", body).then((res) => {
        if (res.data.status) {
          setCourse(res?.data?.result?.courseList);
        }
      })
      .catch((err) => {
        catchResponse(err);
  });
  if(FAQId){
    const body = {
      id:FAQId
    }
    axios.post('/get-faqdetails',body).then((res)=>{
      console.log(res);
      if(res?.data?.status){
        const {result}=res.data
        formik.setValues({
          course: result.course_id,
          questions: [
            {
              question_text: result.question_text,
              options: JSON.parse(result.options), // Parse options from string to array
              correctAnswer: result.correct_answer,
            },
          ],
        });
  
      }
    }).catch((err)=>{
      catchResponse(err)
    })
  }
  }, [FAQId]);

  const formik = useFormik({
    initialValues: {
      course: "",
      questions: [
        {
          question_text: "",
          options: [""],
          correctAnswer: "",
        },
      ],
    },
    validate: (values) => {
      const errors = {};
      if (!values.course) errors.course = "Course is required.";

      // Validate each question
      values.questions.forEach((question, index) => {
        if (!question.question_text) {
          errors.questions = errors.questions || [];
          errors.questions[index] = errors.questions[index] || {};
          errors.questions[index].question_text = "Question text is required.";
        }
        // if (
        //   !question.options ||
        //   question.options.some((option) => option.trim() === "")
        // ) {
        //   errors.questions = errors.questions || [];
        //   errors.questions[index] = errors.questions[index] || {};
        //   errors.questions[index].options = "All options are required.";
        // }
        if (!question.correctAnswer) {
          errors.questions = errors.questions || [];
          errors.questions[index] = errors.questions[index] || {};
          errors.questions[index].correctAnswer =
            "Correct answer is required.";
        }
      });

      return errors;
    },
    onSubmit: (values) => {
      const body={
        action:"modified",
        question:values.questions,
        course_id:values.course,
        id:FAQId
      }
      axios.post("/add-faq", body).then((res) => {
        if (res?.data?.status) {
          toast.success(res?.data?.message)
          
          router.push('/faq')
        } else {
          toast.error(res?.data?.message)
        }
      }).catch((err) => {
        catchResponse(err)
      })      // Handle API submission or other actions here
    },
  });

// console.log("--------",formik)




  return (
    <Layout>
     
          <div class="emp_dash">
            <div class="page_manus">
              <div class="page_heading display">
                <h4 class="pb-3">Edit FAQ</h4>
              </div>
            </div>
          
            <div class="apply_application_main mt-4">
            <form onSubmit={formik.handleSubmit}>
  {/* Course Selection */}
  <div className="row mb-3">
  <div className="col-sm-12 col-md-6 col-lg-6 col-xl-12 col-xxl-12 leave_type">
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
  </div>

  {/* Questions */}
  {formik.values.questions.map((question, qIndex) => (
    <div
      key={qIndex}
      className="row border rounded mb-3 p-3"
    >
      <div className="col-12 mb-3">
        <label className="form-label">Question</label>
        <input
          type="text"
          className="form-control"
          value={question.question_text}
          onChange={(e) => {
            const updatedQuestions = [...formik.values.questions];
            updatedQuestions[qIndex].question_text = e.target.value;
            formik.setFieldValue("questions", updatedQuestions);
          }}
        />
        {formik.errors.questions &&
        formik.errors.questions[qIndex]?.question_text ? (
          <div className="text-danger">
            {formik.errors.questions[qIndex].question_text}
          </div>
        ) : null}
      </div>

      {/* Options */}
      <div className="col-12 mb-3">
        <label className="form-label">Options</label>
        {question.options.map((option, oIndex) => (
          <div key={oIndex} className="row align-items-center mb-2">
            <div className="col-10">
              <input
                type="text"
                className="form-control"
                value={option}
                onChange={(e) => {
                  const updatedQuestions = [...formik.values.questions];
                  updatedQuestions[qIndex].options[oIndex] = e.target.value;
                  formik.setFieldValue("questions", updatedQuestions);
                }}
              />
            </div>{
              
oIndex==0?"":   
<div className="col-2 text-end">
  <>
  <button
  type="button"
  className="btn btn-danger btn-sm"
  onClick={() => {
    const updatedQuestions = [...formik.values.questions];
    updatedQuestions[qIndex].options.splice(oIndex, 1);
    formik.setFieldValue("questions", updatedQuestions);
  }}
>
  Remove
</button>
  </>

</div>
            }
         
          </div>
        ))}
        

        <button
          type="button"
          className="btn btn-primary btn-sm mt-2"
          onClick={() => {
            const updatedQuestions = [...formik.values.questions];
            updatedQuestions[qIndex].options.push("");
            formik.setFieldValue("questions", updatedQuestions);
          }}
        >
          Add Option
        </button>
      </div>

      {/* Correct Answer */}
      <div className="col-12 mb-3">
        <label className="form-label">Correct Answer</label>
        <input
          type="text"
          className="form-control"
          value={question.correctAnswer}
          onChange={(e) => {
            const updatedQuestions = [...formik.values.questions];
            updatedQuestions[qIndex].correctAnswer = e.target.value;
            formik.setFieldValue("questions", updatedQuestions);
          }}
        />
        {formik.errors.questions &&
        formik.errors.questions[qIndex]?.correctAnswer ? (
          <div className="text-danger">
            {formik.errors.questions[qIndex].correctAnswer}
          </div>
        ) : null}
      </div>

      {/* Remove Question */}
      {
        qIndex==0?"":
      
      <div className="col-12 text-end">
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => {
            const updatedQuestions = [...formik.values.questions];
            updatedQuestions.splice(qIndex, 1);
            formik.setFieldValue("questions", updatedQuestions);
          }}
        >
          Remove Question
        </button>
      </div>
        }
    </div>
  ))}

  {/* Add New Question */}
  {/* <div className="row mb-3">
    <div className="col-12 text-end">
      <button
        type="button"
        className="btn btn-success btn-sm"
        onClick={() => {
          formik.setFieldValue("questions", [
            ...formik.values.questions,
            { question_text: "", options: [""], correctAnswer: "" },
          ]);
        }}
      >
        Add Question
      </button>
    </div>
  </div> */}

  {/* Submit Button */}
  <div className="row">
    <div className="col-12 text-end">
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </div>
  </div>
</form>

            </div>
          </div>
        
    </Layout>
  );
}

export default BatchAdd;
