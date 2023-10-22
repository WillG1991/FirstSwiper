import { gql } from '@apollo/client';


export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      friendCount
      age
      role
      position
      gender
      photoURL
      gender
      position
      lastActive
      friends {
        friendId {
          _id
          username
        }
        createdAt
      }
      dislikedUsers {
        _id
        username
      }
    }
  }
`;

export const GET_UNREAD_MESSAGE_COUNT = gql`
  query getUnreadMessageCount($username: String!) {
    getUnreadMessageCount(username: $username) 
  }
`;

export const QUERY_USERS = gql`
query Users {
  users {
    _id
    friends {
      friendId {
        _id
        username
      }
      createdAt
    }
    dislikedUsers {
      _id
      username
    }
    username
    age
    height
    weight
    ethnicity
    position
    role
    gender
    position
    photoURL
    lastActive
    description
    location
  }
}
`;

export const QUERY_USERS_BY_ROLE = gql`
  query usersByRole(
    $role: String!
    $sortByDistance: Boolean
    $kink: String
    $position: String
    $ethnicity: String
    $gender: String
    $userLocation: [Float!]
    $active: Boolean
  ) {
    usersByRole(
      role: $role
      sortByDistance: $sortByDistance
      kink: $kink
      position: $position
      ethnicity: $ethnicity
      gender: $gender
      userLocation: $userLocation
      active: $active
    ) {
      _id
      username
      age
      height
      weight
      ethnicity
      role
      gender
      position
      photoURL
      description
      location
      lastActive
      kinks
      dislikedUsers {
        _id
        username
      }
    }
  }
`;


export const QUERY_USERS_BY_ID = gql`
query usersById($_id: [ID!]) {
  usersById(_id: $_id) {
    _id
    username
    kinks
    role
    gender
    position
    gender
    photoURL
    lastActive
  }
}
`;

export const QUERY_ME = gql`
  query Query {
    me {
      _id
      username
      weight
      height
      ethnicity
      role
      gender
      position
      age
      kinks
      location
      photoURL
      friends {
        friendId {
          _id
          username
        }
        createdAt
        isHidden
      }
      dislikedUsers {
        _id
        username
      }
      friendRequests {
        friendId {
          _id
          username
          photoURL
          role
          description
          age
          height
          weight
          gender
          position
          ethnicity
          lastActive
        }
        createdAt
      }
      description
      photoURL
    }
  }
`;




export const QUERY_MESSAGES = gql`
query messages {
  messages {
    createdAt
    recipient
    text
    username
    _id
  }
}
`;

export const QUERY_MESSAGES_TO_RECIPIENT = gql`
query messagesToRecipient($username: String!, $recipient: String!) {
  messagesToRecipient(username: $username, recipient: $recipient) {
    _id
    username
    recipient
    createdAt
    text
  }
}
`;

export const QUERY_MESSAGES_BETWEEN_USERS = gql`
  query messagesBetweenUsers($user1: String!, $user2: String!) {
    messagesBetweenUsers(user1: $user1, user2: $user2) {
      _id
      createdAt
      recipient
      text
      username
    }
  }
`;


export const QUERY_CHAT_PARTNER = gql`
  query chatPartner($username: String!) {
    user(username: $username) {
      _id
      username
      age
      height
      weight
      ethnicity
      role
      gender
      position
      photoURL
      description
      location
      kinks
      lastActive
    }
  }
`;

export const LAST_MESSAGE_BETWEEN_USERS = gql`
  query LastMessageBetweenUsers($username: String!, $recipient: String!) {
    lastMessageBetweenUsers(username: $username, recipient: $recipient) {
      _id
      username
      recipient
      text
      createdAt
    }
  }
`;


export const LAST_RECEIVED_MESSAGES = gql`
  query LastReceivedMessages($username: String!) {
    lastReceivedMessages(username: $username) {
      _id
      username
      recipient
      text
      createdAt
      read
    }
  }
`;

export const GET_BLOCKED_USERS = gql`
  query GetBlockedUsers($myId: ID!) {
    getBlockedUsers(myId: $myId) {
      blockedUsers {
        _id
        username
        photoURL
      }
    }
  }
`;


export const QUERY_FRIEND_REQUESTS = gql`
  query QueryFriendRequests {
    friendRequests {
      id
      user {
        username
        role
        description
      }
      createdAt
      lastActive
    }
  }
`;