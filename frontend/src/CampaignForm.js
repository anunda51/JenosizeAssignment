import React, { useState } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const API_URL = '/api';

const CampaignForm = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (!content || content.trim() === "") {
      message.error("Please enter email content");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          content,
          recipients: values.recipients
            .split(",")
            .map((email) => email.trim())
            .filter((email) => email !== "")
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      message.success("Campaign created successfully!");
      form.resetFields();
      setContent("");
    } catch (error) {
      message.error(error.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Create New Email Campaign
      </h2>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          {/* Campaign Name */}
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Campaign Name"
              name="name"
              rules={[{ required: true, message: "Please enter campaign name" }]}
            >
              <Input placeholder="Enter campaign name" />
            </Form.Item>
          </Col>

          {/* Subject Line */}
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Subject Line"
              name="subject"
              rules={[{ required: true, message: "Please enter subject line" }]}
            >
              <Input placeholder="Enter subject line" />
            </Form.Item>
          </Col>

          {/* Recipients */}
          <Col xs={24}>
            <Form.Item
              label="Recipients (comma separated)"
              name="recipients"
              rules={[{ required: true, message: "Please enter at least one recipient" }]}
            >
              <Input placeholder="Enter recipient emails, separated by comma" />
            </Form.Item>
          </Col>

          {/* Email Content */}
          <Col xs={24}>
            <Form.Item label="Email Content" required>
              <ReactQuill value={content} onChange={setContent} />
            </Form.Item>
          </Col>

          {/* Submit Button */}
          <Col xs={24} style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Campaign
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CampaignForm;
