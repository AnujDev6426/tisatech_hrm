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
import Layout from '../layout/layout'


function FollowUpAdd() {
  const { axios } = useAxiosInstances();
  const router = useRouter()
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      mobile:"",
      address: "",
      father_name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      mobile: Yup.string().required("Mobile is required"),
      father_name: Yup.string().required("Father's Name is required"),
      // address: Yup.string().required("Address Code is required"),

    }),
    onSubmit: (values) => {
      setLoading(true); // Show loader
      const body ={
        name:values?.name,
        mobile:values?.mobile, 
        address:values?.address,
        father_name:values?.father_name,
        message:[],
        action:"create",
      }

     axios.post("/add-follow-up",body).then((res)=>{
      setLoading(false); // Hide loader
      if(res?.data?.status){
        toast.success(res?.data?.message)
        setTimeout(() => {
          // window.location.href = '/follow-ups'
          router.push('/follow-ups')
          
        },1000);
      }else{
        toast.error(res?.data?.message)
      }
     }).catch((err)=>{
      setLoading(false); // Hide loader
      catchResponse(err)
     })
   
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
                  <span class="active-link">/ Follow -Up</span>
                </li>
              </ul>
              <div class="page_heading display">
                <h4 class="pb-3">Add Follow-Up</h4>
              </div>
            </div>
            {/* <div class="search_show_entries display justify-content-center mt-4">
              <div class=" leave_detali approve-detail  position-relative W-100 display justify-content-between  p-4 pt-2 pb-2">
                <div class="available pe-1 pe-sm-2 pe-md-3 pe-lg-3 pe-xl-5 pe-xxl-5 display justify-content-between">
                  <span class="available-bg display me-2">02</span>
                  <span>Total</span>
                </div>
                <div class="seperator"></div>
                <div class="taken  display justify-content-between ps-1 pe-1 ps-sm-2 pe-sm-2 ps-md-3 pe-md-3 ps-lg-3 pe-lg-3 ps-xl-3 pe-xl-3 ps-xxl-5 pe-xxl-5">
                  <span class="pending-bg display me-2">02</span>
                  <span>Active</span>
                </div>
                <div class="seperator"></div>
                <div class="taken  display justify-content-between ps-1 ps-sm-2 ps-xl-5 ps-lg-3 ps-md-3 ps-xxl-5 ">
                  <span class="taken-bg display me-2">00</span>
                  <span>Inactive</span>
                </div>
              </div>
            </div> */}
            <div class="apply_application_main mt-4">
              <form onSubmit={formik.handleSubmit}>
                <div className="row g-3 g-xl-5 g-xxl-5">
               

                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 leave_type">
                <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter name"
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="error" style={{ color: 'red' }}>{formik.errors.name}</div>
          ) : null}
                  </div>


                  <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 leave_type">
                <label htmlFor="father_name" className="form-label">Father's Name</label>
          <input
            type="text"
            className="form-control"
            id="father_name"
            placeholder="Enter Father's Name"
            {...formik.getFieldProps('father_name')}
          />
          {formik.touched.father_name && formik.errors.father_name ? (
            <div className="error" style={{ color: 'red' }}>{formik.errors.father_name}</div>
          ) : null}
                  </div>




                  <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 leave_type">
                <label htmlFor="mobile" className="form-label">Mobile</label>
          <input
            type="number"
            className="form-control"
            id="mobile"
            placeholder="Enter mobile"
            {...formik.getFieldProps('mobile')}
          />
          {formik.touched.mobile && formik.errors.mobile ? (
            <div className="error" style={{ color: 'red' }}>{formik.errors.mobile}</div>
          ) : null}
                  </div>
                  <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 leave_type">
                <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            placeholder="Enter address"
            {...formik.getFieldProps('address')}
          />
          {/* {formik.touched.address && formik.errors.address ? (
            <div className="error" style={{ color: 'red' }}>{formik.errors.address}</div>
          ) : null} */}
                  </div>
    
                
                  <div className="col-lg-12">
                    <div className="btn_block">
                      <button type="button" onClick={()=>router.push('/follow-ups')}  className="cancel-btn btn me-3">
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

export default FollowUpAdd;
