import { toast } from "react-toastify";
import moment from "moment";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
let EmailRegx = /\S+@\S+\.\S+/;

class FormHelper {
  IsEmpty(value) {
    return value.length === 0;
  }

  IsEmail(value) {
    return !EmailRegx.test(value);
  }

  getToken() {
    const token = Cookies.get("u__token");
    return !!token;
  }

  ErrorToast(msg) {
    toast.error(msg);
  }
  SuccessToast(msg) {
    toast.success(msg);
  }
  toNumber(value) {
    return parseFloat(value);
  }

  fixNumber(value) {
    if (value > 0) {
      return value;
    } else {
      return 0;
    }
  }
  getBase64(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  }

  setEmail(email) {
    sessionStorage.setItem("email", email);
  }

  getEmail() {
    return sessionStorage.getItem("email");
  }

  unAuthorize(code) {
    if (code === 401) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  formatDate(date) {
    const formattedDate = moment(date).format("DD-MM-YYYY");
    return formattedDate;
  }

  DeleteAlert(apiFun, id) {
    return MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      // iconHtml: '<i class="ri-error-warning-line icon__inner"></i>',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        return apiFun(id).then((result) => {
          return result;
        });
      }
    });
  }

  DeleteAlertFile(apiFun, id, filename) {
    return MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      // iconHtml: '<i class="ri-error-warning-line icon__inner"></i>',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        return apiFun(id, filename).then((result) => {
          return result;
        });
      }
    });
  }
}
export const {
  IsEmpty,
  IsEmail,
  getToken,
  ErrorToast,
  SuccessToast,
  getBase64,
  toNumber,
  fixNumber,
  setEmail,
  getEmail,
  unAuthorize,
  DeleteAlert,
  DeleteAlertFile,
  formatDate,
} = new FormHelper();