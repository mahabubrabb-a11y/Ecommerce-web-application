import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../helper/helper";
import userStore from "../store/userStore";

const PrivateRoute = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  let { userVerifyRequest, userRequest } = userStore();
  useEffect(() => {
    (async () => {
      try {
        await userVerifyRequest();
        await userRequest();
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
  }, [userRequest, userVerifyRequest]);

  if (loading) {
    return <></>;
  }

  return isLogin ? children : <Navigate to='/login' />;
};

export default PrivateRoute;
