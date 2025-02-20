export const ICE_SERVERS = [
  {
    urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
  },
];

export const PEER_CONFIG = {
  iceServers: ICE_SERVERS,
  iceCandidatePoolSize: 10,
};

export const SOCKET_EVENTS = {
  ADD_PEER: 'add-peer',
  REMOVE_PEER: 'remove-peer',
  ICE_CANDIDATE: 'ice-candidate',
  SESSION_DESCRIPTION: 'session-description',
  MUTE: 'mute',
  UNMUTE: 'unmute',
} as const;
