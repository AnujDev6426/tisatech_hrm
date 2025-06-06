import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";


export const MoneyFormat = (number) => {
  const num = Number(number);
  return num.toLocaleString("en-IN");
}

export const renderFormData = (values) => {
  var formData = new FormData();
  Object.keys(values).map(function (key) {
    formData.append(key, values[key])
  });
  return formData
}

export const setItem = (key, value) => {
  secureLocalStorage.setItem(key, JSON.stringify((value)));
}

export const getItem = (key) => {
  const val = secureLocalStorage.getItem(key);
  return JSON.parse(val)
}

export const removeItem = (key) => {
  return secureLocalStorage.removeItem(key);
}

export const clearStorage = () => {
  secureLocalStorage.clear();
}


export const catchResponse =(key)=>{
  if(key?.response?.status == "401"){
    toast.error(key?.response?.data?.message)
    secureLocalStorage.clear()
    window.location.href='/login'
    // window.location.reload()

  }else{
    toast.error(key?.response?.data?.message)  
  }
}

// export const getToken =()=>{
//  return  useSelector((state) =>state?.userDetails?.accessToken);
// }