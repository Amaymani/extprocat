import mongoose from "mongoose";

const ZohoTokenSchema = new mongoose.Schema({
  access_token: String,
  refresh_token: String,
  expires_at: Number, // timestamp in ms
}, { timestamps: true });

export default mongoose.models.ZohoToken || mongoose.model("ZohoToken", ZohoTokenSchema);
