import mongoose from 'mongoose';


const channelMessageSchema = new mongoose.Schema({
  channelUsername: { type: String, required: true },
  messageId: { type: Number, required: true },
  text: { type: String, required: true },
  postedAt: { type: Date, required: true }
});

channelMessageSchema.index(
  { channelUsername: 1, messageId: 1 },
  { unique: true }
);


const channelSchema = new mongoose.Schema({
  channelUsername: { type: String, required: true, unique: true },
  channelTitle: String,
  photoBase64: String
});


const userChannelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  channelUsername: { type: String, required: true },
  type: { type: String, enum: ["recent", "saved"] },
  lastInteractedAt: { type: Date, default: Date.now }
});

userChannelSchema.index(
  { userId: 1, channelUsername: 1, type: 1 },
  { unique: true }
);


const ChannelMessage = mongoose.model('channelMessage', channelMessageSchema);
const Channel = mongoose.model('channels', channelSchema);
const UserChannelActivity = mongoose.model('userActivity', userChannelSchema);

export { ChannelMessage, Channel, UserChannelActivity };