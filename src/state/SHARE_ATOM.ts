import { atom } from "jotai";

const currentSharedId = atom<string>("");

const isSharedModalOpen = atom((get) => get(currentSharedId) !== "");

const openSharedModal = atom(null, (_, set, { id }: { id: string }) => {
  set(currentSharedId, id);
});

const SHARE_ATOM = {
  // base
  currentSharedId,

  // getter
  isSharedModalOpen,

  // setter
  openSharedModal,
};
export default SHARE_ATOM;
