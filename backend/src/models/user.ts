import { Schema, model } from 'mongoose'

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      required: [
        function (this: any) {
          return !this.isGoogleAuth
        },
        'Password is required for non-google auth users',
      ],
    },

    token: [{ type: String }],

    verified: {
      type: Boolean,
      default: false,
    },

    isGoogleAuth: {
      type: Boolean,
      default: false,
    },

    verifiyOtp: {
      type: Number,
    },

    totalUsage: { type: Number, default: 0 },
    streamCosts: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
)

const User = model('User', UserSchema)

export default User
