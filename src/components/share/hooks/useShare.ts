import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { type FormEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { env } from "@/env.mjs";
import SHARE_ATOM from "@/state/SHARE_ATOM";
import { api } from "@/utils/api";

export function useShare() {
  const trpc = api.useContext();

  const [tabId, setTabId] = useAtom(SHARE_ATOM.currentSharedId);
  const setSelectedTabId = useSetAtom(SHARE_ATOM.currentSharedId);
  const isModalOpen = useAtomValue(SHARE_ATOM.isSharedModalOpen);

  const [isFormReset, setIsFormReset] = useState(false);
  const { data: sharedInfo } = api.share.info.useQuery(
    { tabId },
    { enabled: !!tabId }
  );
  const { mutate: updateSharedInfo, isLoading } =
    api.share.update.useMutation();
  const { mutate: createSharedInfo } = api.share.create.useMutation();

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
            toast.success("공유 설정이 변경되었어요.");
            setSelectedTabId("");
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

  const handleShareLinkCreate = () => {
    createSharedInfo(
      { tabId },
      {
        onSuccess: () => {
          void trpc.share.info.invalidate({ tabId });
          toast.success("공유 링크가 생성되었어요.");
          setIsFormReset(false);
        },
      }
    );
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

    handleShareLinkCreate,

    handleShareLinkCopy,
    handleShareModalClose,
  };
}
