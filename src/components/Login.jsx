import { useNavigate } from "react-router-dom";
import { Button, Input, Form, message, Spin } from "antd";
import { useAppContext } from "../context/AppProvider";
import { LoadingOutlined } from "@ant-design/icons";
import "tailwindcss/tailwind.css";
import { useState } from "react";
import axios from "axios";

function Login() {
  const { setIsLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const formData = { userName, password };
      const response = await axios.post(
        "http://localhost:3000/api/auth/super-admin/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
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
      message.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full flex flex-col items-center">
        <h2 className="text-xl font-bold uppercase mb-4">hod/patron Login</h2>
        <Spin
          spinning={loading}
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 48,
              }}
              spin
            />
          }
        >
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
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Name"
                className="w-48 py-2 border-b-2 border-blue-950 focus:outline-none focus:border-b-2 focus:border-blue-950"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
        </Spin>
      </div>
    </div>
  );
}

export default Login;
