import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom imports
import { REACT_APP_API_BASE } from "../config/Apiconfig";
import { catchResponse, setItem } from "@/utils/Helper";

export default function Home() {
  // Local state for email and password input
  const [sendData, setSendData] = useState({ email: "", password: "" });

  // State to track "Remember Me" checkbox
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();

  // Load saved credentials from cookies on first render
  useEffect(() => {
    const savedEmail = Cookies.get("email");
    const savedPassword = Cookies.get("password");

    if (savedEmail && savedPassword) {
      setSendData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  // Handle form field input changes
  const handleInputData = (e) => {
    const { name, value } = e.target;
    setSendData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login button click
  const handleLogin = () => {

    // console.log(sendData, '-------------------<><><>')
    const body = {
      login_id: sendData?.email,
      password: sendData?.password,
      type: "email",
    };

    axios
      .post(`${REACT_APP_API_BASE}login`, body)
      .then((res) => {
        if (res.data.status) {

          // console.log(res)
          // Save token and user ID to local storage
          setItem("access_token", res?.data?.access_token);
          setItem("admin", res?.data?.user_id);

          // Save login info to cookies if "Remember Me" is checked
          if (rememberMe) {
            Cookies.set("email", sendData.email, { expires: 7 });
            Cookies.set("password", sendData.password, { expires: 7 });
          } else {
            Cookies.remove("email");
            Cookies.remove("password");
          }

          // Redirect to dashboard
          router.push("/dashboard");
        } else {

          toast.error("Login failed. Please try again.");
        }
      })
      .catch((err) => {
        // console.log(err)
        catchResponse(err); // handle error using utility
      });
  };

  return (
    <>
      <Head>
        <title>Employee Login</title>
        <meta name="description" content="Login to employee dashboard" />
      </Head>

      <section className="login_page" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <div className="container h-100 d-flex align-items-center justify-content-center">
          <div className="row w-100 shadow" style={{ maxWidth: "900px", backgroundColor:'rgba(179, 179, 179, 0.25)', backdropFilter:'blur(10px)',borderRadius:'25px'  }}>
            {/* Left Branding Section */}
            <div className="col-md-6 p-5 d-flex flex-column justify-content-center align-items-center">
              <img
                src="/assets/images/tisatech_logo.png"
                alt="Logo"
                className="img-fluid mb-3"
                style={{ maxWidth: "300px" }}
              />
              <h4 className="text-center">Employee Login</h4>
              <p className="text-muted text-center">
                Hey, enter your details to log in to your account
              </p>
            </div>

            {/* Right Form Section */}
            <div className="col-md-6 p-5">
              <form>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    E-Mail Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={sendData.email}
                    onChange={handleInputData}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password-field" className="form-label">
                    Enter Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password-field"
                    name="password"
                    value={sendData.password}
                    onChange={handleInputData}
                    required
                  />
                </div>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label className="form-check-label" htmlFor="remember-me">
                    Remember Me
                  </label>
                </div>

                <div className="mb-3 text-end">
                  <a href="#" className="text-decoration-none">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={handleLogin}
                  style={{ borderRadius: '20px' }}
                  
                >
                  Log in
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Toast Container for alerts */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />
      </section>
    </>
  );
}
