import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import axiosInstance from "../api/axiosInstance";

// create socketRef per component instead of module-level connection

const MeetingRoom = () => {
  const { roomId } = useParams();
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [stream, setStream] = useState(null);
  const socketRef = useRef(null);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const [remoteStreams, setRemoteStreams] = useState([]);

  useEffect(() => {
    // Fetch meeting info
    let mounted = true;
    const load = async () => {
      try {
        const res = await axiosInstance.get(`/meetings/${roomId}`);
        if (mounted) setMeetingInfo(res.data);
      } catch (err) {
        console.error("Failed to load meeting info:", err);
      }
    };
    if (roomId) load();
    return () => {
      mounted = false;
    };
  }, [roomId]);

  useEffect(() => {
    let mounted = true;
    const start = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!mounted) return;
        setStream(localStream);
        if (userVideo.current) userVideo.current.srcObject = localStream;

        // create socket connection now that we have permission and meeting loaded
        socketRef.current = io(process.env.REACT_APP_API_BASE || "http://localhost:5000");

        socketRef.current.on("connect", () => {
          console.log("socket connected", socketRef.current.id);
          socketRef.current.emit("join_room", roomId);
        });

        socketRef.current.on("user_joined", (otherId) => {
          console.log("user_joined", otherId);
          // when another user present, create an initiator peer
          const peer = new Peer({ initiator: true, trickle: true, stream: localStream });
          peer.on("signal", (signal) => {
            socketRef.current.emit("signal", { roomId, signal, sender: socketRef.current.id });
          });
          peer.on("stream", (remoteStream) => {
            setRemoteStreams((prev) => [...prev, remoteStream]);
          });
          peersRef.current.push({ peerId: otherId, peer });
        });

        socketRef.current.on("signal", ({ signal, sender }) => {
          console.log("received signal", sender);
          // if we don't have a peer for this sender, create answering peer
          const existing = peersRef.current.find((p) => p.peerId === sender);
          if (!existing) {
            const answeringPeer = new Peer({ initiator: false, trickle: true, stream: localStream });
            answeringPeer.on("signal", (s) => {
              socketRef.current.emit("signal", { roomId, signal: s, sender: socketRef.current.id });
            });
            answeringPeer.on("stream", (remoteStream) => {
              setRemoteStreams((prev) => [...prev, remoteStream]);
            });
            answeringPeer.signal(signal);
            peersRef.current.push({ peerId: sender, peer: answeringPeer });
          } else {
            try {
              existing.peer.signal(signal);
            } catch (e) {
              console.error("peer.signal error", e);
            }
          }
        });
      } catch (err) {
        console.error("getUserMedia failed:", err);
        setStream(null);
      }
    };
    start();

    return () => {
      mounted = false;
      try {
        socketRef.current?.disconnect();
      } catch (e) {}
      if (stream) stream.getTracks().forEach((t) => t.stop());
      peersRef.current.forEach((p) => p.peer?.destroy());
      peersRef.current = [];
    };
  }, [roomId]);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (signal) => {
      socketRef.current?.emit("signal", { roomId, signal, sender: socketRef.current.id });
    });
    peer.on("stream", (remoteStream) => {
      setRemoteStreams((prev) => [...prev, remoteStream]);
    });
    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (signal) => {
      socketRef.current?.emit("signal", { roomId, signal, sender: socketRef.current.id });
    });
    peer.on("stream", (remoteStream) => {
      setRemoteStreams((prev) => [...prev, remoteStream]);
    });
    peer.signal(incomingSignal);
    return peer;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-2">
        Meeting Room: {roomId}
      </h1>

      {meetingInfo && (
        <p className="text-gray-600 mb-4">
          {meetingInfo.bookingInfo.guest} with {meetingInfo.bookingInfo.host}
        </p>
      )}

      <div className="flex gap-4">
        <video
          ref={userVideo}
          autoPlay
          muted
          playsInline
          className="w-1/2 bg-black rounded-lg"
        />
        {remoteStreams.map((stream, i) => (
          <video
            key={i}
            autoPlay
            playsInline
            className="w-1/2 bg-black rounded-lg"
            ref={(videoEl) => {
              if (videoEl) videoEl.srcObject = stream;
            }}
          />
        ))}
        {stream && remoteStreams.length === 0 && (
          <div className="flex items-center text-gray-600">Waiting for other participant to join...</div>
        )}
      </div>
    </div>
  );
};

export default MeetingRoom;
