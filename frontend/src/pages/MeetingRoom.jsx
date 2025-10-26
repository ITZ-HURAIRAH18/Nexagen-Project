// src/pages/MeetingRoom.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import DailyIframe from "@daily-co/daily-js";

const MeetingRoom = () => {
  const { roomId } = useParams();
  const [meetingUrl, setMeetingUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMeeting = async () => {
      setLoading(true);
      setError("");
      try {
        // backend mounts meeting routes at /api/meetings
        const res = await axiosInstance.get(`/meetings/${roomId}`);
        setMeetingUrl(res.data.url || "");
        if (!res.data?.url) setError("Meeting URL not found for this room.");
      } catch (err) {
        console.error("Failed to load meeting:", err);
        setError("Failed to load meeting. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (roomId) loadMeeting();
  }, [roomId]);

  useEffect(() => {
    let callFrame;
    const mount = async () => {
      if (!meetingUrl) return;
      try {
        const container = document.getElementById("meeting-room");
        if (!container) {
          setError("Meeting container not found.");
          return;
        }
        callFrame = DailyIframe.createFrame(container, {
          showLeaveButton: true,
          iframeStyle: { width: "100%", height: "100vh" },
        });
        await callFrame.join({ url: meetingUrl });
      } catch (err) {
        console.error("Error mounting meeting iframe:", err);
        setError("Unable to join meeting. Please try again.");
      }
    };
    mount();
    return () => {
      try {
        if (callFrame) callFrame.destroy();
      } catch (e) {
        // ignore
      }
    };
  }, [meetingUrl]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {loading ? (
          <div className="text-center text-gray-600">Loading meeting...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div id="meeting-room" className="w-full h-[100vh] bg-black" />
        )}
      </div>
    </div>
  );
};

export default MeetingRoom;
