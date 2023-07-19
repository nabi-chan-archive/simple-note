import { env } from "@/env.mjs";
import SHARE_ATOM from "@/state/SHARE_ATOM";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useAtomValue } from "jotai";
import { type FormEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function useShare() {
  const trpc = api.useContext();

  const [tabId, setTabId] = useAtom(SHARE_ATOM.currentSharedId);
  const isModalOpen = useAtomValue(SHARE_ATOM.isSharedModalOpen);

  const [isFormReset, setIsFormReset] = useState(false);
  const { data: sharedInfo } = api.share.info.useQuery(
    { tabId },
    { enabled: !!tabId }
  );
  const { mutate: updateSharedInfo, isLoading } =
    api.share.update.useMutation();

  const {
    register,
    handleSubmit: onSubmit,
    reset,
    formState,
  } = useForm({
    resolver: zodResolver(
      z.object({
        isShareActive: z.boolean().nullable(),
        expiredAt: z.string().nullable(),
      })
    ),
    defaultValues: {
      isShareActive: sharedInfo?.isShareActive ?? false,
      expiredAt: String(sharedInfo?.expiredAt ?? ""),
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  const shareLink = sharedInfo
    ? `${env.NEXT_PUBLIC_BASE_URL}/shared/${sharedInfo.id}`
    : "";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) =>
    void onSubmit((data) => {
      console.log(data);
      updateSharedInfo(
        {
          shareId: sharedInfo?.id ?? "",
          isShareActive: data.isShareActive,
          expiredAt: data.expiredAt ? new Date(data.expiredAt) : undefined,
        },
        {
          onSuccess: () => {
            void trpc.share.info.invalidate({ tabId });
          },
        }
      );
    })(e);

  const submitForm = () =>
    formRef.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );

  const handleShareModalClose = () => {
    reset();
    setIsFormReset(false);
    setTabId("");
  };

  const handleShareLinkCopy = () => {
    void globalThis.navigator.clipboard.writeText(shareLink);
  };

  if (!!sharedInfo && !isFormReset) {
    console.log(sharedInfo);
    reset({
      isShareActive: sharedInfo.isShareActive,
      expiredAt: String(sharedInfo.expiredAt ?? ""),
    });
    setIsFormReset(true);
  }

  return {
    isModalOpen,

    shareLink,
    sharedInfo,

    formRef,

    register,
    handleSubmit,
    disabled: !formState.isDirty || isLoading,
    submitForm,

    handleShareLinkCopy,
    handleShareModalClose,
  };
}
