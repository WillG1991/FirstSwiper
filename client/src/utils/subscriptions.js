import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
subscription OnMessagePosted($channelId: String!) {
  messagePosted(channelId: $channelId) {
      _id
      username
      text
      recipient
      createdAt
    }
  }
`;

export const FRIEND_REQUEST_SENT_SUBSCRIPTION = gql`
subscription OnFriendRequestSent($userId: ID!) {
  friendRequestSent(userId: $userId) {
    senderId
    senderUsername
    senderPhotoURL
    recipientId
    createdAt
  }
}
`;

export const MESSAGE_NOTIFICATION = gql`
subscription onMessageReceived($userId: ID!) {
  messageReceived(userId: $userId) {
    senderId
    senderUsername
    recipientId
  }
}
`;

export const USER_BLOCKED_SUBSCRIPTION = gql`
  subscription OnUserBlocked($userId: ID!) {
    userBlocked(userId: $userId) {
      success
      blockedUserId
    }
  }
`;


export default GET_MESSAGES;