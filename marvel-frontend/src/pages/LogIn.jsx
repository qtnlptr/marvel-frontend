import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const Login = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const data = {
    username: username,
    password: password,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const serverResponse = await axios.post(
        `http://localhost:3000/user/login`,
        data
      );
      if (serverResponse.data.token) {
        const token = serverResponse.data.token;
        Cookies.set("token", token, { expires: 180 });
        setIsLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="signup">
      <h1>Log in</h1>
      <p>Save your favorites comics and characters.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          required
        />
        <button>Log In</button>
      </form>
      <Link to="/signup">
        <p className="redirect">Don't have an account? Sign up</p>
      </Link>
    </main>
  );
};

export default Login;
