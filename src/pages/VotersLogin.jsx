// import { useState } from "react";
// import { Button, Form, Input, message } from "antd";
// import { useAppContext } from "../context/AppProvider";

// const VoterLogin = () => {
//   const [studentID, setStudentID] = useState("");
//   const [otp, setOtp] = useState("");
//   const { voterRegister } = useAppContext();

//   const handleLogin = () => {
//     const trimmedStudentID = studentID.trim();
//     const trimmedOtp = otp.trim();

//     const voter = voterRegister.find(
//       (voter) =>
//         String(voter["STUDENT ID"]).trim().toLowerCase() ===
//         trimmedStudentID.toLowerCase()
//     );

//     if (!voter) {
//       message.error("Invalid Student ID.");
//       return;
//     }

//     if (voter.otp !== trimmedOtp) {
//       message.error("Invalid OTP.");
//       return;
//     }

//     if (voter.used) {
//       message.error("This OTP has already been used.");
//       return;
//     }

//     message.success("Login successful.");
//     // Mark the OTP as used
//     const updatedVoterRegister = voterRegister.map((v) =>
//       v["STUDENT ID"] === voter["STUDENT ID"] ? { ...v, used: true } : v
//     );
//     localStorage.setItem("voterRegister", JSON.stringify(updatedVoterRegister));
//     // Implement further actions after login
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="bg-white p-8 rounded shadow-lg max-w-md w-full flex flex-col items-center">
//         <h2 className="text-2xl mb-4">Voter Login</h2>
//         <Form layout="vertical" className="w-full flex flex-col items-center">
//           <Form.Item label="Student ID">
//             <Input
//               value={studentID}
//               onChange={(e) => setStudentID(e.target.value)}
//               placeholder="Enter Student ID"
//             />
//           </Form.Item>
//           <Form.Item label="OTP">
//             <Input
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//             />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" onClick={handleLogin}>
//               Login
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default VoterLogin;
// import { useState } from "react";
// import { Button, Form, Input, message } from "antd";

// const VoterLogin = () => {
//   const [studentID, setStudentID] = useState("");
//   const [otp, setOtp] = useState("");

//   const handleLogin = () => {
//     const storedRegister =
//       JSON.parse(localStorage.getItem("voterRegister")) || [];
//     const voter = storedRegister.find(
//       (voter) =>
//         String(voter["STUDENT ID"]).trim().toLowerCase() ===
//         studentID.trim().toLowerCase()
//     );

//     if (voter && voter.otp === otp) {
//       message.success("Login successful");
//     } else {
//       message.error("Invalid student ID or OTP");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="bg-white p-8 rounded shadow-lg max-w-md w-full flex flex-col items-center">
//         <h2 className="text-2xl mb-4">Voter Login</h2>
//         <Form layout="vertical" className="w-58 ">
//           <Form.Item label="Student ID">
//             <Input
//               value={studentID}
//               onChange={(e) => setStudentID(e.target.value)}
//               placeholder="Enter student ID"
//             />
//           </Form.Item>
//           <Form.Item label="OTP">
//             <Input
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//             />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary"
//               className="w-full"

//               onClick={handleLogin}>
//               Login
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default VoterLogin;
import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import axios from "axios";

const VoterLogin = () => {
  const [STUDENTID, setSTUDENTID] = useState("");
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  const handleLogin = async () => {
    try {
      const formData = {
        STUDENTID,
        OTP,
      };
      const response = await axios.post(
        "http://localhost:3000/api/auth/voter/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      localStorage.setItem("voterToken", data.token);
      setIsLoggedIn(true);
      message.success("Login successful");
      navigate("/candidates");
    } catch (error) {
      console.log(error);
      message.error("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full flex flex-col items-center">
        <h2 className="text-2xl mb-4">Voter Login</h2>
        <Form layout="vertical" className="w-58 ">
          <Form.Item label="Student ID">
            <Input
              value={STUDENTID}
              onChange={(e) => setSTUDENTID(e.target.value)}
              placeholder="Enter student ID"
            />
          </Form.Item>
          <Form.Item label="OTP">
            <Input
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              placeholder="Enter OTP"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="w-full" onClick={handleLogin}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default VoterLogin;
