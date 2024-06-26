import axios from "axios";
import * as jwt_decode from "jwt-decode";
import { createContext, useContext } from "react";
import { ApiConfig } from "../config/ApiConfig";

const token = localStorage.getItem("authToken");

export const isTokenExpired = (token) => {
  try {
    const { exp } = jwt_decode.jwtDecode(token);
    if (exp < Date.now() / 1000) {
      return true;
    }
    return false;
  } catch (e) {
    return true;
  }
};

export const getUsernameFromToken = (token) => {
  try {
    const { sub } = jwt_decode.jwtDecode(token);
    return sub;
  } catch (e) {
    return null;
  }
};

export const isRegisterExpired = (token) => {
  try {
    const { exp } = jwt_decode.jwtDecode(token);
    if (exp + 2700 < Date.now() / 1000) {
      return true;
    }
    return false;
  } catch (e) {
    return true;
  }
};


if (!token || isTokenExpired(token) || !localStorage.getItem("user") || localStorage.getItem("user") === null) {
  sessionStorage.removeItem("cart");
  localStorage.removeItem("authToken");
  localStorage.removeItem("registerToken");
  localStorage.removeItem("email-validated");
  localStorage.removeItem("user");
} else {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const isAuthenticated = () => {
  return axios.defaults.headers.common["Authorization"];
};

export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.role === "ADMIN" && isAuthenticated() && getUsernameFromToken(axios.defaults.headers.common["Authorization"]) === user.email;
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const user = localStorage.getItem("user");

  const setAuthHeader = (token) => axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const requestLogin = ({data, then, on_error, final}) => {
    axios.post(ApiConfig.auth.login, data)
    .then((response) => {
      const { token } = response.data;

      requestLogout();
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("authToken", token);
      if(then){
        then(response);
      }
    })
    .catch((error) => {if(on_error) on_error(error)})
    .finally(() => {if (final) final()});
  };

  const requestRegister = ({data, then, on_error, final}) => {
    axios
      .post(ApiConfig.auth.register, data)
      .then((response) => {

        localStorage.setItem("registerToken", response.data.token);
        if(then){
          then(response);
        }
      })
      .catch((error) => {if(on_error) on_error(error)})
      .finally(() => {if (final) final()});
  }

  const requestVerify = ({data, then, on_error, final}) => {
    axios
      .post(ApiConfig.auth.verify, data)
      .then((response) => {
        localStorage.setItem("registerToken", response.data.token);
        
        if(then){
          then(response);
        }
      })
      .catch((error) => {
        localStorage.removeItem("registerToken");
        if(on_error) on_error(error)
      })
      .finally(() => {if (final) final()});
  }

  const requestComplete = ({data, then, on_error, final}) => {
    axios
      .post(ApiConfig.auth.complete, data)
      .then((response) => {

        requestLogout();

        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        if(then){
          then(response);
        }
      })
      .catch((error) => { if(on_error) on_error(error)})
      .finally(() => {if (final) final()});
  }

  const requestLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("registerToken");
    localStorage.removeItem("email-validated");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedAddress");
    localStorage.removeItem("orderId");
    sessionStorage.removeItem("cart");
    delete axios.defaults.headers.common["Authorization"];
  };

  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    return axios(url, { ...options, headers });
  };

  const authFetchFile = async (url, options = {}) => {
    const headers = {
      ...options.headers,
    };

    if (options.data instanceof FormData) {
      delete headers['Content-Type'];
    }

    return axios(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider
      value={{
        requestLogin,
        requestRegister,
        requestVerify,
        requestComplete,
        requestLogout,
        isAuthenticated,
        setAuthHeader,
        authFetch,
        isTokenExpired,
        authFetchFile,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
