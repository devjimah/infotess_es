import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  DatePicker,
  TimePicker,
  message,
  Steps,
  List,
  Modal,
  Table,
} from "antd";
import moment from "moment";
import axios from "axios";
import UploadRegister from "./UploadRegister";

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
  const [newEndTime, setNewEndTime] = useState();
  const [elections, setElections] = useState([]);
  const [voters, setVoters] = useState([]);
  const [extendElectionId, setExtendElectionId] = useState("");

  const API_BASE_URL = "http://localhost:3000/api"; // Fix the environment variable access

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
    if (currentStep === 2) {
      fetchElections();
    }
  };

  useEffect(() => {
    console.log("extendElectionId updated:", extendElectionId);
  }, [extendElectionId]);

  useEffect(() => {
    const checkElectionStatus = async () => {
      const currentTime = new Date();

      for (const election of elections) {
        const endTime = new Date(election.endTime);

        // Check if the current time is equal to or past the end time
        if (currentTime >= endTime && election.status !== "ended") {
          try {
            // Make a PUT request to update the election status
            await axios.put(
              `${API_BASE_URL}/election/status/${election._id}`,
              { status: "ended" },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
              }
            );

            // Refresh the elections
            const response = await axios.get(`${API_BASE_URL}/election`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              },
            });

            setElections(response.data);

            // Refresh the page
            window.location.reload();
          } catch (error) {
            console.error("Error updating election status:", error);
          }
        }
      }
    };

    // Set up an interval to run the check every minute
    const intervalId = setInterval(checkElectionStatus, 60000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [elections]);

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        title,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      };

      const response = await axios.post(`${API_BASE_URL}/election`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      setElections([...elections, response.data]);
      setTitle("");
      setStartTime(null);
      setEndTime(null);
      // setCandidates([]);
      message.success("Election created successfully");
    } catch (error) {
      message.error("An error occurred. Please try again.");
    }
  };

  const handleManualOpenElection = async (election) => {
    try {
      if (election.status === "active") {
        message.error("Election is already open");
        return;
      }

      // Removed the check for "completed" status

      const now = new Date();
      const electionEndTime = new Date(election.endTime);

      if (now > electionEndTime) {
        message.error(
          "Election has ended. Please extend the election time first."
        );
        return;
      }

      if (now < election.startTime) {
        message.error("Cannot open election before start time");
        return;
      }

      const electionId = election._id;
      const formData = {
        status: "active",
      };

      await axios.put(
        `${API_BASE_URL}/election/status/${electionId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      // Refresh elections
      const response = await axios.get(`${API_BASE_URL}/election`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      setElections(response.data);
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
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      // refresh officials
      const newOfficials = await axios.get(`${API_BASE_URL}/official`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
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

  const handleExtendElection = async () => {
    if (!extendElectionId) {
      message.error("No election selected for extension");
      return;
    }

    if (!newEndTime) {
      message.error("Please select a new end time");
      return;
    }

    try {
      const formData = { newEndTime: new Date(newEndTime.$d) };

      await axios.put(
        `${API_BASE_URL}/election/extend/${extendElectionId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      const refreshResponse = await axios.get(`${API_BASE_URL}/election`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      setElections(refreshResponse.data);
      message.success("Election extended successfully");
      setIsModalVisible(false);
      setExtendElectionId(null);
      setNewEndTime(null);
    } catch (error) {
      console.error("Error extending election:", error.response?.data || error);
      message.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Add this function to periodically check and update election statuses
  const updateElectionStatuses = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/election/status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setElections(response.data);
    } catch (error) {
      console.error("Error updating election statuses:", error);
    }
  };

  // Add this useEffect to run the status update periodically
  useEffect(() => {
    const intervalId = setInterval(updateElectionStatuses, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, []);
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
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
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
          <UploadRegister />
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
              value={startTime ? startTime : null} // Convert to  object
              onChange={(date) => setStartTime(date)} // Update setStartTime function
            />
          </Form.Item>
          <Form.Item label="End Time">
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              value={endTime ? endTime : null} // Convert to moment object
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
              <List.Item key={index}>
                <List.Item.Meta
                  title={election.title}
                  description={`Start Time: ${moment(election.startTime).format(
                    "YYYY-MM-DD HH:mm"
                  )} | End Time: ${moment(election.endTime).format(
                    "YYYY-MM-DD HH:mm"
                  )} | Status: ${election.status}`}
                />
                <Button
                  type="default"
                  onClick={() => handleManualOpenElection(election)}
                >
                  Open Election
                </Button>
                <Button
                  type="default"
                  onClick={() => {
                    setIsModalVisible(true);
                    setExtendElectionId(election._id);
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
        open={isModalVisible}
        onOk={handleExtendElection}
        onCancel={handleExtendCancel}
      >
        <Form layout="vertical">
          <Form.Item label="New End Time">
            <TimePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              value={newEndTime ? newEndTime : null}
              onChange={(date) => setNewEndTime(date)}
            />
          </Form.Item>
        </Form>
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
