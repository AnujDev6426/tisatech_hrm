import React,{useState}from "react";
import Sidebar from "../layout/sidebar";
import Header from "../layout/header";
import { useRouter } from "next/navigation";
import ExcelJS from "exceljs";  // Importing exceljs
import useAxiosInstances from "@/config/AxiosConfig";
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx';
import Layout from '../layout/layout'

function ImportExcel() {
  const router = useRouter();

  const { axios } = useAxiosInstances();
  const [data, setData] = useState("");
  const importExcel = (file) => {
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const headers = jsonData[0];
            const formattedData = jsonData.map((row) => {
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header] = row[index];
                });
                return rowData;
            });
            setData(formattedData);
        };
        reader.readAsBinaryString(file);
    } else {
        console.error('Please select an Excel file.');
    }
};

const handleSubmitCustom = async (event) => {
        event.preventDefault();
        const body = {
            exceldata: data,
            action:"create",
        };
        await axios.post("/follow-up-import-excel", body)
            .then((res) => {
               if(res?.data?.status){
                       toast.success(res?.data?.message)
                       setTimeout(() => {
                        //  window.location.href = '/follow-ups'
                        router.push('/follow-ups')
                       },1000);
                     }else{
                       toast.error(res?.data?.message)
                     }
            }).catch((err) => {
              console.error(err);
              toast.error(err.message)
            });
}

  // Static data for Excel
  const staticData = [
    { name: "John",father_name: "Doe", mobile: "1234567890", address: "123 Street Name, City" },
    { name: "Jane",father_name: "Doe", mobile: "0987654321", address: "456 Another St, Town" },
    { name: "Sam",father_name: "Doe", mobile: "1122334455", address: "789 Last St, Village" },
  ];

  // Function to handle Excel download
  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("FollowUp Data");

    // Define columns (headers)
    worksheet.columns = [
      { header: "name", key: "name"},
      { header: "father_name", key: "father_name"},
      { header: "mobile", key: "mobile"},
      { header: "address", key: "address"}
    ];

    // Add rows with data
    staticData.forEach((data) => {
      worksheet.addRow(data);
    });

    // Generate and download the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "FollowUp_Template.xlsx";
    link.click();
  };

  return (
       <Layout>
    
     
          <div className="emp_dash">
            <div className="page_manus">
              <ul className="text-center mb-2">
                <li className="nav-item">
                  <a href="index.html" className="deactive-link">
                    Dashboard
                  </a>{" "}
                  <span className="active-link">/ Follow -Up</span>
                </li>
              </ul>
              <div className="page_heading display">
                <h4 className="pb-3">Import Excel</h4>
              </div>
            </div>

            <div className="apply_application d-flex justify-content-end">
              <p
                style={{
                  color: "red",
                  margin: "0",
                  maxWidth: "41%",
                  wordBreak: "break-word",
                }}
              >
                <strong>Note:</strong> This template must be used to upload the FollowUp details.  
                Please download it, update the info, and upload below.
              </p>
              <button
                className="btn comman_btn ms-3"
                onClick={handleDownloadExcel}  // Call the download function
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "5px 15px",
                  borderRadius: "5px",
                  fontSize: "14px",
                  width: "auto",
                }}
              >
                <i className="fa fa-plus me-2" />
                Download Excel Template
              </button>
            </div>

            <div className="apply_application_main mt-4">
              <form  onSubmit={handleSubmitCustom}>
                <div className="row g-3 g-xl-5 g-xxl-5">
                  <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 leave_type">
                    <label htmlFor="name" className="form-label">Choose Excel</label>
                    <input type="file" className="form-control" id="name"
                    required
                    accept=".xlsx"
                    onChange={(e) => {
                        importExcel(e.target.files[0]);
                    }}
                    
                    />
                  </div>

                  <div className="col-lg-12">
                    <div className="btn_block">
                      <button type="button" onClick={() => router.push('/follow-ups')} className="cancel-btn btn me-3">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="Submit_btn btn comman_btn"
                      >
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

export default ImportExcel;
