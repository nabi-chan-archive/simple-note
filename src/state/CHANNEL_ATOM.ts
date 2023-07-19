import { atom } from "jotai";

const unReadMessageCount = atom(0);

const CHANNEL_ATOM = {
  unReadMessageCount,
};
export default CHANNEL_ATOM;
