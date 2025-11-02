import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import axiosInstance from "../api/axiosInstance";
import { getSocketUrl } from "../utils/apiConfig";

const MeetingRoom = () => {
  const { roomId } = useParams();
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Initializing...");
  const socketRef = useRef(null);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const [remoteStreams, setRemoteStreams] = useState([]);

  // Log browser info for debugging
  useEffect(() => {
    console.log("Browser info:", {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      hasMediaDevices: !!navigator.mediaDevices,
      hasGetUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    });
  }, []);

  // 🔹 Load meeting info
  useEffect(() => {
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

  // 🔹 Initialize camera + socket + WebRTC
  useEffect(() => {
    let mounted = true;
    const start = async () => {
      try {
        // Check if mediaDevices is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          // Try to provide helpful guidance based on the issue
          let guidance = "Your browser doesn't support camera/microphone access. ";

          if (window.location.protocol === 'https:' && window.location.hostname !== 'localhost') {
            guidance += "Camera access requires HTTPS. Please access the site via https:// or use localhost for testing.";
          } else {
            guidance += "Please use a modern browser like Chrome (version 53+), Firefox (version 36+), or Edge (version 79+).";
          }

          throw new Error(guidance);
        }

        setStatus("Requesting camera and microphone access...");
        // 🎥 Get local stream
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        if (!mounted) return;

        setStatus("Camera access granted. Connecting to meeting...");
        setStream(localStream);
        if (userVideo.current) userVideo.current.srcObject = localStream;

        // 🌐 Connect to /meeting namespace
        const socketUrl = getSocketUrl();
        const isNetworkIP = !['localhost', '127.0.0.1'].includes(window.location.hostname);
        const useSecure = window.location.protocol === 'https:';
        
        // Pre-check backend availability (this helps trigger certificate acceptance on mobile)
        if (isNetworkIP && useSecure) {
          setStatus("Validating backend connection...");
          try {
            // Try to fetch from backend API to trigger certificate acceptance dialog
            const testUrl = `${socketUrl}/api/meetings/${roomId}`;
            await fetch(testUrl, {
              method: 'GET',
              mode: 'cors',
              credentials: 'omit',
              headers: {
                'Accept': 'application/json',
              },
            }).catch(() => {
              // Ignore fetch errors - we're just trying to trigger cert acceptance
              console.log("Backend pre-check completed (errors are expected for cert acceptance)");
            });
          } catch (e) {
            // Ignore errors - this is just a pre-check
            console.log("Backend pre-check:", e.message);
          }
        }
        
        console.log("🔌 Attempting to connect to:", `${socketUrl}/meeting`);
        console.log("🔒 Connection settings:", { isNetworkIP, useSecure, hostname: window.location.hostname });
        
        // For network IPs, prioritize polling (it handles certificate issues better than websocket)
        // Polling uses XHR which is more forgiving with certificate mismatches
        const transportOrder = isNetworkIP ? ['polling'] : ['websocket', 'polling'];
        
        socketRef.current = io(
          `${socketUrl}/meeting`,
          {
            transports: transportOrder,
            upgrade: false, // Disable upgrade for network IPs to avoid certificate issues during upgrade
            rememberUpgrade: false,
            secure: useSecure,
            rejectUnauthorized: false, // Note: browsers still validate certificates, this only affects Node.js
            timeout: 45000, // 45 second timeout for mobile/slow networks
            reconnection: true,
            reconnectionDelay: 3000,
            reconnectionDelayMax: 15000,
            reconnectionAttempts: 5,
            autoConnect: true,
            forceNew: isNetworkIP, // Force new connection for network IPs
            withCredentials: false,
            // Additional options for better mobile support
            path: '/socket.io/',
          }
        );

        socketRef.current.on("connect", () => {
          console.log("🎥 Connected to meeting namespace:", socketRef.current.id);
          console.log("📡 Transport:", socketRef.current.io?.engine?.transport?.name);
          setStatus("Connected. Joining room...");
          socketRef.current.emit("join_meeting_room", roomId);
        });

        socketRef.current.on("connect_error", (err) => {
          console.error("Socket connection error:", err);
          const errorDetails = {
            message: err.message,
            type: err.type,
            description: err.description,
            url: `${socketUrl}/meeting`,
            protocol: window.location.protocol,
            hostname: window.location.hostname,
            transport: socketRef.current?.io?.engine?.transport?.name,
          };
          console.error("Error details:", errorDetails);
          
          // Provide helpful error message for certificate issues
          let errorMsg = `Failed to connect to meeting server at ${socketUrl}. `;
          
          if (err.message.includes('xhr poll error') || 
              err.message.includes('NetworkError') ||
              err.message.includes('Failed to fetch')) {
            if (isNetworkIP && useSecure) {
              errorMsg += `This may be a certificate mismatch issue. `;
              errorMsg += `Try visiting ${socketUrl} directly in your browser first to accept the certificate, then refresh this page.`;
            } else {
              errorMsg += `Error: ${err.message}. Please check if the backend server is running and accessible.`;
            }
          } else {
            errorMsg += `Error: ${err.message}`;
          }
          
          setError(errorMsg);
          setStatus("Connection failed");
        });

        socketRef.current.on("disconnect", (reason) => {
          console.warn("Socket disconnected:", reason);
          if (reason === 'io server disconnect') {
            // Server disconnected, try to reconnect
            socketRef.current.connect();
          }
        });

        socketRef.current.on("reconnect_attempt", (attemptNumber) => {
          console.log(`🔄 Reconnection attempt ${attemptNumber}`);
          setStatus(`Reconnecting... (attempt ${attemptNumber})`);
        });

        socketRef.current.on("reconnect_failed", () => {
          console.error("❌ Reconnection failed");
          setError("Failed to reconnect to meeting server. Please refresh the page.");
          setStatus("Connection failed");
        });

        // 🎭 Receive role (initiator or receiver)
        socketRef.current.on("meeting_role", ({ initiator }) => {
          console.log("🎭 Role:", initiator ? "Initiator" : "Receiver");
          setStatus(initiator ? "Setting up connection..." : "Waiting for other participant...");
          const peer = new Peer({
            initiator,
            trickle: true,
            stream: localStream,
          });

          // Send signaling data to backend
          peer.on("signal", (signal) => {
            socketRef.current.emit("signal", {
              roomId,
              signal,
              sender: socketRef.current.id,
            });
          });

          // When remote stream arrives
          peer.on("stream", (remoteStream) => {
            console.log("📡 Received remote stream");
            setStatus("Connected!");
            setRemoteStreams((prev) => [...prev, remoteStream]);
          });

          peer.on("error", (err) => {
            console.error("Peer connection error:", err);
            setError("Peer connection failed: " + err.message);
          });

          peersRef.current.push(peer);
        });

        // 👥 Peer is ready to connect (second user joined)
        socketRef.current.on("peer_ready", () => {
          console.log("👥 Peer is ready for signaling");
        });

        // 🔁 Receive WebRTC signaling from backend
        socketRef.current.on("signal", ({ signal, sender }) => {
          console.log("📨 Received signal from:", sender);
          const peer = peersRef.current[0];
          if (peer) {
            try {
              peer.signal(signal);
            } catch (err) {
              console.error("peer.signal error:", err);
            }
          }
        });

        // 🚪 Handle full room
        socketRef.current.on("room_full", () => {
          setError("Room is full! Only two participants allowed.");
          setStatus("Room full");
        });
      } catch (err) {
        console.error("Meeting initialization failed:", err);
        let errorMessage = "Failed to initialize meeting. ";

        if (err.name === "NotAllowedError") {
          errorMessage = "Camera/microphone access denied. Please allow permissions and refresh.";
        } else if (err.name === "NotFoundError") {
          errorMessage = "No camera or microphone found. Please connect a device and refresh.";
        } else if (err.name === "NotReadableError") {
          errorMessage = "Camera/microphone is already in use by another application.";
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        setStatus("Error");
        setStream(null);
      }
    };
    start();

    // 🔹 Cleanup when leaving page
    return () => {
      mounted = false;
      try {
        socketRef.current?.disconnect();
      } catch (e) { }
      if (stream) stream.getTracks().forEach((t) => t.stop());
      peersRef.current.forEach((p) => p.destroy?.());
      peersRef.current = [];
    };
  }, [roomId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-2">
        Meeting Room: {roomId}
      </h1>

      {meetingInfo && (
        <p className="text-gray-600 mb-4">
          {meetingInfo.bookingInfo?.guest} with{" "}
          {meetingInfo.bookingInfo?.host}
        </p>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-600 mb-2">You</p>
          <video
            ref={userVideo}
            autoPlay
            muted
            playsInline
            className="w-64 h-48 bg-black rounded-lg"
          />
        </div>
        {remoteStreams.map((stream, i) => (
          <div key={i} className="flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-2">Participant {i + 1}</p>
            <video
              autoPlay
              playsInline
              className="w-64 h-48 bg-black rounded-lg"
              ref={(videoEl) => {
                if (videoEl) videoEl.srcObject = stream;
              }}
            />
          </div>
        ))}
      </div>

      {/* Status message */}
      <div className="mt-4 text-center">
        <p className="text-gray-700 font-medium">{status}</p>
        {error && (
          <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-lg max-w-lg mx-auto">
            <p className="text-red-600 font-medium">Error:</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <div className="mt-3 text-xs text-gray-600 text-left">
              <p className="font-semibold">Troubleshooting tips:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Ensure you're using Chrome 53+, Firefox 36+, or Edge 79+</li>
                <li>Check that your camera/mic is connected and working</li>
                <li>Close other apps using the camera (Zoom, Teams, etc.)</li>
                <li>Try accessing via localhost if testing locally</li>
                <li>Check browser permissions (click 🔒 in address bar)</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {stream && remoteStreams.length === 0 && !error && (
        <div className="mt-2 text-gray-500 text-sm">
          Share this room link with others to join
        </div>
      )}
    </div>
  );
};

export default MeetingRoom;
