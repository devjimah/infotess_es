import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Upload,
  List,
  Pagination,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import axios from "axios";

const { Option } = Select;
const { Item } = Form;

const PortfolioManager = () => {
  const { candidates, setCandidates } = useAppContext();
  const [portfolios, setPortfolios] = useState([]);
  const [isPortfolioModalVisible, setIsPortfolioModalVisible] = useState(false);
  const [isCandidateModalVisible, setIsCandidateModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [priority, setPriority] = useState(Number);
  const [candidateForm] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("portfolios", JSON.stringify(portfolios));
  }, [portfolios]);

  useEffect(() => {
    localStorage.setItem("candidates", JSON.stringify(candidates));
  }, [candidates]);

  const showPortfolioModal = () => setIsPortfolioModalVisible(true);
  const showCandidateModal = () => setIsCandidateModalVisible(true);

  const handlePortfolioCancel = () => setIsPortfolioModalVisible(false);
  const handleCandidateCancel = () => setIsCandidateModalVisible(false);

  const handlePortfolioSubmit = () => {
    const formData = { name, priority };

    const response = axios.post(
      "http://localhost:3000/api/portfolio",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = response.data;
    setPortfolios([...portfolios, data]);
    console.log(data);
    // setPortfolios([...portfolios, values]);
    // setIsPortfolioModalVisible(false);
    // portfolioForm.resetFields();
  };

  const handleCandidateSubmit = async (values) => {
    const imageFile = values.image.file;
    if (imageFile) {
      const imageBase64 = await getBase64(imageFile);
      values.image = imageBase64;
    }
    setCandidates([...candidates, values]);
    setIsCandidateModalVisible(false);
    candidateForm.resetFields();
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
          <List
            className="w-full"
            header={<div className="font-bold text-lg">Created Portfolios</div>}
            bordered
            dataSource={portfolios}
            renderItem={(item) => (
              <List.Item className="text-center">{item.name}</List.Item>
            )}
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
              pagination={false}
            >
              {candidates
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((item, index) => (
                  <List.Item key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>{item.portfolio}</span>
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
            <Input />
          </Item>
          <Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select the gender" }]}
          >
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Item>
          <Item
            name="election"
            label="Election"
            rules={[{ required: true, message: "Please select Election" }]}
          >
            <Select>
              <Option value="Male">elekkeee</Option>
            </Select>
          </Item>
          <Item
            name="portfolio"
            label="Portfolio"
            rules={[{ required: true, message: "Please select the portfolio" }]}
          >
            <Select>
              {portfolios.map((portfolio, index) => (
                <Option key={index} value={portfolio.name}>
                  {portfolio.name}
                </Option>
              ))}
            </Select>
          </Item>
          <Item
            name="ballotNumber"
            label="Ballot Number"
            rules={[
              { required: true, message: "Please enter the ballot number" },
            ]}
          >
            <Input />
          </Item>
          <Item
            name="image"
            label="Image"
            valuePropName="file"
            rules={[{ required: true, message: "Please upload an image" }]}
          >
            <Upload
              listType="picture"
              beforeUpload={() => false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Item>
          <Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Add
            </Button>
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PortfolioManager;
