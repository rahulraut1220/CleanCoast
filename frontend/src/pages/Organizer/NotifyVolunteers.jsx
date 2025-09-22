// src/pages/NotifyVolunteers.jsx
import { useState } from "react";
import { RichTextEditor } from "@mantine/rte";
import { Button, Container, TextInput, Title, Box, Text } from "@mantine/core";
import axios from "axios";

const NotifyVolunteers = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/events/${eventId}/notify-nearby`, {
        subject,
        message,
      });
      setStatus("Emails sent successfully.");
    } catch (err) {
      setStatus("Failed to send emails.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" pt="xl">
      <Title order={2} mb="lg">
        Notify Volunteers
      </Title>

      <TextInput
        label="Event ID"
        placeholder="Enter Event ID"
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        mb="md"
      />

      <TextInput
        label="Subject"
        placeholder="Enter email subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        mb="md"
      />

      <Box mb="md">
        <Text size="sm" mb={4}>
          Message
        </Text>
        <RichTextEditor value={message} onChange={setMessage} />
      </Box>

      <Button onClick={handleSubmit} loading={loading} color="green">
        Send Notification
      </Button>

      {status && (
        <Text mt="md" color={status.includes("success") ? "green" : "red"}>
          {status}
        </Text>
      )}
    </Container>
  );
};

export default NotifyVolunteers;
