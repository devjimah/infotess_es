import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";

const OTPGenerator = () => {
  const [studentId, setStudentId] = useState("");
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);
  const [voterInfo, setVoterInfo] = useState(null);
  const [generatedOTP, setGeneratedOTP] = useState("");

  const generateSimpleOTP = (studentId) => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let otp = "";
    let seed = studentId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    for (let i = 0; i < 6; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      otp += chars[seed % chars.length];
    }

    return otp;
  };

  const generateOTP = async () => {
    try {
      const otp = generateSimpleOTP(studentId);
      setGeneratedOTP(otp);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register/voter`,
        { STUDENTID: studentId, OTP: otp },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("officialToken")}`,
          },
        }
      );

      console.log("Full response:", response.data);

      if (response.data.message === "OTP Generated successfully") {
        const updatedVoter = response.data.updatedVoter;
        // Use the OTP we generated, not the one from the server
        updatedVoter.OTP = otp;
        setVoterInfo(updatedVoter);
        setIsOtpGenerated(true);
        message.success("OTP generated successfully.");
      } else {
        throw new Error(response.data.message || "Unexpected response");
      }
    } catch (error) {
      console.error("OTP generation error:", error);
      setIsOtpGenerated(false);
      setVoterInfo(null);
      setGeneratedOTP("");
      if (error.response?.data?.message) {
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
        {generatedOTP && (
          <div className="mt-4 text-center">
            <h3 className="font-bold">Generated OTP</h3>
            <p className="mt-2 text-lg">
              <strong>OTP: </strong>
              <span className="font-bold text-blue-600">{generatedOTP}</span>
            </p>
          </div>
        )}
        {isOtpGenerated && voterInfo && (
          <div className="mt-4 text-center">
            <h3 className="font-bold">Voter Information</h3>
            <p>
              Name:{" "}
              {`${voterInfo.FIRSTNAME.trim()}`.trim()}
            </p>
          
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPGenerator;
