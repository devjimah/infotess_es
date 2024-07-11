
import { useState } from "react";
import { Modal, Button, message, Form, DatePicker } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
function ElectionDetailsModal({ visible, onCancel, election, onExtendTime }) {
  const [extensionEndTime, setExtensionEndTime] = useState(null);

  const handleExtendTime = () => {
    if (!extensionEndTime) {
      message.error("Please select a new end time");
      return;
    }

    onExtendTime(extensionEndTime); // Call onExtendTime with the new end time
  };

  const handleCancel = () => {
    setExtensionEndTime(null); // Reset extension end time on modal close
    onCancel();
  };

  return (
    <Modal
      title="Election Details"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="extendTime" type="primary" onClick={handleExtendTime}>
          Extend Time
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          Close
        </Button>,
      ]}
    >
      {election && (
        <Form layout="vertical" className="flex flex-wrap justify-between">
          <Form.Item label="Title">
            <span>{election.title}</span>
          </Form.Item>
          <Form.Item label="Start Time">
            <span>
              {moment(election.startTime).format("MM DD YYYY - h:mm A ")}
            </span>
          </Form.Item>
          <Form.Item label="End Time">
            <span>
              {moment(election.endTime).format("MM DD YYYY - h:mm A")}
            </span>
          </Form.Item>
          <Form.Item label="Status">
            <span>{election.status}</span>
          </Form.Item>
          {election.status === "ended" && (
            <Form.Item label="New End Time">
              <DatePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                value={extensionEndTime}
                onChange={(date) => setExtensionEndTime(date)}
                className="w-full"
              />
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
}

ElectionDetailsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  election: PropTypes.object,
  onExtendTime: PropTypes.func.isRequired,
};

ElectionDetailsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  election: PropTypes.object,
  onExtendTime: PropTypes.func.isRequired, // Ensure onExtendTime is defined as required
};

export default ElectionDetailsModal;
