import { gql } from "@apollo/client";

export const VALIDATE_USER_CREDENTIALS = gql`
  mutation validateUserCredentials($username: String!, $email: String!, $password: String!) {
    validateUserCredentials(username: $username, email: $email, password: $password)
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!, $position: String, $role: String, $gender: String, $kinks: [Kinks], $ethnicity: String, $photoURL: String ) {
    addUser(username: $username, email: $email, password: $password, position: $position, role: $role, gender: $gender, kinks: $kinks, ethnicity: $ethnicity, photoURL: $photoURL ) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const CHANGE_EMAIL = gql`
  mutation changeEmail($newEmail: String!, $password: String!) {
    changeEmail(newEmail: $newEmail, password: $password) {
      _id
      username
      email
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation changePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
  }
`;

export const VERIFY_USER = gql`
  mutation verifyUser($verificationToken: String!, $email: String!) {
    verifyUser (verificationToken: $verificationToken, email: $email) {
      token
    }
  }
`;

export const EDIT_USER = gql`
  mutation editUser($username: String, $age: String, $weight: String, $height: String, $role: String, $gender: String, $position: String, $ethnicity: String, $description: String, $photoURL: [String], $location: [Float]) {
    editUser(username: $username, age: $age, weight: $weight, height: $height, role: $role, gender: $gender, position: $position, ethnicity: $ethnicity, description: $description, photoURL: $photoURL, location: $location) {
      token
      user {
        _id
        username
        weight
        height
        age
        role
        gender
        position
        ethnicity
        description
        photoURL
        location
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($identifier: String!, $password: String!, $recaptchaToken: String!) {
    login(identifier: $identifier, password: $password, recaptchaToken: $recaptchaToken) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER_KINKS = gql`
  mutation addUserKinks($kinks: [Kinks]) {
    addUserKinks(kinks: $kinks) {
      token
      user {
        _id
        username
        kinks
      }
    }
  }
`;

export const DELETE_USER_KINKS = gql`
  mutation deleteUserKinks($kinks: [Kinks]) {
    deleteUserKinks(kinks: $kinks) {
      token
      user {
        _id
        username
        kinks
      }
    }
  }
`;

export const REMOVE_FRIEND = gql`
  mutation removeFriend($id: ID!) {
    removeFriend(friendId: $id) {
      _id
      username
      friendCount
      friends {
        friendId {
          _id
          username
          email
        }
        createdAt
      }
    }
  }
`;

export const ACCEPT_FRIEND = gql`
  mutation AcceptFriend($id: ID!) {
    acceptFriend(id: $id) {
      _id
      username
      friendCount
      friends {
        friendId {
          _id
          username
          email
        }
        createdAt
      }
    }
  }
`;

export const BLOCK_USER = gql`
  mutation BlockUser($userId: ID!) {
    blockUser(userId: $userId) {
      success
    }
  }
`;

export const ADD_DISLIKED_USER = gql`
  mutation addDislikedUser($dislikedUserId: ID!) {
    addDislikedUser(dislikedUserId: $dislikedUserId) {
      _id
      username
      dislikedUsers {
        _id
        username
      }
    }
  }
`;

export const REPORT_USER = gql`
  mutation ReportUser($userId: ID!, $myId: ID!, $reason: String!) {
    reportUser(userId: $userId, myId: $myId, reason: $reason) {
      success
    }
  }
`;

export const REMOVE_DISLIKED_USERS = gql`
  mutation {
    removeDislikedUsers {
      _id
      username
      dislikedUsers {
        _id
        username
      }
    }
  }
`;

export const UNBLOCK_USER = gql`
  mutation UnblockUser($userId: ID!) {
    unblockUser(userId: $userId) {
      success
    }
  }
`;

export const POST_MESSAGE = gql`
mutation postMessage($username: String, $text: String, $recipient: String) {
  postMessage (username: $username, text: $text, recipient: $recipient) {
    _id
    text
    username
    recipient
    createdAt
  }
}
`;

export const POST_CHAT_MESSAGE = gql`
  mutation postChatMessage($username: String!, $text: String!, $recipient: String!) {
    postChatMessage(username: $username, text: $text, recipient: $recipient) {
      id
      text
      createdAt
      username
      recipient
    }
  }
`;


export const UPDATE_MESSAGE = gql`
  mutation UpdateMessage($id: ID!) {
    updateMessage(id: $id, input: { read: true }) {
      _id
      read
    }
  }
`;

export const REQUEST_RESET_PASSWORD = gql`
  mutation requestResetPassword($email: String!) {
    requestResetPassword(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($resetToken: String!, $newPassword: String!, $email: String!) {
    resetPassword(resetToken: $resetToken, newPassword: $newPassword, email: $email) {
      token
      user {
        _id
        email
      }
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriend($friendId: ID!) {
    addFriend(friendId: $friendId) {
      _id
      username
      friends {
        friendId {
          _id
          username
          email
        }
        createdAt
      }
    }
  }
`;

export const SEND_FRIEND_REQUEST = gql`
  mutation SendFriendRequest($friendId: ID!) {
    sendFriendRequest(friendId: $friendId) {
      _id
      username
      friends {
        friendId {
          _id
          username
          email
        }
        createdAt
      }
    }
  }
`;



export const ACCEPT_FRIEND_REQUEST = gql`
  mutation AcceptFriendRequest($userId: ID!, $friendId: ID!) {
    acceptFriendRequest(userId: $userId, friendId: $friendId) {
      _id
      username
      friends {
        friendId {
          _id
          username
          email
        }
        createdAt
      }
      pendingFriends {
        _id
        username
      }
    }
  }
`;

export const DECLINE_FRIEND_REQUEST = gql`
  mutation DeclineFriendRequest($friendId: ID!) {
    declineFriendRequest(friendId: $friendId) {
      _id
      username
    }
  }
`;

export const HIDE_FRIEND = gql`
  mutation HideFriend($friendId: ID!) {
    hideFriend(friendId: $friendId) {
      _id
      username
      friends {
        friendId {
          _id
          username
        }
        createdAt
        isHidden
      }
    }
  }
`;