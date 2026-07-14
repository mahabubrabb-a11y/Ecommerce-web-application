import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../helper/Helper";
import adminStore from "../store/adminStore";
const PrivateRoute = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  let { adminVerifyRequest, adminRequest} = adminStore();
  useEffect(() => {
    (async () => {
      try {
        await adminVerifyRequest();
        await adminRequest();
        let result = getToken();
        
        console.log(result);

        if (result) {
          setIsLogin(true);
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        console.log(error);

        setIsLogin(false);
      } finally {
        setLoading(false); // Set loading to false after verification
      }
    })();
  }, []);

  if (loading) {
    return <></>;
  }

  return isLogin ? children : <Navigate to='/login' />;
};

export default PrivateRoute;