import { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  Input,
  DatePicker,
  message,
  Upload,
  Steps,
  List,
  Modal,
  Table,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import moment from "moment";
import axios from "axios";

const { Step } = Steps;

function CreateElection() {
  const [currentStep, setCurrentStep] = useState(0);
  // const [elections, setElections] = useState(
  //   () => JSON.parse(localStorage.getItem("elections")) || []
  // );
  const [elections, setElections] = useState([]);
  const [officials, setOfficials] = useState(
    () => JSON.parse(localStorage.getItem("officials")) || []
  );
  const [fileList, setFileList] = useState([]);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);

  const [electionTitle, setElectionTitle] = useState("");
  const [electionStartTime, setElectionStartTime] = useState(null);
  const [electionEndTime, setElectionEndTime] = useState(null);

  const [fullName, setFullName] = useState("");
  const [STUDENTID, setSTUDENTID] = useState("");
  const [password, setPassword] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEndTime, setNewEndTime] = useState(null);
  const [extendIndex, setExtendIndex] = useState(null);

  const prevElectionsRef = useRef(elections);
  const [voterRegister, setVoterRegister] = useState(
    () => JSON.parse(localStorage.getItem("voterRegister")) || []
  );

  useEffect(() => {
    const updateElections = () => {
      const now = new Date();
      const updatedElections = elections.map((election) => {
        if (
          new Date(election.startTime) <= now &&
          new Date(election.endTime) >= now
        ) {
          return { ...election, status: "active" };
        } else if (new Date(election.endTime) < now) {
          return { ...election, status: "ended" };
        } else {
          return { ...election, status: "scheduled" };
        }
      });

      if (
        JSON.stringify(updatedElections) !==
        JSON.stringify(prevElectionsRef.current)
      ) {
        setElections(updatedElections);
        localStorage.setItem("elections", JSON.stringify(updatedElections));
        prevElectionsRef.current = updatedElections;
      }
    };

    updateElections();
  }, [elections, setElections]);

  useEffect(() => {
    localStorage.setItem("officials", JSON.stringify(officials));
  }, [officials]);

  const handleCreateOfficial = () => {
    if (officials.length >= 2) {
      message.error("Only two officials can be created.");
      return;
    }

    if (!fullName || !STUDENTID || !password) {
      message.error("Please fill all fields.");
      return;
    }

    const newOfficial = {
      fullName,
      STUDENTID,
      password,
      accessGranted: false,
    };

    setOfficials([...officials, newOfficial]);
    setFullName("");
    setSTUDENTID("");
    setPassword("");

    message.success("Official created successfully.");

    if (officials.length + 1 >= 2) {
      handleNextStep();
    }
  };
  useEffect(() => {
    localStorage.setItem("voterRegister", JSON.stringify(voterRegister));
  }, [voterRegister]);

  const handleFileChange = ({ fileList }) => setFileList(fileList);

  const handleUpload = () => {
    if (fileList.length === 0 || !fileList[0]) {
      message.error("Please select a file to upload");
      return;
    }

    const file = fileList[0].originFileObj;
    const acceptedTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!acceptedTypes.includes(file.type)) {
      message.error("Only CSV and Excel files are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      let parsedContent = [];

      if (file.type === "text/csv") {
        parsedContent = parseCSVContent(content);
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        parsedContent = parseXLSXContent(content);
      }
      setVoterRegister(parsedContent);
      localStorage.setItem("voterRegister", JSON.stringify(parsedContent));
      message.success("File uploaded and saved successfully");
      handleNextStep();
    };

    if (file.type === "text/csv") {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }

    setFileList([]);
  };

  const parseCSVContent = (csvContent) => {
    const lines = csvContent.split(/\r?\n/);
    const headers = lines[0].split(",");
    const voterData = [];
    for (let i = 1; i < lines.length; i++) {
      const data = lines[i].split(",");
      if (data.length === headers.length) {
        const voter = {
          "S/N": data[0],
          "STUDENT ID": data[1],
          FIRSTNAME: data[2],
          MIDDLENAME: data[3],
          LASTNAME: data[4],
          GENDER: data[5],
          LEVEL: data[6],
        };
        voterData.push(voter);
      }
    }
    return voterData;
  };

  const parseXLSXContent = (arrayBuffer) => {
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = jsonData[0];
    const voterData = [];
    for (let i = 1; i < jsonData.length; i++) {
      const data = jsonData[i];
      if (data.length === headers.length) {
        const voter = {
          "S/N": data[0],
          "STUDENT ID": data[1],
          FIRSTNAME: data[2],
          MIDDLENAME: data[3],
          LASTNAME: data[4],
          GENDER: data[5],
          LEVEL: data[6],
        };
        voterData.push(voter);
      }
    }
    return voterData;
  };
  const handleCreateElection = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        title: electionTitle,
        startTime: electionStartTime.toISOString(),
        endTime: electionEndTime.toISOString(),
      }

      await axios.post("https://es-api.onrender.com/election", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      // Refresh elections
      const response = await axios.get("https://es-api.onrender.com/election", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setElections(response.data.elections);
      setElectionTitle("");
      setElectionStartTime(null);
      setElectionEndTime(null);
      message.success("Election created successfully");

    } catch (error) {
      message.error("An error occurred. Please try again.");
    }
  }
  

  const showExtendModal = (index) => {
    setIsModalVisible(true);
    setExtendIndex(index);
    setNewEndTime(null);
  };

  const handleExtendElection = async () => {

    try {
      const electionId = elections._id
      const formData = {
        endTime: newEndTime.toISOString(),
      }

      await axios.put(`https://es-api.onrender.com/election/${electionId}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      // Refresh elections
      const response = await axios.get("https://es-api.onrender.com/election", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setElections(response.data.elections);
      message.success("Election extended successfully");
      setIsModalVisible(false);
    } catch (error) {
      message.error("An error occurred. Please try again.");
    }

    // if (!newEndTime) {
    //   message.error("Please select a new end time");
    //   return;
    // }

    // const updatedElections = elections.map((election, i) =>
    //   i === extendIndex
    //     ? { ...election, endTime: newEndTime.toISOString(), status: "extended" }
    //     : election
    // );
    // setElections(updatedElections);
    // localStorage.setItem("elections", JSON.stringify(updatedElections));
    // message.success("Election extended successfully");
    // setIsModalVisible(false);
  };

  const handleExtendCancel = () => {
    setIsModalVisible(false);
  };

  const handleManualOpen = (index) => {
    const now = new Date();
    const election = elections[index];
    if (new Date(election.endTime) < now) {
      message.error("Election has already ended. Please extend the end time.");
      return;
    }

    if (new Date(election.startTime) <= now) {
      const updatedElections = elections.map((election, i) =>
        i === index ? { ...election, status: "active" } : election
      );
      setElections(updatedElections);
      localStorage.setItem("elections", JSON.stringify(updatedElections));
      message.success("Election opened manually");
    } else {
      message.error("Election start time is not yet due");
    }
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: "Create Officials",
      content: (
        <Form
          layout="vertical"
          className="grid grid-cols-4  mt-4 items-center justify-between space-x-3"
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
            onClick={handleCreateOfficial}
            disabled={!fullName || !STUDENTID || !password}
          >
            Create Official
          </Button>
        </Form>
      ),
    },
    {
      title: "Upload Voter Register",
      content: (
        <div className="flex mt-4 items-center space-x-4">
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
          >
            Upload
          </Button>
          <Button onClick={() => setIsRegisterVisible(true)}>
            View Register
          </Button>
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
              value={electionTitle}
              onChange={(e) => setElectionTitle(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Start Time">
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              value={electionStartTime}
              onChange={(value) => setElectionStartTime(value)}
            />
          </Form.Item>
          <Form.Item label="End Time">
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              value={electionEndTime}
              onChange={(value) => setElectionEndTime(value)}
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={handleCreateElection}
            disabled={!electionTitle || !electionStartTime || !electionEndTime}
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
            dataSource={elections.slice(0, 2)}
            renderItem={(election, index) => (
              <List.Item key={election.id}>
                <List.Item.Meta
                  title={election.title}
                  description={`Start Time: ${moment(election.startTime).format(
                    "YYYY-MM-DD HH:mm"
                  )} | End Time: ${moment(election.endTime).format(
                    "YYYY-MM-DD HH:mm"
                  )} | Status: ${election.status}`}
                />
                <Button type="default" onClick={() => handleManualOpen(index)}>
                  Open Election
                </Button>
                <Button type="default" onClick={() => showExtendModal(index)}>
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
          value={newEndTime}
          onChange={(value) => setNewEndTime(value)}
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
          dataSource={voterRegister}
          rowKey="S/N"
          columns={[
            { title: "S/N", dataIndex: "S/N", key: "S/N" },
            { title: "STUDENT ID", dataIndex: "STUDENT ID", key: "STUDENT ID" },
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
