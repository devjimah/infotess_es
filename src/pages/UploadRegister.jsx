import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UploadRegister = () => {
  const props = {
    name: "file",
    accept: ".xlsx",
    action: "http://localhost:3000/upload", // URL of your backend endpoint
    headers: {
      authorization: "authorization-text", // If needed
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Upload Voters Register</Button>
    </Upload>
  );
};

export default UploadRegister ;
