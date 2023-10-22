const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must match an email address!'],

    },
    password: {
      type: String,
      required: true,
      minlength: 5
    },
    isVerified: {
      type: Boolean,
      required: false,
      default: false
    },
    age: {
      type: String,
      required: false,
      unique: false,
    },
    height: {
      type: String,
      trim: true
    },
    weight: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      trim: true
    },
    ethnicity: {
      type: String,
      trim: true
    },
    gender: {
      type: String,
      required: false,
    },
    position: {
      type: String,
      required: false,
    },
    photoURL: {
      type: [String],
      validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
      trim: true
    },
    kinks: {
      type: [String],
      required: false,
      unique: false
    },
    description: {
      type: String,
      trim: true
    },
    location: {
      type: [Number],
      index: '2dsphere', // Create the special 2dsphere index on 'location'
      required: false,
      unique: false,
      trim: true
    },
    lastActive: {
      type: Date
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message'
      }
    ],
    friends: [
      {
        friendId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isHidden: {
          type: Boolean,
          default: false,
        },
      }
    ],
    blockedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    //These are friend request that the user has received//
    friendRequests: [
      {
        friendId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }
    ],
    //these are friend requests that the user has sent and are waiting to be accepted
    pendingFriends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    reports: [
      {
        reportedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        reason: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    reportCount: { type: Number, default: 0 },
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);


//allow no more then four photos
function arrayLimit(val) {
  return val.length <= 4;
}

// set up pre-save middleware to create password and update lastActive
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});


// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});



/////LAST ACTIVE STATUS ADD////CHECK RESOLVERS FOR 
// Update the lastActive field and status before saving
userSchema.pre('save', function (next) {
  this.lastActive = new Date(); // Update lastActive to the current date and time
  next();
});

const User = model('User', userSchema);

module.exports = User;