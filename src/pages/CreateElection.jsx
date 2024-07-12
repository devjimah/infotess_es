// import { useState, useEffect, useRef } from "react";
// import {
//   Button,
//   Form,
//   Input,
//   DatePicker,
//   message,
//   Steps,
//   List,
//   Modal,
//   Table,
// } from "antd";
// import moment from "moment";
// import axios from "axios";

// const { Step } = Steps;

// function CreateElection() {

//   const [fullName, setFullName] = useState("");
//   const [STUDENTID, setSTUDENTID] = useState(null);
//   const [password, setPassword] = useState("");
//   const [officials, setOfficials] = useState([])
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isRegisterVisible, setIsRegisterVisible] = useState(false)
//   const [isModalVisible, setIsModalVisible] = useState(false)
//   const [title, setTitle] = useState("");
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);
//   const [elections, setElections] = useState([]);
//   const [voters, setVoters] = useState([])

//   const API_BASE_URL = process.env.API_BASE_URL;

//   const handleNextStep = () => {
//     setCurrentStep(currentStep + 1);
//   };

//   const handlePrevStep = () => {
//     setCurrentStep(currentStep - 1);
//   };

//   const handleCreateElection = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = {
//         title: electionTitle,
//         startDate: electionStartTime.toISOString(),
//         endDate: electionEndTime.toISOString(),
//       };

//       const response = await axios.post(`${API_BASE_URL}/election`, formData, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       setElections([...elections, response.data]);
//       setTitle("");
//       setStartTime(null);
//       setEndTime(null);
//       message.success("Election created successfully");
//     } catch (error) {
//       message.error("An error occurred. Please try again.");
//     }
//   };

//   const handleRegisterOfficial = async () => {
//     try {
//       if (officials.length >= 2) {
//         message.error("Only two officials can be created")
//         return
//       }

//       if (!fullName || !STUDENTID || !password) {
//         message.error("Please fill all fields")
//         return
//       }

//       const formData = {
//         fullName,
//         STUDENTID,
//         password
//       }

//       await axios.post("http://localhost:3000/api/auth/register/official", formData, {
//         headers: {
//           "Content Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`
//         }
//       });

//       // refresh officials
//       const newOfficials = await axios.get("http://localhost:3000/api/official", {
//         headers: {
//           "Content Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`
//         }
//       });

//       setOfficials([...officials, newOfficials])
//       setFullName("");
//       setSTUDENTID(null);
//       setPassword("");

//       message.success("Official registered successfully");

//       if (officials.length + 1 >= 2) {
//         handleNextStep()
//       }
//     } catch (error) {
//       message.error("An error occured, please try again", error)
//     }
//   }

//   const handleExtendElection = async () => {
//     try {
//       const electionId = elections._id;
//       const formData = {
//         endTime: newEndTime.toISOString(),
//       };

//       await axios.put(
//         `http://localhost:3000/api/election/${electionId}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + localStorage.getItem("token"),
//           },
//         }
//       );

//       // Refresh elections
//       const response = await axios.get("http://localhost:3000/api/election", {
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("token"),
//         },
//       });

//       setElections(response.data.elections);
//       message.success("Election extended successfully");
//       setIsModalVisible(false);
//     } catch (error) {
//       message.error("An error occurred. Please try again.");
//     }

//     const handleGetVotersRegister = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/voter`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })
//         setVoters(response.data.voters)

//         setIsRegisterVisible(true)

//       } catch (error) {
//         message.error("An error occurred. Please try again.");
//       }
//     }

//     const steps = [
//       {
//         title: "Create Officials",
//         content: (
//           <Form
//             layout="vertical"
//             className="grid grid-cols-4  mt-4 items-center justify-between space-x-3"
//           >
//             <Form.Item
//               label="Full Name"
//               rules={[{ required: true, message: "Please enter Full Name." }]}
//             >
//               <Input
//                 className="w-52"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 placeholder="Enter Full Name"
//               />
//             </Form.Item>
//             <Form.Item
//               label="Student ID"
//               rules={[{ required: true, message: "Please enter Student ID." }]}
//             >
//               <Input
//                 className="w-52"
//                 value={STUDENTID}
//                 onChange={(e) => setSTUDENTID(e.target.value)}
//                 placeholder="Enter Student ID"
//               />
//             </Form.Item>
//             <Form.Item
//               label="Password"
//               rules={[{ required: true, message: "Please enter Password." }]}
//             >
//               <Input.Password
//                 className="w-52"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter Password"
//               />
//             </Form.Item>
//             <Button
//               type="primary"
//               className="w-52"
//               onClick={handleRegisterOfficial}
//               disabled={!fullName || !STUDENTID || !password}
//             >
//               Create Official
//             </Button>
//           </Form>
//         ),
//       },
//       {
//         title: "Voter Register",
//         content: (
//           <div className="flex mt-4 items-center space-x-4">

//             <Button onClick={handleGetVotersRegister}>
//               View Register
//             </Button>
//           </div>
//         ),
//       },
//       {
//         title: "Create Election",
//         content: (
//           <Form
//             layout="vertical"
//             className="grid grid-cols-4 mt-4 items-center justify-between space-x-3"
//           >
//             <Form.Item label="Title">
//               <Input
//                 className="w-52"
//                 placeholder="Enter Election Title"
//                 value={
//                   title
//                 }
//                 onChange={
//                   (e) => setTitle(e.target.value)
//                 }
//               />
//             </Form.Item>
//             <Form.Item label="Start Time">
//               <DatePicker
//                 showTime={{ format: "HH:mm" }}
//                 format="YYYY-MM-DD HH:mm"
//                 value={
//                   startTime
//                 }
//                 onChange={
//                   (e) => setStartTime(e.target.value)
//                 }
//               />
//             </Form.Item>
//             <Form.Item label="End Time">
//               <DatePicker
//                 showTime={{ format: "HH:mm" }}
//                 format="YYYY-MM-DD HH:mm"
//                 value={
//                   endTime
//                 }
//                 onChange={
//                   (e) => setEndTime(e.target.value)

//                 }
//               />
//             </Form.Item>
//             <Button
//               type="primary"
//               onClick={
//                 handleCreateElection
//               }
//               disabled={!title || !startTime || !endTime}
//             >
//               Create Election
//             </Button>
//           </Form>
//         ),
//       },
//       {
//         title: "Elections",
//         content: (
//           <div>
//             <h3>Created Elections</h3>
//             <List
//               itemLayout="horizontal"
//               dataSource={
//                 elections
//               }
//               renderItem={(election, index) => (
//                 <List.Item key={election._id}>
//                   <List.Item.Meta
//                     title={election.title}
//                     description={`Start Time: ${moment(election.startTime).format(
//                       "YYYY-MM-DD HH:mm"
//                     )} | End Time: ${moment(election.endTime).format(
//                       "YYYY-MM-DD HH:mm"
//                     )} | Status: ${election.status}`}
//                   />
//                   <Button type="default" onClick={hand

//                   }>
//                     Open Election
//                   </Button>
//                   <Button type="default" onClick={
//                     handleExtendElection
//                    }>
//                     Extend Time
//                   </Button>
//                   <Button
//                     type="default"
//                     style={{
//                       backgroundColor:
//                         election.status === "scheduled"
//                           ? "red"
//                           : election.status === "active"
//                             ? "green"
//                             : "orange",
//                       color: "white",
//                     }}
//                   >
//                     {election.status.charAt(0).toUpperCase() +
//                       election.status.slice(1)}
//                   </Button>
//                 </List.Item>
//               )}
//             />
//           </div>
//         ),
//       },
//     ];

//     return (
//       <div>
//         <Steps current={currentStep}>
//           {steps.map((step, index) => (
//             <Step key={index} title={step.title} />
//           ))}
//         </Steps>
//         <div>{steps[currentStep].content}</div>
//         <div className="steps-action space-x-4">
//           {currentStep > 0 && (
//             <Button className="mt-4" onClick={handlePrevStep}>
//               Previous
//             </Button>
//           )}
//           {currentStep < steps.length - 1 && (
//             <Button className="mt-3" type="primary" onClick={handleNextStep}>
//               Next
//             </Button>
//           )}
//         </div>
//         <Modal
//           title="Extend Election Time"
//           visible={isModalVisible}
//           onOk={handleExtendElection}
//           onCancel={handleExtendCancel}
//         >
//           <DatePicker
//             showTime={{ format: "HH:mm" }}
//             format="YYYY-MM-DD HH:mm"
//             value={
//               newEndTime
//              }
//             onChange={ () => setNewEndTime(e.target.value)}
//           />
//         </Modal>
//         <Modal
//           width={1000}
//           title="Voter Register"
//           open={isRegisterVisible}
//           onOk={() => setIsRegisterVisible(false)}
//           onCancel={() => setIsRegisterVisible(false)}
//         >
//           <Table
//             dataSource={voters}
//             rowKey="SN"

//             columns={[
//               { title: "SN", dataIndex: "SN", key: "SN" },
//               { title: "STUDENT ID", dataIndex: "STUDENT ID", key: "STUDENT ID" },
//               { title: "FIRSTNAME", dataIndex: "FIRSTNAME", key: "FIRSTNAME" },
//               { title: "MIDDLENAME", dataIndex: "MIDDLENAME", key: "MIDDLENAME" },
//               { title: "LASTNAME", dataIndex: "LASTNAME", key: "LASTNAME" },
//               { title: "GENDER", dataIndex: "GENDER", key: "GENDER" },
//               { title: "LEVEL", dataIndex: "LEVEL", key: "LEVEL" },
//             ]}
//           />
//         </Modal>
//       </div>
//     );
//   }
// }

// export default CreateElection;

import { useState } from "react";
import {
  Button,
  Form,
  Input,
  DatePicker,
  message,
  Steps,
  List,
  Modal,
  Table,
} from "antd";
import moment from "moment";
import axios from "axios";

const { Step } = Steps;

function CreateElection() {
  const [fullName, setFullName] = useState("");
  const [STUDENTID, setSTUDENTID] = useState(null);
  const [password, setPassword] = useState("");
  const [officials, setOfficials] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [newEndTime, setNewEndTime] = useState(null);
  const [elections, setElections] = useState([]);
  const [voters, setVoters] = useState([]);

  const API_BASE_URL = "http://localhost:3000/api"; // Fix the environment variable access

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
    if (currentStep === 2) {
      fetchElections();
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        title,
        startDate: startTime.toISOString(),
        endDate: endTime.toISOString(),
      };

      const response = await axios.post(`${API_BASE_URL}/election`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setElections([...elections, response.data]);
      setTitle("");
      setStartTime(null);
      setEndTime(null);
      message.success("Election created successfully");
    } catch (error) {
      message.error("An error occurred. Please try again.");
    }
  };

  const handleManualOpenElection = async (election) => {
    try {
      const electionId = election._id; // Fix the access to the election ID
      const formData = {
        status: "active",
      };

      await axios.put(`${API_BASE_URL}/election/${electionId}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Refresh elections
      const response = await axios.get(`${API_BASE_URL}/election`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setElections(response.data.elections);
      message.success("Election opened successfully");
    } catch (error) {
      message.error("An error occurred. Please try again.");
    }
  };

  const handleRegisterOfficial = async () => {
    try {
      if (officials.length >= 2) {
        message.error("Only two officials can be created");
        return;
      }

      if (!fullName || !STUDENTID || !password) {
        message.error("Please fill all fields");
        return;
      }

      const formData = {
        fullName,
        STUDENTID,
        password,
      };

      await axios.post(`${API_BASE_URL}/auth/register/official`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // refresh officials
      const newOfficials = await axios.get(`${API_BASE_URL}/official`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOfficials([...officials, ...newOfficials.data]);
      setFullName("");
      setSTUDENTID(null);
      setPassword("");

      message.success("Official registered successfully");

      if (officials.length + 1 >= 2) {
        handleNextStep();
      }
    } catch (error) {
      message.error("An error occurred, please try again");
    }
  };

  const handleExtendElection = async (election) => {
    try {
      const electionId = election._id; // Fix the access to the election ID
      const formData = {
        endTime: newEndTime.toISOString(),
      };

      await axios.put(`${API_BASE_URL}/election/${electionId}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Refresh elections
      const response = await axios.get(`${API_BASE_URL}/election`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setElections(response.data.elections);
      message.success("Election extended successfully");
      setIsModalVisible(false);
    } catch (error) {
      message.error("An error occurred. Please try again.");
    }
  };

  const handleGetVotersRegister = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/voter");
      setVoters(response.data);

      setIsRegisterVisible(true);
      console.log(response.data);
    } catch (error) {
      message.error("An error occurred. Please try again.");
    }
  };

  const handleExtendCancel = () => {
    setIsModalVisible(false);
  };

  const fetchElections = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/election`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setElections(response.data);
    } catch (error) {
      message.error("An error occurred. Please try again.");
    }
  };

  const steps = [
    {
      title: "Create Officials",
      content: (
        <Form
          layout="vertical"
          className="grid grid-cols-4 mt-4 items-center justify-between space-x-3"
        >
          <Form.Item
            label="Full Name"
            rules={[{ required: true, message: "Please enter Full Name." }]}
          >
            <Input
              className="w-52"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter Full Name"
            />
          </Form.Item>
          <Form.Item
            label="Student ID"
            rules={[{ required: true, message: "Please enter Student ID." }]}
          >
            <Input
              className="w-52"
              value={STUDENTID}
              onChange={(e) => setSTUDENTID(e.target.value)}
              placeholder="Enter Student ID"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            rules={[{ required: true, message: "Please enter Password." }]}
          >
            <Input.Password
              className="w-52"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </Form.Item>
          <Button
            type="primary"
            className="w-52"
            onClick={handleRegisterOfficial}
            disabled={!fullName || !STUDENTID || !password}
          >
            Create Official
          </Button>
        </Form>
      ),
    },
    {
      title: "Voter Register",
      content: (
        <div className="flex mt-4 items-center space-x-4">
          <Button onClick={handleGetVotersRegister}>View Register</Button>
        </div>
      ),
    },
    {
      title: "Create Election",
      content: (
        <Form
          layout="vertical"
          className="grid grid-cols-4 mt-4 items-center justify-between space-x-3"
        >
          <Form.Item label="Title">
            <Input
              className="w-52"
              placeholder="Enter Election Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Start Time">
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              value={startTime ? moment(startTime) : null} // Convert to moment object
              onChange={(date) => setStartTime(date)} // Update setStartTime function
            />
          </Form.Item>
          <Form.Item label="End Time">
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              value={endTime ? moment(endTime) : null} // Convert to moment object
              onChange={(date) => setEndTime(date)} // Update setEndTime function
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={handleCreateElection}
            disabled={!title || !startTime || !endTime}
          >
            Create Election
          </Button>
        </Form>
      ),
    },
    {
      title: "Elections",
      content: (
        <div>
          <h3>Created Elections</h3>
          <List
            itemLayout="horizontal"
            dataSource={elections}
            renderItem={(election, index) => (
              <List.Item key={election._id}>
                <List.Item.Meta
                  title={election.title}
                  description={`Start Time: ${moment(election.startTime).format(
                    "YYYY-MM-DD HH:mm"
                  )} | End Time: ${moment(election.endTime).format(
                    "YYYY-MM-DD HH:mm"
                  )} | Status: ${election.status}`}
                />
                <Button type="default" onClick={handleManualOpenElection}>
                  Open Election
                </Button>
                <Button
                  type="default"
                  onClick={() => {
                    setCurrentStep(index); // Update the current step to the index
                    setIsModalVisible(true); // Show the modal to extend election
                  }}
                >
                  Extend Time
                </Button>
                <Button
                  type="default"
                  style={{
                    backgroundColor:
                      election.status === "scheduled"
                        ? "red"
                        : election.status === "active"
                        ? "green"
                        : "orange",
                    color: "white",
                  }}
                >
                  {election.status.charAt(0).toUpperCase() +
                    election.status.slice(1)}
                </Button>
              </List.Item>
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Steps current={currentStep}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      <div>{steps[currentStep].content}</div>
      <div className="steps-action space-x-4">
        {currentStep > 0 && (
          <Button className="mt-4" onClick={handlePrevStep}>
            Previous
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button className="mt-3" type="primary" onClick={handleNextStep}>
            Next
          </Button>
        )}
      </div>
      <Modal
        title="Extend Election Time"
        visible={isModalVisible}
        onOk={handleExtendElection}
        onCancel={handleExtendCancel}
      >
        <DatePicker
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          value={newEndTime ? moment(newEndTime) : null} // Convert to moment object
          onChange={(date) => setNewEndTime(date)} // Update setNewEndTime function
        />
      </Modal>
      <Modal
        width={1000}
        title="Voter Register"
        open={isRegisterVisible}
        onOk={() => setIsRegisterVisible(false)}
        onCancel={() => setIsRegisterVisible(false)}
      >
        <Table
          dataSource={voters}
          rowKey="SN"
          columns={[
            { title: "SN", dataIndex: "SN", key: "SN" },
            { title: "STUDENTID", dataIndex: "STUDENTID", key: "STUDENTID" },
            { title: "FIRSTNAME", dataIndex: "FIRSTNAME", key: "FIRSTNAME" },
            { title: "MIDDLENAME", dataIndex: "MIDDLENAME", key: "MIDDLENAME" },
            { title: "LASTNAME", dataIndex: "LASTNAME", key: "LASTNAME" },
            { title: "GENDER", dataIndex: "GENDER", key: "GENDER" },
            { title: "LEVEL", dataIndex: "LEVEL", key: "LEVEL" },
          ]}
        />
      </Modal>
    </div>
  );
}

export default CreateElection;
