import { Schema, model } from 'mongoose';

const UsageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  serverId: {
    type: String,
    required: true,
  },

  bandWidthIn: {
    type: Number,
    default: 0,
  },

  bandWidthOut: {
    type: Number,
    default: 0,
  },

  month: {
    type: Date,
    required: true,
  },

  type: {
    type: String,
    enum: ["nativenode", "domain"],
    required: true,
  },

}, { timestamps: true })

const Usage = model("Usage", UsageSchema)

export default Usage
