// src/pages/MeetingRoom.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import DailyIframe from "@daily-co/daily-js";

const MeetingRoom = () => {
  const { id } = useParams();
  const [meetingUrl, setMeetingUrl] = useState("");

  useEffect(() => {
    const loadMeeting = async () => {
      const res = await axiosInstance.get(`/meeting/${id}`);
      setMeetingUrl(res.data.url);
    };
    loadMeeting();
  }, [id]);

  useEffect(() => {
    if (meetingUrl) {
      const callFrame = DailyIframe.createFrame({
        showLeaveButton: true,
        iframeStyle: { width: "100%", height: "100vh" },
      });
      callFrame.join({ url: meetingUrl });
    }
  }, [meetingUrl]);

  return <div id="meeting-room" />;
};

export default MeetingRoom;
