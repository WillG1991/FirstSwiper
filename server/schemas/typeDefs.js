/// -- import the gql tagged template function -- ///
const { gql } = require("graphql-tag");


/// ----  create our typeDefs ---- ///
const typeDefs = gql`

  enum Kinks {
    BIMBOFICATION
    BDSM
    BONDAGE
    BREEDING
    CHASTITY
    DOMINATION
    FEET
    FEMINIZATION
    GROUP
    GIRLFRIENDEXPERIENCE
    HUMILIATION
    HYPNO
    LATEX
    LINGERIE
    MAID
    RAW
    RECORDING
    SISSIFICATION
    SISSYBRIDE
    SHOWOFF
    VERBAL
  }
  type Message {
    _id: ID
    username: String
    text: String
    createdAt: String
    recipient: String
    imageURL: String
    read: Boolean
  }

  input MessageInput {
    read: Boolean
  }

  type Friend {
    friendId: User
    createdAt: String!
    isHidden: Boolean
  }  

  type User {
    _id: ID
    username: String
    age: String
    email: String
    isVerified: Boolean
    height: String
    weight: String
    role: String
    gender: String
    position: String
    photoURL: [String]
    ethnicity: String
    description: String
    friendCount: Int
    kinks: [Kinks]
    friends: [Friend]
    blockedUsers: [User]
    dislikedUsers: [User]
    messages: [Message]
    location: [Float]
    lastActive: String   
    lastMessage(currentUserId: ID!): Message
    pendingFriends: [User]
    friendRequests: [Friend]
  }

  type BlockUserResult {
    success: Boolean!
  }

  type ReportUserResult {
    success: Boolean!
  }
  type Auth {
    token: ID!
    user: User
  }
  type Subscription {
    friendRequestSent(userId: ID!): FriendRequestNotification!
    messagePosted(channelId: String!): Message
    userBlocked(userId: ID!): UserBlockedNotification!
  }
  type UserBlockedNotification {
    success: Boolean!
    blockedUserId: ID!
  }
  type FriendRequestNotification {
    senderId: ID!
    senderUsername: String!
    senderPhotoURL: String
    recipientId: ID!
    createdAt: String!
  }

  type FriendRequest {
    sender: User
    createdAt: String
  }

  type DeleteUserResult {
    success: Boolean!
    message: String
  }

  type RecaptchaVerificationResponse {
    success: Boolean!
    challenge_ts: String
    hostname: String
    error_codes: [String]
  }
    
  type Query {
    me: User
    users: [User]
    user(username: String!): User
    usersByRole(role: String!): [User]
    usersById(_id: [ID!]): [User]
    messages: [Message!]  
    messagesToRecipient(username: String!, recipient: String!): [Message!]
    getBlockedUsers(myId: ID!): User
    lastMessageBetweenUsers(username: String!, recipient: String!): Message
    lastReceivedMessages(username: String!): [Message!]
    getUnreadMessageCount(username: String!): Int!
    getDistinctUnreadMessageCount(username: String!): Int!
  }
  
  type Mutation {
    login(identifier: String!, password: String!, recaptchaToken: String!): Auth
    validateUserCredentials(username: String!, email: String!, password: String!): String!
    addUser(username: String!, email: String!, password: String!): Auth
    verifyUser(verificationToken: String!, email: String!): Auth
    editUser(username: String, age: String, height: String, weight: String, role: String, gender: String, position: String, ethnicity: String, description: String, photoURL: [String], location: [Float]): Auth
    addUserKinks(kinks: [Kinks]) : Auth
    deleteUserKinks(kinks: [Kinks]) : Auth
    addFriend(friendId: ID!): User
    acceptFriend(id: ID!): User
    removeFriend(friendId: ID!): User
    addDislikedUser( dislikedUserId: ID!): User
    removeDislikedUsers: User
    postMessage(username: String, text: String, recipient: String): Message
    updateMessage(id: ID!, input: MessageInput): Message
    requestResetPassword(email: String!): String
    resetPassword(resetToken: String!, newPassword: String!, email: String!): Auth
    blockUser(userId: ID!): BlockUserResult!
    reportUser(userId: ID!, myId: ID!, reason: String!): ReportUserResult!
    unblockUser(userId: ID!): BlockUserResult!
    deleteUser(myId: ID!): DeleteUserResult
    updateUserLastActive(userId: ID!): User!
    sendFriendRequest(friendId: ID!): User
    acceptFriendRequest(userId: ID!, friendId: ID!): User
    declineFriendRequest(friendId: ID!): User
    hideFriend(friendId: ID!): User
  }
`;

// export the typeDefs
module.exports = typeDefs;