import { Socket } from 'socket.io-client';
import { User, RoomUser as BaseRoomUser } from '../types.defined';

export type { User, BaseRoomUser as RoomUser };

export interface SocketEvents {
  'add-peer': (data: {
    peerId: string;
    createOffer: boolean;
    user: User;
  }) => void;
  'remove-peer': (data: { peerId: string }) => void;
  'ice-candidate': (data: {
    peerId: string;
    candidate: RTCIceCandidate;
  }) => void;
  'session-description': (data: {
    peerId: string;
    sessionDescription: RTCSessionDescription;
  }) => void;
  mute: (data: { userId: string }) => void;
  'un-mute': (data: { userId: string }) => void;
}
