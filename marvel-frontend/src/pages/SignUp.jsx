import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignUp = ({ setIsLoggedIn, isLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = {
        username: username,
        password: password,
      };

      const serverRequest = await axios.post(
        `http://localhost:3000/signup`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (serverRequest.data.token) {
        console.log(serverRequest.data.token);
        const token = serverRequest.data.token;
        Cookies.set("token", token, { expires: 180 });
        setIsLoggedIn(true);
        navigate("/favorites");
      }
      console.log(data);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <main className="signup">
      <h1>Sign up</h1>
      <p>Save your favorites comics and characters.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter an unique username"
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
        <button>Sign Up</button>
      </form>
      <Link to="/login">
        <p className="redirect">Already have an account? Sign-up!</p>
      </Link>
    </main>
  );
};

export default SignUp;
