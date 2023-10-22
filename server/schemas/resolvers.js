const { User, Message } = require("../models");
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const { signToken } = require("../utils/auth");
const { user } = require("firebase-functions/v1/auth");
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const bcrypt = require('bcrypt');
const { withFilter } = require('graphql-subscriptions');
const { createChannelId } = require('../utils/helperFunction');
const verifyRecaptcha = require('../utils/recaptcha');

const getLastMessage = async (userId1, userId2) => {
  const messages = await Message.find({
    $or: [
      { senderId: userId1, recipientId: userId2 },
      { senderId: userId2, recipientId: userId1 },
    ],
  }).sort({ createdAt: -1 });

  return messages[0] || null;
};

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_API_KEY,
    },
  })
);

// Resolvers Function Start//
const resolvers = {
  Query: {
    ///Connects to me query in typeDef//
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate({
            path: 'friendRequests.friendId',
            select: '_id username photoURL role description weight height ethnicity kinks gender position age ethnicity createdAt lastActive isHidden',
          })
          .populate({
            path: 'friends.friendId',
            select: '_id username photoURL role description height ethnicity kinks gender position age ethnicity createdAt lastActive isHidden',
          });
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
    //Gets All Users//
    users: async () => {
      const users = await User.find()
        .select("-__v -password")
        .populate({
          path: 'friends.friendId',
          select: 'username photoURL createdAt',
        })
        .populate({
          path: 'friendRequests',
          select: 'username photoURL createdAt',
        });

      return users;
    },
    user: async (parent, { username }, context) => {
      const user = await User.findOne({ username })
        .select("-__v -password")
        .populate({
          path: 'friends.friendId',
          select: '_id username photoURL createdAt',
          match: { isHidden: false }, // Exclude hidden friends
        })
        .populate({
          path: 'friendRequests.friendId',
          select: '_id username photoURL createdAt',
        });

      if (!user) {
        throw new Error("No user found with this username");
      }
      return user;
    },
    usersByRole: async (parent, { role, sortByDistance, userLocation, limit, offset }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id);
        let blockedUserIds = user.blockedUsers;
        const usersBlockingCurrentUser = await User.find({ blockedUsers: context.user._id });
        usersBlockingCurrentUser.forEach(userBlockingCurrentUser => {
          blockedUserIds.push(userBlockingCurrentUser._id);
        });

        // Get the friendIds from the user's friends array
        const friendIds = user.friends.map(friend => friend.friendId._id);

        if (sortByDistance) {
          const nearestUsers = await User.find({
            role,
            _id: {
              $nin: [...blockedUserIds, ...friendIds], // Exclude blocked users and friends
            },
            location: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: userLocation,
                },
              },
            },
          })
            .skip(offset)
            .limit(limit)
            .select("-__v -password");

          return nearestUsers;
        } else {
          return User.find({
            role,
            _id: {
              $nin: [...blockedUserIds, ...friendIds], // Exclude blocked users and friends
            },
          })
            .skip(offset)
            .limit(limit)
            .select("-__v -password");
        }
      } else {
        throw new AuthenticationError("Not logged in");
      }
    },
    usersById: async (parent, args, context) => {
      const users = await User.find({ "_id": { $in: args._id } }).select("-__v -password");

      const currentUser = await User.findById(context.user._id);
      const blockedUserIds = currentUser.blockedUsers.map((blockedUser) => blockedUser.toString());

      for (const user of users) {
        // Check if the user is blocked
        if (!blockedUserIds.includes(user._id.toString())) {
          user.lastMessage = await getLastMessage(context.user._id, user._id);
        } else {
          user.lastMessage = null; // Set lastMessage to null for blocked users
        }
      }

      return users;
    },
    messages: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Message.find(params).sort({ createdAt: -1 });
    },

    messagesToRecipient: async (parent, { username, recipient }, context) => {
      // if(context.user) {
      return Message.find({ username: username, recipient: recipient }).sort({ createdAt: -1 });
      // }
      // throw new AuthenticationError("Not logged in");
    },
    //unread count of messages//
    getUnreadMessageCount: async (_, { username }) => {
      const count = await Message.countDocuments({ recipient: username, read: false });
      return count;
    },
    getBlockedUsers: async (_parent, { myId }) => {
      try {
        const user = await User.findById(myId).populate("blockedUsers");
        return user;
      } catch (error) {
        console.error("Error fetching blocked users:", error);
        throw new Error("Error fetching blocked users");
      }
    },

    lastMessageBetweenUsers: async (parent, { username, recipient }, context) => {
      // if(context.user) {
      return Message.findOne({
        $or: [
          { username: username, recipient: recipient },
          { username: recipient, recipient: username },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(1);
      // }
      // throw new AuthenticationError("Not logged in");
    },
    lastReceivedMessages: async (_, { username }, context) => {
      const messages = await Message.aggregate([
        {
          $match: {
            recipient: username
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $group: {
            _id: "$username",
            message: { $first: "$$ROOT" }
          }
        },
        {
          $replaceRoot: { newRoot: "$message" }
        },
        {
          $sort: {
            createdAt: -1
          }
        }
      ]);

      return messages;
    },
    getDistinctUnreadMessageCount: async (_, { username }) => {
      const count = await Message.aggregate([
        {
          $match: {
            recipient: username,
            read: false
          }
        },
        {
          $group: {
            _id: "$username"
          }
        },
        {
          $count: "distinctUnreadSenders"
        }
      ]);

      return count.length > 0 ? count[0].distinctUnreadSenders : 0;
    },

  },

  /// --- Mutation Start --- ///
  Mutation: {
    // check user can be made
    validateUserCredentials: async (parent, args) => {
      const { username, email, password } = args;

      // Check if username, email, and password are provided
      if (!username || !email || !password) {
        return "Invalid credentials: Username, email, and password are required.";
      }

      // Check if the email is in a valid format (you can add more specific validation here)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return "Invalid credentials: Email is not in a valid format.";
      }

      // Add more specific validation for username and password if needed

      // If all checks pass, return a success message
      return "Credentials are valid";
    },
    //Creates New User//
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      // send verification email and token
      const buffer = await crypto.randomBytes(32);
      const verificationToken = buffer.toString('hex');
      const mailOptions = {
        to: user.email,
        from: 'admin@femswipe.com',
        subject: 'Swiper: Verify Your Account',
        text: `
          Please click on the following link, or paste this into your browser to complete the verification process within one hour of receiving it:
          \n
          http://localhost:3000/verify/${verificationToken}?email=${encodeURIComponent(user.email)}
        `,
      };
      const tokenAndEmail = `Verification email sent. Token: ${verificationToken} and ${user.email}}`;
      console.log(tokenAndEmail)
      await transporter.sendMail(mailOptions);
      // end verification email and token logic
      return { token, user };
    },
    verifyUser: async (parent, { email }) => {
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { isVerified: true },
        { new: true }
      );
      // Sign a new token
      const token = signToken(updatedUser);
      return { token, user: updatedUser };
      // return 'verified'
    },
    addUserKinks: async (parent, args, context) => { // this is how we can control kink addtions
      if (context.user) { // if logged in
        let combined = []
        const oldUserData = await User.findById( // first find the whole user data by ID
          { _id: context.user._id }
        )
        if (oldUserData.kinks.length) {
          const previousStrings = oldUserData.kinks; // grab their old kink/strings
          const passedArgs = args; // save the arguements its an object with an array inside...
          combined = [...previousStrings, ...passedArgs.kinks] // combine them, notice
          combined = combined.filter((item, index) => combined.indexOf(item) === index); // this will remove duplicate values for us
        } else {

          const passedArgs = args; // save the arguements its an object with an array inside...
          combined = [...passedArgs.kinks] // combine them, notice
          combined = combined.filter((item, index) => combined.indexOf(item) === index); // this will remove duplicate values for us
        }

        // console.log('combined array: ', combined) // checking the values in the terminal console

        const user = await User.findByIdAndUpdate( // and finally add the new combined array
          { _id: context.user._id },
          { $set: { kinks: combined } }, // use $set to replace the contents instead of making/adding new stuff
          { new: true }
        );
        const token = signToken(user);

        return { user, token };
      }

      throw new AuthenticationError("Not logged in");
    },
    deleteUserKinks: async (parent, args, context) => {
      if (context.user) {
        // console.log(args.kinks)
        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { kinks: { $in: args.kinks } } }, //sauce
          { new: true }
        );
        const token = signToken(user);

        return { user, token }
      }
      throw new AuthenticationError("Not logged in");

    },
    editUser: async (parent, args, context) => {
      if (context.user) {
        const updatedArgs = {
          ...args,
          lastActive: new Date() // Update lastActive to the current date and time
        };

        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          updatedArgs,
          { new: true }
        );

        const token = signToken(user);

        return { token, user };
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    //Mutation for login//
    login: async (parent, { identifier, password, recaptchaToken }) => {
      console.log("Received reCAPTCHA token:", recaptchaToken);
      // Verify reCAPTCHA token
      const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!isRecaptchaValid) {
        console.log("Invalid reCAPTCHA token");
        throw new Error('Invalid reCAPTCHA token');
      }

      console.log("isRecaptchaValid:", isRecaptchaValid);
      const caseInsensitiveIdentifier = new RegExp(`^${identifier}$`, 'i');

      const user = await User.findOneAndUpdate(
        { $or: [{ email: { $regex: caseInsensitiveIdentifier } }, { username: { $regex: caseInsensitiveIdentifier } }] },
        { $set: { lastActive: new Date() } },
        { new: true }
      );

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      // Check password
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id);

        // Check if the user has blocked the friend
        const blockedByCurrentUser = user.blockedUsers.includes(friendId);
        if (blockedByCurrentUser) {
          throw new Error("Cannot add friend. You have blocked this user. Please unblock them first.");
        }

        const friend = await User.findById(friendId);
        // Check if the friend has blocked the user
        const blockedByFriend = friend.blockedUsers.includes(context.user._id);
        if (blockedByFriend) {
          throw new Error("Cannot add friend. The user has blocked you.");
        }

        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              friends: {
                friendId: friendId,
                createdAt: new Date(),
              },
            },
            $pull: { friendRequests: { friendId: friendId } },
          },
          { new: true }
        ).populate("friends.friendId");

        // Publish the friend request only if both parties have not blocked each other
        if (!blockedByCurrentUser || !blockedByFriend) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
          pubsub.publish("FRIEND_REQUEST_SENT", {
            friendRequest: {
              senderId: context.user._id,
              senderUsername: context.user.username,
              senderPhotoURL: String(updatedUser.photoURL),
              recipientId: friendId,
              createdAt: new Date(),
            },
          });
        }

        return updatedUser;
      }

      // Error if not logged in
      throw new AuthenticationError('You need to be logged in!');
    },
    hideFriend: async (_, { friendId }, context) => {
      try {
        // Get the current user's ID from the context
        const currentUserId = context.user._id;

        // Find the user by ID
        const user = await User.findById(currentUserId);

        // Find the friend in the 'friends' array
        const friendIndex = user.friends.findIndex((friend) => friend.friendId.toString() === friendId);

        // Update the 'isHidden' field of the friend to 'true'
        user.friends[friendIndex].isHidden = true;

        // Save the updated user object
        await user.save();

        // Return the updated user object
        return user;
      } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        throw new Error('Failed to hide friend.');
      }
    },
    sendFriendRequest: async (parent, { friendId }, context) => {
      if (context.user) {
        const sender = await User.findById(context.user._id);

        // Check if sender user is found
        if (!sender) {
          throw new Error('Sender not found');
        }

        // Check if the sender has blocked the friend
        const blockedBySender = sender.blockedUsers.includes(friendId);
        if (blockedBySender) {
          throw new Error("Cannot send friend request. You have blocked this user.");
        }

        const receiver = await User.findOneAndUpdate(
          { _id: friendId },
          {
            $addToSet: {
              friendRequests: {
                friendId: sender._id,
                username: sender.username, // add username of the sender
                photoUrl: sender.photoURL, // add photoUrl of the sender
                createdAt: new Date()
              }
            },
          },
          { new: true }
        ).populate('friends.friendId');

        if (!receiver) {
          throw new Error('Receiver not found');
        }
        // Check if the friend has blocked the sender
        const blockedByFriend = receiver.blockedUsers.includes(context.user._id);
        if (blockedByFriend) {
          throw new Error("Cannot send friend request. The user has blocked you.");
        }
        return sender;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const [currentUser, friendToBeRemoved] = await Promise.all([
          User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { friends: { friendId: friendId } } },
            { new: true }
          ).populate('friends.friendId'),
          User.findOneAndUpdate(
            { _id: friendId },
            {
              $pull: { friends: { friendId: context.user._id } },
              $push: { friendRequests: { friendId: context.user._id } }
            },
            { new: true }
          ).populate('friends.friendId friendRequests.friendId')
        ]);

        return currentUser;
      }
      // Error if not logged in
      throw new AuthenticationError('You need to be logged in!');
    },
    addDislikedUser: async (parent, { dislikedUserId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { dislikedUsers: dislikedUserId } },
          { new: true }
        ).populate({
          path: 'dislikedUsers',
          select: 'username'
        });

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeDislikedUsers: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $set: { dislikedUsers: [] } },
          { new: true }
        ).populate('dislikedUsers');

        return updatedUser;
      }
      // Error if not logged in
      throw new AuthenticationError('You need to be logged in!');
    },
    postMessage: async (_, { username, text, recipient }) => {
      try {
        const sender = await User.findOne({ username: username });
        const recipientUser = await User.findOne({ username: recipient });

        // Check if the sender is blocked by the recipient
        const blockedByRecipient = recipientUser.blockedUsers.includes(sender._id);
        if (blockedByRecipient) {
          throw new Error("Cannot send message. The recipient has blocked you.");
        }

        // Check if the sender is in the recipient's friend list
        const isFriend = recipientUser.friends.some(
          (friend) => friend.friendId.toString() === sender._id.toString()
        );

        if (isFriend) {
          // Find the friend object and update the "isHidden" property if necessary
          const friendIndex = recipientUser.friends.findIndex(
            (friend) => friend.friendId.toString() === sender._id.toString()
          );

          if (recipientUser.friends[friendIndex].isHidden) {
            recipientUser.friends[friendIndex].isHidden = false;
            await recipientUser.save();
          }
        }

        const newMessage = new Message({
          text,
          username,
          recipient,
        });

        const savedMessage = await newMessage.save();

        // Update lastActive for the sender
        await User.findOneAndUpdate(
          { username: username },
          { lastActive: new Date() }
        );

        const channelId = createChannelId(username, recipient);
        const payload = {
          postCreated: {
            _id: savedMessage._id,
            text: savedMessage.text,
            username: savedMessage.username,
            recipient: savedMessage.recipient,
            createdAt: savedMessage.createdAt,
          },
        };

        // Publish the message only if the sender is not blocked by the recipient
        if (!blockedByRecipient) {
          // This publishes to the existing 'messagePosted' subscription
          await pubsub.publish(channelId, payload);

          // Add this line to publish to the new 'unmatchedUserMessage' subscription
          await pubsub.publish("UNMATCHED_USER_MESSAGE_" + recipient, payload);
        }

        return savedMessage;
      } catch (err) {
        throw err;
      }
    },
    //marks messages as read//
    updateMessage: async (parent, { id, input }) => {
      const { read } = input;
      const message = await Message.findByIdAndUpdate(
        id,
        { read: Boolean(read) }, // Convert the read value to a boolean
        { new: true }
      );
      return message;
    },
    // async requestResetPassword(_, { email }) {
    requestResetPassword: async (parent, { email }) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw new UserInputError('User not found');
        }

        const buffer = await crypto.randomBytes(32);
        const resetToken = buffer.toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        const mailOptions = {
          to: user.email,
          from: 'admin@femswipe.com',
          subject: 'Password Reset',
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
          \n
          Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:
          \n
          http://localhost:3000/reset/${resetToken}?email=${encodeURIComponent(user.email)}
          \n
          If you did not request this, please ignore this email and your password will remain unchanged.`,
        };

        await transporter.sendMail(mailOptions);
        return `Password reset email sent. Token: ${resetToken} and ${user.email}}`;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    resetPassword: async (parent, { resetToken, newPassword, email }) => {
      // Hash the new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the user's password
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { password: hashedPassword },
        { new: true }
      );
      // Sign a new token
      const token = signToken(updatedUser);
      return { token, user: updatedUser };
    },
    blockUser: async (_parent, { userId }, context) => {
      if (context.user) {
        try {
          const loggedInUserId = context.user._id;
          // Remove the blocked user from the logged-in user's friend list
          await User.findOneAndUpdate(
            { _id: loggedInUserId },
            { $pull: { friends: { friendId: userId } } }
          );
          // Remove the logged-in user from the blocked user's friend list
          await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { friends: { friendId: loggedInUserId } } }
          );
          // Block the user
          await User.findOneAndUpdate(
            { _id: loggedInUserId },
            { $addToSet: { blockedUsers: userId } }
          );
          // Publish the success value to the subscription
          // Retrieve the blocked user's ID
          const blockedUser = await User.findById(userId);
          const blockedUserId = blockedUser._id;
          await pubsub.publish('USER_BLOCKED', { userBlocked: { success: true, blockedUserId } });

          return {
            success: true,
          };
        } catch (error) {
          console.error('Error blocking user:', error);
          return {
            success: false,
          };
        }
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    reportUser: async (_parent, { userId, myId, reason }, context) => {
      if (context.user) {
        try {
          // Your logic here: report the user, update the database, etc.
          // For example, you can create a new Report model and save the report information

          const updatedUser = await User.findOneAndUpdate(
            { _id: myId },
            { $addToSet: { blockedUsers: userId } },
            { new: true }
          );

          return {
            success: true,
          };
        } catch (error) {
          console.error("Error reporting user:", error);
          return {
            success: false,
          };
        }
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    unblockUser: async (_parent, { userId }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { blockedUsers: userId } },
            { new: true }
          );

          return {
            success: true,
          };
        } catch (error) {
          console.error("Error unblocking user:", error);
          return {
            success: false,
          };
        }
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    deleteUser: async (parent, { myId }, context) => {
      try {
        const result = await User.findByIdAndDelete(myId);
        if (result) {
          return {
            success: true,
            message: 'User deleted successfully.',
          };
        } else {
          return {
            success: false,
            message: 'User not found.',
          };
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        return {
          success: false,
          message: 'Error deleting user.',
        };
      }
    },
    acceptFriendRequest: async (parent, { from }, context) => {
      if (context.user) {
        const receiver = await User.findByIdAndUpdate(context.user._id, {
          $addToSet: { friends: from },
          $pull: { friendRequests: from }
        }, { new: true });

        const sender = await User.findByIdAndUpdate(from, {
          $addToSet: { friends: context.user._id },
          $pull: { pendingFriends: context.user._id }
        }, { new: true });

        if (!sender) {
          throw new Error('Sender not found');
        }

        // Update lastActive for both the sender and receiver
        await Promise.all([
          User.findOneAndUpdate(
            { _id: context.user._id },
            { lastActive: new Date() }
          ),
          User.findOneAndUpdate(
            { _id: from },
            { lastActive: new Date() }
          )
        ]);

        return receiver;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    declineFriendRequest: async (parent, { friendId }, context) => {
      if (context.user) {
        const [updatedUser, updatedSender] = await Promise.all([
          User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { friendRequests: { friendId: friendId } } },
            { new: true }
          ).populate('friends.friendId'),
          User.findOneAndUpdate(
            { _id: friendId },
            { $pull: { sentRequests: { friendId: context.user._id } } },
            { new: true }
          )
        ]);

        return updatedUser;
      }

      // Error if not logged in
      throw new AuthenticationError('You need to be logged in!');
    },
  },
  Subscription: {
    messagePosted: {
      resolve: (payload) => {
        return payload.postCreated;
      },
      subscribe: withFilter(
        (_, { channelId }) => {
          let channelIds;

          if (Array.isArray(channelId)) {
            channelIds = channelId;
          } else {
            channelIds = channelId.split(','); // Split the channelId string by commas
          }

          return pubsub.asyncIterator(channelIds);
        },
        (payload, variables) => {
          const { channelId } = variables;
          let channelIds = Array.isArray(channelId) ? channelId : channelId.split(','); // Split the channelId string by commas
          const message = payload.postCreated;
          console.log('Filtering messages for channelIds:', channelIds);
          return channelIds.includes(createChannelId(message.recipient, message.username));
        }
      ),
    },
    friendRequestSent: {
      resolve: (payload) => {
        // console.log('Friend request sent:', payload.friendRequest);
        return payload.friendRequest;
      },
      subscribe: withFilter(
        () => {
          // console.log('Calling pubsub.asyncIterator with FRIEND_REQUEST_SENT');
          return pubsub.asyncIterator('FRIEND_REQUEST_SENT')
        },
        (payload, variables) => {
          // console.log('In withFilter function with payload:', payload, 'and variables:', variables);
          return payload.friendRequest.recipientId === variables.userId;
        }
      ),
    },
    userBlocked: {
      resolve: (payload) => {
        console.log('User blocked subscription fired:', payload);
        return payload.userBlocked;
      },
      subscribe: withFilter(
        () => {
          console.log('Calling pubsub.asyncIterator with USER_BLOCKED');
          return pubsub.asyncIterator('USER_BLOCKED');
        },
        (payload, variables) => {
          console.log('In withFilter function with payload:', payload, 'and variables:', variables);
          return payload.userBlocked.blockedUserId === variables.userId;
        }
      ),
    },
  },
}
/// ---- Resolvers Function End ---- ////

module.exports = resolvers;