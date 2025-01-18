import Ably from "ably";

const ablyClient = new Ably.Realtime(
  process.env.NEXT_PUBLIC_ABLY_API_KEY || ""
);

export const ablyChannelLike = ablyClient.channels.get("likes");

export default ablyClient;
