import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  List,
  Pagination,
  Table,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import axios from "axios";

const { Item } = Form;

const PortfolioManager = () => {
  const { candidates } = useAppContext();
  const { elections } = useAppContext();
  const { portfolios, setPortfolios } = useAppContext();
  const [isPortfolioModalVisible, setIsPortfolioModalVisible] = useState(false);
  const [isCandidateModalVisible, setIsCandidateModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [priority, setPriority] = useState(0);
  const [portfolio, setPortfolio] = useState("");
  const [election, setElection] = useState("");
  const [ballot, setBallot] = useState(null);
  const [image, setImage] = useState("");
  const [gender, setGender] = useState("");
  const [candidateForm] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const navigate = useNavigate();

  const showPortfolioModal = () => setIsPortfolioModalVisible(true);
  const showCandidateModal = () => setIsCandidateModalVisible(true);

  const handlePortfolioCancel = () => setIsPortfolioModalVisible(false);
  const handleCandidateCancel = () => setIsCandidateModalVisible(false);

  const handleChangePortfolio = (value) => {
    setPortfolio(value);
  };

  const handleChangeElection = (value) => {
    setElection(value);
  };

  const handleChange = (value) => {
    setGender(value);
  };

  const handlePortfolioSubmit = async () => {
    const formData = { name, priority };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/portfolios",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      const data = response.data;
      console.log(data);
      setName("");
      setPriority(0);
      message.success("Portfolio created successfully");
    } catch (error) {
      console.error("Error submitting portfolio:", error);
      if (error.response) {
        console.log("Server responded with:", error.response.status);
        console.log("Response data:", error.response.data);
      } else if (error.request) {
        console.log("Request made but no response received:", error.request);
      } else {
        console.log("Error setting up request:", error.message);
      }
      message.error("Error creating portfolio");
    }
  };

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/portfolios",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        const data = response.data;
        setPortfolios(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
        if (error.response) {
          console.log("Server responded with:", error.response.status);
          console.log("Response data:", error.response.data);
        } else if (error.request) {
          console.log("Request made but no response received:", error.request);
        } else {
          console.log("Error setting up request:", error.message);
        }
      }
    };

    fetchPortfolios();
  }, [setPortfolios]);

  const handleCandidateSubmit = async () => {
    try {
      const formData = {
        name,
        gender,
        election,
        portfolio,
        ballot,
        image,
      };
      await axios.post("http://localhost:3000/api/candidate", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      message.success("Candidate added successfully");
    } catch (error) {
      console.error("Error adding candidate:", error);
      if (error.response) {
        console.log("Server responded with:", error.response.status);
        console.log("Response data:", error.response.data);
      } else if (error.request) {
        console.log("Request made but no response received:", error.request);
      } else {
        console.log("Error setting up request:", error.message);
      }
      message.error("Error adding candidate");
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 space-y-8">
      <div className="flex space-x-6 justify-between">
        <div className="space-y-4 w-[400px]">
          <Button type="primary" onClick={showPortfolioModal} className="w-48">
            Create Portfolio
          </Button>
          <Table
            dataSource={portfolios}
            columns={[
              {
                title: "Name",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "Priority",
                dataIndex: "priority",
                key: "priority",
              },
            ]}
            pagination={false}
          />
        </div>
        <div className="space-y-4 w-[400px]">
          <Button type="primary" onClick={showCandidateModal} className="w-44">
            Add Candidate
          </Button>
          <Button
            type="primary"
            onClick={() => navigate("/view-candidates")}
            className="w-48 space-x-4 ml-3"
          >
            View Candidates
          </Button>
          <div className="w-full flex flex-col space-y-4">
            <List
              className="w-full"
              header={<div className="font-bold text-lg">Added Candidates</div>}
              bordered
              dataSource={candidates}
              renderItem={() => null}
            >
              {candidates
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((candidate, index) => (
                  <List.Item key={index} className="flex justify-between">
                    <span>{candidate.name}</span>
                    <span>{candidate.portfolio}</span>
                  </List.Item>
                ))}
            </List>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={candidates.length}
              onChange={onPageChange}
            />
          </div>
        </div>
      </div>

      <Modal
        height={300}
        title="Create Portfolio"
        visible={isPortfolioModalVisible}
        onCancel={handlePortfolioCancel}
        footer={null}
      >
        <Form size="small" layout="vertical" onFinish={handlePortfolioSubmit}>
          <Item
            name="name"
            label="Name of Portfolio"
            rules={[
              { required: true, message: "Please enter the portfolio name" },
            ]}
          >
            <Input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Item>
          <Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please enter the priority" }]}
          >
            <Input
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Item>
        </Form>
      </Modal>

      <Modal
        height={200}
        width={400}
        title="Add Candidate"
        visible={isCandidateModalVisible}
        onCancel={handleCandidateCancel}
        footer={null}
      >
        <Form
          className="w-full"
          size="small"
          form={candidateForm}
          layout="horizontal"
          onFinish={handleCandidateSubmit}
        >
          <Item
            name="name"
            label="Name of Candidate"
            rules={[
              { required: true, message: "Please enter the candidate's name" },
            ]}
          >
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Item>
          <Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select the gender" }]}
          >
            <Select
              value={gender}
              onChange={handleChange}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
            />
          </Item>
          <Item
            name="election"
            label="Election"
            rules={[{ required: true, message: "Please select Election" }]}
          >
            <Select
              value={election}
              onChange={handleChangeElection}
              options={elections.map((election) => ({
                value: election._id,
                label: election.title,
              }))}
            />
          </Item>
          <Item
            name="portfolio"
            label="Portfolio"
            rules={[{ required: true, message: "Please select the portfolio" }]}
          >
            <Select
              value={portfolio}
              onChange={handleChangePortfolio}
              options={portfolios.map((portfolio) => ({
                value: portfolio._id,
                label: portfolio.name,
              }))}
            />
          </Item>
          <Item
            name="ballot"
            label="Ballot Number"
            rules={[
              { required: true, message: "Please enter the Ballot Number" },
            ]}
          >
            <Input
              type="number"
              value={ballot}
              onChange={(e) => setBallot(e.target.value)}
            />
          </Item>
          <Item
            name="image"
            label="Candidate Image"
            rules={[{ required: true, message: "Please enter the image url" }]}
          >
            <Input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">
              Add Candidate
            </Button>
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PortfolioManager;
