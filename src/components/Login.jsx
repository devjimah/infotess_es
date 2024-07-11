import { useNavigate } from "react-router-dom";
import { Button, Input, Form, message } from "antd";
import { useAppContext } from "../context/AppProvider";
import "tailwindcss/tailwind.css";
import axios from "axios";
import { useState } from "react";

function Login() {
  const { setIsLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = () => {
    setUserName(event.target.value);
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    try {
      const formData = {userName, password}
      const response = await fetch(
        "https://es-api.onrender.com/api/auth/super-admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // mode: "no-cors",
          body: formData,
        }
      );
      const data = response.data;
      console.log(data);
      const token = data.token;
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      message.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
    // const { name, password } = values;
    // if (name === "admin" && password === "password") {
    //   localStorage.setItem("isLoggedIn", "true");
    //   setIsLoggedIn(true);
    //   message.success("Login successful");
    //   navigate("/dashboard");
    // } else {
    //   message.error("Invalid credentials");
    // }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full flex flex-col items-center">
        <h2 className="text-xl font-bold uppercase mb-4">hod/patron Login</h2>
        <Form
          name="login"
          onFinish={handleLogin}
          className="w-full flex flex-col items-center"
        >
          <Form.Item
            name="userName"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input
              type="text"
              name="userName"
              value={userName}
              onChange={handleChange}
              placeholder="Name"
              className="w-48 py-2 border-b-2 border-blue-950 focus:outline-none focus:border-b-2 focus:border-blue-950"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Password"
              className="w-48 py-2 border-b-2 border-blue-950 focus:outline-none focus:border-b-2 focus:border-blue-950"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-48">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
