import React, { useEffect, useState } from "react";
import Sidebar from "./layout/sidebar";
import Header from "./layout/header";
import useAxiosInstances from "@/config/AxiosConfig";
import { catchResponse, removeItem, setItem } from "@/utils/Helper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Moment from "react-moment";
import Layout from "./layout/layout";
import { MoneyFormat } from "@/utils/Helper";

function Legacy() {
  const { axios } = useAxiosInstances();
  const [data, setData] = useState({});
  const [totalCount, setTotalCount] = useState("0");
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const [totalPages, setTotalPages] = useState(0);
  const [totalActualAmount, setTotalActualAmount] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalDueAmount, setTotalDueAmount] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(0);

  const [totalBCA_ActualAmount, setTotalBCA_ActualAmount] = useState(0);
  const [totalBCA_PaidAmount, setTotalBCA_PaidAmount] = useState(0);
  const [totalBCA_DueAmount, setTotalBCA_DueAmount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20); // Default to 10 per page
  const [courseList, setcouresList] = useState([]); // Default to 10 per page
  const [BCAList, setBCAList] = useState([]); // Default to 10 per page

  useEffect(() => {
    axios
      .post("/get-dashboard-details")
      .then((res) => {
        // console.log(res);
        if (res?.data?.status) {
          setData(res?.data?.result);
        }
      })
      .catch((err) => {
        catchResponse(err);
      });

    axios
      .post("/get-course-details")
      .then((res) => {
        if (res?.data?.status) {
          setcouresList(res?.data?.result);
        }
      })
      .catch((err) => {
        catchResponse(err);
      });

    axios
      .post("/get-BCA-Stu-details")
      .then((res) => {
        if (res?.data?.status) {
          setBCAList(res?.data?.result?.List);
          setTotalBCA_ActualAmount(res?.data?.result?.TotalActualAmount);
          setTotalBCA_PaidAmount(res?.data?.result?.TotalPayAmount);
          setTotalBCA_DueAmount(res?.data?.result?.DuoTotalamount);
        }
      })
      .catch((err) => {
        catchResponse(err);
      });

    axios
      .post("/get-Laser-details")
      .then((res) => {
        if (res?.data?.status) {
          setTotalActualAmount(res?.data?.result?.TotalActualAmount);
          setTotalPaidAmount(res?.data?.result?.TotalPayAmount);
          setTotalDueAmount(res?.data?.result?.DuoTotalamount);
          setCurrentMonth(res?.data?.result?.current_Month);
        }
      })
      .catch((err) => {
        catchResponse(err);
      });
  }, [limit, page]);

  return (
    <>
      <Layout>
        <div className="emp_dash">
          <div className="search_show_entries display justify-content-between mt-4">
            <div className=" display ps-4">
              <h4 className="pb-3">Dashboard</h4>
            </div>
            <div></div>
          </div>
          <div className="row g-3 g-xl-5 g-xxl-5">
            <div className="col-3 ">
              <div className="card text-white bg-primary mb-3">
                <div className="row">
                  <div className="col-8">
                    <div className="ps-4 pt-4 pe-3 pb-4">
                      <div className="">
                        <h6 className="mb-2 tx-12 text-white">
                          Total Active Student{" "}
                        </h6>
                      </div>
                      <div className="pb-0 mt-0 ">
                        <div className="d-flex">
                          <h4 className="tx-20 font-weight-semibold mb-2 text-white">
                            {data ? data?.activeStudentsCount : 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-3  ">
                    <div className="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        height="30"
                        width="30"
                      >
                        <path
                          fill="#ffffff"
                          d="M319.4 320.6L224 416l-95.4-95.4C57.1 323.7 0 382.2 0 454.4v9.6c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-9.6c0-72.2-57.1-130.7-128.6-133.8zM13.6 79.8l6.4 1.5v58.4c-7 4.2-12 11.5-12 20.3 0 8.4 4.6 15.4 11.1 19.7L3.5 242c-1.7 6.9 2.1 14 7.6 14h41.8c5.5 0 9.3-7.1 7.6-14l-15.6-62.3C51.4 175.4 56 168.4 56 160c0-8.8-5-16.1-12-20.3V87.1l66 15.9c-8.6 17.2-14 36.4-14 57 0 70.7 57.3 128 128 128s128-57.3 128-128c0-20.6-5.3-39.8-14-57l96.3-23.2c18.2-4.4 18.2-27.1 0-31.5l-190.4-46c-13-3.1-26.7-3.1-39.7 0L13.6 48.2c-18.1 4.4-18.1 27.2 0 31.6z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-3 ">
              <div className="card text-white bg-success mb-3">
                <div className="row">
                  <div className="col-8">
                    <div className="ps-4 pt-4 pe-3 pb-4">
                      <div>
                        <h6 className="mb-2 tx-12 text-white">
                          Total Active Batch{" "}
                        </h6>
                      </div>
                      <div className="pb-0 mt-0">
                        <div className="d-flex">
                          <h4 className="tx-20 font-weight-semibold mb-2 text-white">
                            {data ? data?.activeBatchesCount : 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                      {/* <svg xmlns="http://www.w3.org/2000/svg"  height="30" width="30" viewBox="0 0 576 512" fill="white"><path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z"/></svg> */}

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        height="30"
                        width="30"
                      >
                        <path
                          fill="#ffffff"
                          d="M319.4 320.6L224 416l-95.4-95.4C57.1 323.7 0 382.2 0 454.4v9.6c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-9.6c0-72.2-57.1-130.7-128.6-133.8zM13.6 79.8l6.4 1.5v58.4c-7 4.2-12 11.5-12 20.3 0 8.4 4.6 15.4 11.1 19.7L3.5 242c-1.7 6.9 2.1 14 7.6 14h41.8c5.5 0 9.3-7.1 7.6-14l-15.6-62.3C51.4 175.4 56 168.4 56 160c0-8.8-5-16.1-12-20.3V87.1l66 15.9c-8.6 17.2-14 36.4-14 57 0 70.7 57.3 128 128 128s128-57.3 128-128c0-20.6-5.3-39.8-14-57l96.3-23.2c18.2-4.4 18.2-27.1 0-31.5l-190.4-46c-13-3.1-26.7-3.1-39.7 0L13.6 48.2c-18.1 4.4-18.1 27.2 0 31.6z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-3">
              <div class="card text-white bg-info mb-3">
                <div class="row">
                  <div class="col-8">
                    <div class="ps-4 pt-4 pe-3 pb-4">
                      <div class="">
                        <h6 class="mb-2 tx-12 text-white">
                          {" "}
                          Total Active BCA Student{" "}
                        </h6>
                      </div>
                      <div class="pb-0 mt-0">
                        <div class="d-flex">
                          <h4 class="tx-20 font-weight-semibold mb-2 text-white">
                            {MoneyFormat(
                              data ? data?.activeBCAStudentsCount : 0
                            )}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        height="30"
                        width="30"
                      >
                        <path
                          fill="#ffffff"
                          d="M319.4 320.6L224 416l-95.4-95.4C57.1 323.7 0 382.2 0 454.4v9.6c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-9.6c0-72.2-57.1-130.7-128.6-133.8zM13.6 79.8l6.4 1.5v58.4c-7 4.2-12 11.5-12 20.3 0 8.4 4.6 15.4 11.1 19.7L3.5 242c-1.7 6.9 2.1 14 7.6 14h41.8c5.5 0 9.3-7.1 7.6-14l-15.6-62.3C51.4 175.4 56 168.4 56 160c0-8.8-5-16.1-12-20.3V87.1l66 15.9c-8.6 17.2-14 36.4-14 57 0 70.7 57.3 128 128 128s128-57.3 128-128c0-20.6-5.3-39.8-14-57l96.3-23.2c18.2-4.4 18.2-27.1 0-31.5l-190.4-46c-13-3.1-26.7-3.1-39.7 0L13.6 48.2c-18.1 4.4-18.1 27.2 0 31.6z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-3">
              <div
                class="card text-white"
                style={{ background: "rgb(111 66 193)" }}
              >
                <div class="row">
                  <div class="col-8">
                    <div class="ps-4 pt-4 pe-3 pb-4">
                      <div class="">
                        <h6 class="mb-2 tx-12 text-white">
                          Total Fees Collection{" "}
                        </h6>
                      </div>
                      <div class="pb-0 mt-0">
                        <div class="d-flex">
                          <h4 class="tx-20 font-weight-semibold mb-2 text-white">
                            {MoneyFormat(data ? data?.totalCollection : 0)}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 576 512"
                        fill="white"
                      >
                        <path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="card text-white bg-primary mb-3">
                <div className="row">
                  <div className="col-8">
                    <div className="ps-4 pt-4 pe-3 pb-4">
                      <div className="">
                        <h6 className="mb-2 tx-12 text-white">
                          Total Course Actual Fees{" "}
                        </h6>
                      </div>
                      <div className="pb-0 mt-0 ">
                        <div className="d-flex">
                          <h4 className="tx-20 font-weight-semibold mb-2 text-white">
                            {MoneyFormat(
                              totalActualAmount ? totalActualAmount : 0
                            )}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 576 512"
                        fill="white"
                      >
                        <path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-3   ">
              <div className="card text-white bg-success mb-3">
                <div className="row">
                  <div className="col-8">
                    <div className="ps-4 pt-4 pe-3 pb-4">
                      <div>
                        <h6 className="mb-2 tx-12 text-white">
                          Total Course Received Fees{" "}
                        </h6>
                      </div>
                      <div className="pb-0 mt-0">
                        <div className="d-flex">
                          <h4 className="tx-20 font-weight-semibold mb-2 text-white">
                            {MoneyFormat(totalPaidAmount ? totalPaidAmount : 0)}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 576 512"
                        fill="white"
                      >
                        <path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-3">
              <div class="card text-white bg-info mb-3">
                <div class="row">
                  <div class="col-8">
                    <div class="ps-4 pt-4 pe-3 pb-4">
                      <div class="">
                        <h6 class="mb-2 tx-12 text-white">
                          {" "}
                          Total Course Pending Fees{" "}
                        </h6>
                      </div>
                      <div class="pb-0 mt-0">
                        <div class="d-flex">
                          <h4 class="tx-20 font-weight-semibold mb-2 text-white">
                            {MoneyFormat(totalDueAmount)}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 576 512"
                        fill="white"
                      >
                        <path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-3 ">
              <div className="card text-white bg-primary mb-3">
                <div className="row">
                  <div className="col-8">
                    <div className="ps-4 pt-4 pe-3 pb-4">
                      <div className="">
                        <h6 className="mb-2 tx-12 text-white">
                          Current Month Fees Collection
                        </h6>
                      </div>
                      <div className="pb-0 mt-0 ">
                        <div className="d-flex">
                          <h4 className="tx-20 font-weight-semibold mb-2 text-white">
                            {MoneyFormat(currentMonth ? currentMonth : 0)}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 576 512"
                        fill="white"
                      >
                        <path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-3 ">
              <div className="card text-white bg-success mb-3">
                <div className="row">
                  <div className="col-8">
                    <div className="ps-4 pt-4 pe-3 pb-4">
                      <div>
                        <h6 className="mb-2 tx-12 text-white">
                          Total BCA Received Fees{" "}
                        </h6>
                      </div>
                      <div className="pb-0 mt-0">
                        <div className="d-flex">
                          <h4 className="tx-20 font-weight-semibold mb-2 text-white">
                            {MoneyFormat(
                              totalBCA_PaidAmount ? totalBCA_PaidAmount : 0
                            )}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 576 512"
                        fill="white"
                      >
                        <path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-3">
              <div class="card text-white bg-info mb-3">
                <div class="row">
                  <div class="col-8">
                    <div class="ps-4 pt-4 pe-3 pb-4">
                      <div class="">
                        <h6 class="mb-2 tx-12 text-white">
                          {" "}
                          Total BCA Pending Fees{" "}
                        </h6>
                      </div>
                      <div class="pb-0 mt-0">
                        <div class="d-flex">
                          <h4 class="tx-20 font-weight-semibold mb-2 text-white">
                            {MoneyFormat(
                              totalBCA_DueAmount ? totalBCA_DueAmount : 0
                            )}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 576 512"
                        fill="white"
                      >
                        <path d="M308 96c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44v44.7c0 6.6 5.4 12 12 12h85.3c27.3 0 48.3 10 61 27.3H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h158.8c-6.2 36.1-33 58.6-74.8 58.6H12c-6.6 0-12 5.4-12 12v53c0 3.3 1.4 6.5 3.9 8.8l165.1 152.4a12 12 0 0 0 8.1 3.2h82.6c10.9 0 16.2-13.4 8.1-20.8L116.9 319.9c76.5-2.3 131.1-53.4 138.3-127.9H308c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-58.7c-3.5-11.5-8.3-22.2-14.3-32H308z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {courseList.map((e, index) => {
              // console.log(e);
              const colors = [
                "bg-primary", // Blue
                "bg-success", // Green
                "bg-warning", // Yellow
                "bg-danger", // Red
                "bg-info", // Light Blue
                "bg-secondary", // Grey
                "bg-dark", // Black
                "bg-light text-dark", // Light background with dark text
              ];
              const bgColor = colors[index % colors.length]; // Use index to select color cyclically

              return (
                <div className="col-sm-3" key={index}>
                  <div className={`card text-white ${bgColor} mb-3`}>
                    <div class="row">
                      <div class="col-8">
                        <div class="ps-4 pt-4 pe-3 pb-4">
                          <div class="">
                            <h6 class="mb-2 tx-12 text-white">
                              {e.course_details.name}{" "}
                            </h6>
                          </div>
                          <div class="pb-0 mt-0">
                            <div class="d-flex">
                              <h4 class="tx-20 font-weight-semibold mb-2 text-white">
                                {e.userCount}
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="circle-icon text-center  d-flex align-items-center justify-content-center d-flex align-items-center justify-content-center align-self-center overflow-hidden mt-4">
                          <i class="fas fa-book "></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/*                   
<div className="card mt-3 shadow-lg rounded">
  <div className="card-header  text-white d-flex justify-content-between align-items-center">
    <h4 className="mb-0">Latest 10 BCA Students</h4>
  </div>

  <div className="bg-white ">
    <div className="table-responsive">
      <table className="table table-bordered table-hover text-center">
        <thead className="bg-primary text-white">
                      <tr>
                        <th>S.NO</th>
                        <th>Student Name</th>
                        <th>Student Email</th>
                        <th>Student Mobile</th>
                        <th className="reason">Father Name</th>
                        <th className="reason">Father Mobile</th>
                        <th>Registration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BCAList?.length > 0 ? BCAList.map((res, i) => (
                        <tr key={i}>
                          <td>{(page - 1) * limit + (i + 1)}</td>
                          <td>{res?.user_details?.name}</td>
                          <td>{res?.user_details?.email}</td>
                          <td>{res?.user_details?.mobile}</td>
                          <td>{res?.user_details?.father_name ? res?.user_details?.father_name : 'N/A'}</td>
                          <td>{res?.user_details?.father_mobile ? res?.user_details?.father_mobile : 'N/A'}</td>               
                          <td>
                          <Moment format="DD/MM/YYYY">{res?.created_at}</Moment>

                          </td>
                      
                        </tr>
                      )) : null}
                    </tbody>

      </table>
    </div>
  </div>
</div>
          */}
        </div>
      </Layout>
    </>
  );
}

export default Legacy;
