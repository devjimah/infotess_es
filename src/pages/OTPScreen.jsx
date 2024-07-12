import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";

const OTPScreen = () => {
  const [studentID, setStudentID] = useState("");
  const [otp, setOtp] = useState(null);
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);

  const [isOfficialLoggedIn, setIsOfficialLoggedIn] = useState(false);
  const [officialID, setOfficialID] = useState("");
  const [officialPassword, setOfficialPassword] = useState("");

  const generateAlphanumericOTP = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const handleOfficialLogin = async () => {
    // const savedOfficials = JSON.parse(localStorage.getItem("officials")) || [];
    // const official = savedOfficials.find(
    //   (official) =>
    //     official.studentID === officialID &&
    //     official.password === officialPassword
    // );

    // if (official) {
    //   if (official.accessGranted) {
    //     setIsOfficialLoggedIn(true);
    //     localStorage.setItem("loggedOfficial", JSON.stringify(official));
    //     message.success("Login successful.");
    //   } else {
    //     message.error(
    //       "Access denied. You do not have the required permissions."
    //     );
    //   }
    // } else {
    //   message.error("Invalid official ID or password.");
    // }

    try {
      const formData = { STUDENTID: officialID, password: officialPassword };
      const response = await axios.post(
        "http://localhost:3000/api/auth/official/login",
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
      localStorage.setItem("officialToken", token);

      message.success("Login successful");
      setIsOfficialLoggedIn(true);
    } catch (error) {
      console.log(error);
      message.error("Login failed");
    }
  };

  const generateOtp = () => {
    const storedRegister =
      JSON.parse(localStorage.getItem("voterRegister")) || [];
    const voterIndex = storedRegister.findIndex(
      (voter) =>
        String(voter["STUDENT ID"]).trim().toLowerCase() ===
        studentID.trim().toLowerCase()
    );

    if (voterIndex !== -1) {
      const voter = storedRegister[voterIndex];
      if (voter.otp) {
        // OTP already exists for this student ID
        setOtp(voter.otp);
        message.info("OTP already exists for this Student ID.");
      } else {
        // Generate new OTP
        const generatedOtp = generateAlphanumericOTP(5);
        setOtp(generatedOtp);
        voter.otp = generatedOtp;
        storedRegister[voterIndex] = voter;
        localStorage.setItem("voterRegister", JSON.stringify(storedRegister));
        message.success("OTP generated successfully.");
      }
      setIsOtpGenerated(true);
    } else {
      message.error("Student ID not found in the register.");
      setIsOtpGenerated(false);
    }
  };

  return !isOfficialLoggedIn ? (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full flex flex-col items-center">
        <h2 className="text-2xl mb-4">Official Login</h2>
        <Form layout="vertical" className="w-full flex flex-col items-center">
          <Form.Item label="Official ID">
            <Input
              value={officialID}
              onChange={(e) => setOfficialID(e.target.value)}
              placeholder="Enter Official ID"
            />
          </Form.Item>
          <Form.Item label="Password">
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
  ) : (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full flex flex-col items-center">
        <h2 className="text-2xl mb-4">Generate OTP</h2>
        <Form layout="vertical" className="w-58">
          <Form.Item label="Student ID">
            <Input
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
              placeholder="Enter student ID"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="w-full" onClick={generateOtp}>
              Generate OTP
            </Button>
          </Form.Item>
        </Form>
        {isOtpGenerated && (
          <div className="mt-4">
            <h3>Your OTP is: {otp}</h3>
            <p>Please use this OTP to login.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPScreen;
