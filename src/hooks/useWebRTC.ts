/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from 'react';
import socketInit from '../socket';
import { User, RoomUser } from '../types.defined';
import { useStateWithCallback } from './useStateWithCallback';

export const useWebRTC = (roomId: any, user: User) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElement = useRef<any>({});
  const connections = useRef<any>({});
  const socket = useRef<any>(null);
  const localMediaStream = useRef<any>(null);
  const clientsRef = useRef([]);

  const addNewUser = useCallback(
    (newClient: RoomUser, cb: FunctionStringCallback) => {
      const lookingFor = clients.includes(
        (client: User) => client._id === newClient._id
      );
      if (!lookingFor) {
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

  const startCapture = async () => {
    localMediaStream.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
  };

  useEffect(() => {
    const initChat = async () => {
      socket.current = socketInit();
      await startCapture();
      addNewUser({ ...user, isMuted: true }, async () => {
        const localElement = await audioElement.current[user._id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = await localMediaStream.current;
        }
      });

      socket.current.on('remove-peer', handleRemovePeer);
      socket.current.on('add-peer', handleNewPeer);
      socket.current.on('session-description', handleRemoteSDP);

      socket.current.on(
        'open-ai-answer',
        async ({ peerId, sessionDescription: answer }: any) => {
          if (connections.current['open-ai']) {
            await connections.current['open-ai'].setRemoteDescription({
              type: 'answer',
              sdp: answer,
            });
            connections.current['open-ai'].onconnectionstatechange = () => {
              // console.log(
              //   'PeerConnection state:',
              //   connections.current[peerId].connectionState
              // );
            };

            connections.current['open-ai'].onicecandidate = async (
              event: any
            ) => {
              if (event.candidate !== null) {
                await socket.current.emit('relay-ice', {
                  peerId,
                  icecandidate: event.candidate,
                });
              }
            };

            connections.current['open-ai'].onsignalingstatechange = () => {
              // console.log(
              //   'Signaling state:',
              //   connections.current['open-ai'].signalingState
              // );
            };
            connections.current['open-ai'].oniceconnectionstatechange = () => {
              // console.log(
              //   'ICE connection state:',
              //   connections.current['open-ai'].iceConnectionState
              // );
            };
            // setInterval(() => {
            //   console.log(
            //     'PeerConnection state:',
            //     connections.current['open-ai'].connectionState
            //   );
            // }, 1000);
          }
        }
      );

      socket.current.on('open-ai-ice', ({ peerId, icecandidate }: any) => {
        if (connections.current['open-ai'])
          handleIceCandidate({ peerId, icecandidate });
      }); // Emit a Socket.IO event
      // socket.current.on('openai-session-key', async ({ token }: any) => {

      // add make an socket response along with the local description. use the response to connect to the server.
      connections.current['open-ai'] = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              'stun:stun1.l.google.com:19302',
              'stun:stun2.l.google.com:19302',
            ],
          },
        ],
        iceCandidatePoolSize: 10,
      });
      await localMediaStream.current
        .getTracks()
        .forEach((track: AudioBuffer) => {
          connections.current['open-ai'].addTrack(
            track,
            localMediaStream.current
          );
        });

      const dc = await connections.current['open-ai'].createDataChannel(
        'oai-events',
        {
          ordered: true,
          maxRetransmits: 30,
        }
      );

      // Listen for server-sent events on the data channel - event data
      // will need to be parsed from a JSON string
      dc.addEventListener('message', (e: any) => {
        // const realtimeEvent = JSON.parse(e.data);
        console.log(e.data);
      });

      dc.addEventListener('error', (err: any) => {
        console.error('!!! Data Channel Error:', err);
      });

      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      connections.current['open-ai'].ontrack = (e: any) =>
        (audioEl.srcObject = e.streams[0]);

      // Send client events by serializing a valid client event to
      // JSON, and sending it over the data channel
      const responseCreate = {
        type: 'response.create',
        response: {
          modalities: ['text', 'audio'],
          instructions: 'Write a haiku about code',
        },
      };
      dc.onopen = () => {
        console.log('DataChannel is open.');
        dc.send(JSON.stringify(responseCreate));
      };

      dc.onerror = (error: any) => {
        console.error('DataChannel error:', error);
      };

      dc.onclose = () => {
        console.log('DataChannel is closed.');
      };

      connections.current['open-ai'].ondatachannel = (event: any) => {
        const receivedChannel = event.channel;

        receivedChannel.onopen = () => {
          console.log('Data channel is open!');
        };

        receivedChannel.onmessage = (event: any) => {
          console.log('Received message:', event.data);
        };

        receivedChannel.onclose = () => {
          console.log('Data channel is closed!');
        };
      };

      const offer = await connections.current['open-ai'].createOffer({
        offerToReceiveAudio: true,
      });
      await connections.current['open-ai'].setLocalDescription(offer);

      // // Create a data channel from a peer connection
      // const audioEl = document.createElement("audio");
      // audioEl.autoplay = true;
      // connections.current['open-ai'].ontrack = (e:any) => {
      //   console.log({e});

      //   audioEl.srcObject = e.streams[0]
      // };

      socket.current.emit('open-ai-offer', {
        peerId: 'open-ai',
        sessionDescription: offer,
        // token,
      });
      // }
      // );

      socket.current.on('ice-candidate', handleIceCandidate);
      socket.current.on('mute', ({ userId }: { userId: string }) => {
        setMute(true, userId);
      });
      socket.current.on('un-mute', ({ userId }: { userId: string }) => {
        setMute(false, userId);
      });
      socket.current.emit('join', { roomId, user });
    };

    initChat();
    return () => {
      localMediaStream.current?.getTracks().forEach((track: any) => {
        track.stop();
      });

      for (let peerId in connections.current) {
        connections.current[peerId].close();
        delete connections?.current[peerId];
        delete audioElement?.current[peerId];
      }

      socket.current.emit('leave', { roomId, user });
      socket.current.off('session-description');
      socket.current.off('add-peer');
      socket.current.off('ice-candidate');
      socket.current.off('remove-peer');
    };
  }, []);

  const setMute = async (muted: boolean, userId: string) => {
    const clientIdx = clientsRef.current
      .map((client: { _id: string }) => client._id)
      .indexOf(userId);

    const connectedCLients: any = JSON.parse(
      JSON.stringify(clientsRef.current)
    );

    if (clientIdx > -1) {
      connectedCLients[clientIdx].isMuted = muted;
      setClients(connectedCLients);
    }
  };

  const handleRemoteSDP = async ({
    peerId,
    sessionDescription: remoteSessionDescription,
  }: any) => {
    await connections.current[peerId].setRemoteDescription(
      new RTCSessionDescription(remoteSessionDescription)
    );

    if (remoteSessionDescription.type === 'offer') {
      const connection = connections.current[peerId];
      const answer = await connection.createAnswer();

      await connection.setLocalDescription(answer);

      socket.current.emit('relay-sdp', {
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
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
          ],
        },
      ],
      iceCandidatePoolSize: 10,
    });
    connections.current[peerId].onicecandidate = async (event: any) => {
      if (event.candidate !== null) {
        await socket.current.emit('relay-ice', {
          peerId,
          icecandidate: event.candidate,
        });
      }
    };
    connections.current[peerId].ontrack = ({
      streams: [remoteStream],
    }: any) => {
      addNewUser({ ...remoteUser, isMuted: true }, () => {
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
      await socket.current.emit('relay-sdp', {
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
    user,
  }: {
    peerId: string;
    user: string;
  }) => {
    if (connections.current[peerId]) {
      connections.current[peerId].close();
    }
    delete connections.current[peerId];
    delete audioElement.current[peerId];
    setClients((list: User[]) =>
      list.filter((client: { _id: String }) => client._id !== user)
    );
  };

  const provideRef = (instance: any, userId: string) => {
    audioElement.current[userId] = instance;
  };

  const handleMute = (
    userId: string,
    isMuted: boolean,
    roomId: String | undefined
  ) => {
    let settled: boolean;
    let interval = setInterval(() => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks()[0].enabled = !isMuted;
        if (isMuted) {
          socket.current.emit('mute', { userId, isMuted, roomId });
        } else {
          socket.current.emit('un-mute', { userId, isMuted, roomId });
        }
        settled = true;
      }
      if (settled) {
        clearInterval(interval);
      }
    }, 200);
  };

  return { clients, provideRef, handleMute };
};
