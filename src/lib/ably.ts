// lib/ably.ts
import { Realtime } from "ably";
if (!process.env.NEXT_PUBLIC_ABLY_API_KEY) {
  throw new Error("ABLY_API_KEY is not set in environment variables.");
}
const ably = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY || "" });

export const ablyChannelLike = ably.channels.get("likes");

export default ably;
