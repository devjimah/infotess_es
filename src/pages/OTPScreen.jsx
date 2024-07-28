import { useState, useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import PropTypes from "prop-types";

const OfficialLogin = ({ onLogin }) => {
  const [officialId, setOfficialId] = useState("");
  const [officialPassword, setOfficialPassword] = useState("");

  const handleOfficialLogin = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/official/login`,
        { STUDENTID: officialId, password: officialPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      const { token } = response.data;
      localStorage.setItem("officialToken", token);
      message.success("Login successful");
      onLogin();
    } catch (error) {
      console.error("Login error:", error);
      message.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full flex flex-col items-center">
        <h2 className="text-2xl mb-4">Official Login</h2>
        <Form layout="vertical" className="w-full flex flex-col items-center">
          <Form.Item
            label="Official ID"
            name="officialId"
            rules={[
              { required: true, message: "Please enter your Official ID" },
            ]}
          >
            <Input
              value={officialId}
              onChange={(e) => setOfficialId(e.target.value)}
              placeholder="Enter Official ID"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              value={officialPassword}
              onChange={(e) => setOfficialPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              className="w-full"
              onClick={handleOfficialLogin}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

OfficialLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

const OTPGenerator = () => {
  const [studentId, setStudentId] = useState("");
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);
  const [voterOTP, setVoterOTP] = useState("");

  const generateOTP = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register/voter`,
        { STUDENTID: studentId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("officialToken")}`,
          },
        }
      );

      if (response.data.message === "OTP already generated") {
        message.warning(
          "An OTP has already been generated for this Student ID."
        );
        setIsOtpGenerated(false);
        setVoterOTP("");
      } else {
        const { updatedVoter } = response.data;
        setVoterOTP(updatedVoter.OTP);
        setIsOtpGenerated(true);
        message.success("OTP generated successfully.");
      }
    } catch (error) {
      console.error("OTP generation error:", error);
      setIsOtpGenerated(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("OTP generation failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full flex flex-col items-center">
        <h2 className="text-2xl mb-4">Generate OTP</h2>
        <Form layout="vertical" className="w-58" onFinish={generateOTP}>
          <Form.Item
            label="Student ID"
            name="STUDENTID"
            rules={[{ required: true, message: "Please enter the Student ID" }]}
          >
            <Input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter student ID"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Generate OTP
            </Button>
          </Form.Item>
        </Form>
        {isOtpGenerated && (
          <div className="mt-4">
            <h3>
              Your OTP is: <span className="font-bold">{voterOTP}</span>
            </h3>
            <p>Please use this OTP to login. It can only be used once.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const OTPScreen = () => {
  const [isOfficialLoggedIn, setIsOfficialLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("officialToken");
    if (token) {
      // Optionally, you could verify the token with the backend here
      setIsOfficialLoggedIn(true);
    }
  }, []);

  return isOfficialLoggedIn ? (
    <OTPGenerator />
  ) : (
    <OfficialLogin onLogin={() => setIsOfficialLoggedIn(true)} />
  );
};

export default OTPScreen;
