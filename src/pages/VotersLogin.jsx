import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import axios from "axios";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const VoterLogin = () => {
  const [STUDENTID, setSTUDENTID] = useState("");
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/auth/voter/login", {
        STUDENTID,
        OTP,
      });
      const { token,  } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", "voter");
      setIsLoggedIn(true);
      message.success("Login successful");
      navigate("/candidates");
    } catch (error) {
      console.error("Login error:", error);
      message.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full flex flex-col items-center">
        <h2 className="text-2xl mb-4">Voter Login</h2>
        <Form layout="vertical" className="w-58" onFinish={handleLogin}>
          <Form.Item
            label="Student ID"
            name="STUDENTID"
            rules={[
              { required: true, message: "Please enter your Student ID" },
            ]}
          >
            <Input
              value={STUDENTID}
              onChange={(e) => setSTUDENTID(e.target.value)}
              placeholder="Enter student ID"
            />
          </Form.Item>
          <Form.Item
            label="OTP"
            name="OTP"
            rules={[{ required: true, message: "Please enter the OTP" }]}
          >
            <Input
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              placeholder="Enter OTP"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default VoterLogin;
