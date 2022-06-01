import { useCallback, useEffect, useRef } from "react";
import socketInit from "../socket";
import User from "../types.defined";
import { useStateWithCallback } from "./useStateWithCallback";

export const useWebRTC = (roomId: any, user: User) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElement = useRef<any>({});
  const connections = useRef<any>({});
  const socket = useRef<any>(null);
  const localMediaStream = useRef<any>(null);
  const clientsRef = useRef(null);

  const addNewUser = useCallback(
    (newClient: User, cb: FunctionStringCallback) => {
      const lookingFor = clients.find(
        (client: User) => client._id === newClient._id
      );

      if (lookingFor === undefined) {
        setClients(
          (existingClients: User[]) => [...existingClients, newClient],
          cb
        );
      }
    },
    [clients, setClients]
  );

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  useEffect(() => {
    socket.current = socketInit();

    const startCapture = async () => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };

    startCapture().then(() => {
      addNewUser(user, () => {
        const localElement = audioElement.current[user._id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
      });
      socket.current.emit("join", { roomId, user });
    });

    const handleRemoteSDP = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }: any) => {
      await connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );

      if (remoteSessionDescription.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();

        await connection.setLocalDescription(answer);

        socket.current.emit("relay-sdp", {
          peerId,
          sessionDescription: answer,
        });
      }
    };

    const handleNewPeer = async ({
      peerId,
      createOffer,
      user: remoteUser,
    }: any) => {
      if (peerId in connections.current) {
        return console.warn(
          `You already have a connection with ${peerId} (${remoteUser.firstName})`
        );
      }

      connections.current[peerId] = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
            ],
          },
        ],
        iceCandidatePoolSize: 10,
      });

      connections.current[peerId].onicecandidate = async (event: any) => {
        if (event.candidate !== null) {
          await socket.current.emit("relay-ice", {
            peerId,
            icecandidate: event.candidate,
          });
        }
      };

      connections.current[peerId].ontrack = ({
        streams: [remoteStream],
      }: any) => {
        addNewUser(remoteUser, () => {
          if (audioElement.current[remoteUser._id]) {
            audioElement.current[remoteUser._id].srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              if (audioElement.current[remoteUser._id]) {
                audioElement.current[remoteUser._id].srcObject = remoteStream;
                settled = true;
              }
              if (settled) {
                clearInterval(interval);
              }
            }, 100);
          }
        });
      };

      await localMediaStream.current.getTracks().forEach((track: AudioBuffer) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();
        await connections.current[peerId].setLocalDescription(offer);
        await socket.current.emit("relay-sdp", {
          peerId,
          sessionDescription: offer,
        });
      }
    };

    const handleIceCandidate = async ({ peerId, icecandidate }: any) => {
      if (icecandidate) {
        await connections.current[peerId].addIceCandidate(icecandidate);
      }
    };

    const handleRemovePeer = async ({
      peerId,
      userId,
    }: {
      peerId: string;
      userId: string;
    }) => {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }
      delete connections.current[peerId];
      delete audioElement.current[peerId];
      setClients((list: User[]) =>
        list.filter((client: { _id: String }) => client._id !== userId)
      );
    };

    socket.current.on("remove-peer", handleRemovePeer);
    socket.current.on("add-peer", handleNewPeer);
    socket.current.on("session-description", handleRemoteSDP);
    socket.current.on("ice-candidate", handleIceCandidate);

    return () => {
      localMediaStream.current?.getTracks().forEach((track: any) => {
        track.stop();
      });

      for (let peerId in connections.current) {
        connections.current[peerId].close();
        delete connections?.current[peerId];
        delete audioElement?.current[peerId];
      }
      socket.current.emit("leave", { roomId, user });
      socket.current.off("session-description");
      socket.current.off("add-peer");
      socket.current.off("ice-candidate");
      socket.current.off("remove-peer");
    };
  }, []);

  const provideRef = (instance: any, userId: string) => {
    audioElement.current[userId] = instance;
  };

  return { clients, provideRef };
};
