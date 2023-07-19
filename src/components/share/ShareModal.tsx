import Modal from "../utils/Modal";
import { FaCopy } from "react-icons/fa";
import { useShare } from "./hooks/useShare";

export default function ShareModal() {
  const {
    isModalOpen,

    shareLink,
    sharedInfo,

    formRef,

    register,
    handleSubmit,
    disabled,
    submitForm,

    handleShareLinkCopy,
    handleShareModalClose,
  } = useShare();

  if (!sharedInfo) {
    return (
      <Modal
        defaultOpen={isModalOpen}
        id="share-modal-not-shared"
        title="아직 공유가 되지 않은 노트입니다."
        body={
          <>
            <p className="mb-2">공유를 시작하시겠어요?</p>
            <ul className="list-inside list-disc text-sm">
              <li>한번 만들어진 링크는 삭제를 할 수 없어요.</li>
              <li>공유가 시작되어도 공유를 언제나 중지할 수 있어요.</li>
            </ul>
          </>
        }
        actions={
          <>
            <button type="button" className="btn btn-primary btn-sm">
              네!
            </button>
            <button type="submit" className="btn btn-secondary btn-sm">
              아니요, 돌아갈래요!
            </button>
          </>
        }
        onClose={handleShareModalClose}
      />
    );
  }

  return (
    <Modal
      defaultOpen={isModalOpen}
      id="share-modal-setting"
      title="공유설정"
      body={
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2"
          ref={formRef}
        >
          <label className="flex items-center gap-1">
            <span className="flex-1">공유 여부</span>
            <div className="flex flex-[3] items-center">
              <input
                {...register("isShareActive", {
                  required: false,
                })}
                className="checkbox-primary checkbox"
                type="checkbox"
              />
            </div>
          </label>

          <label className="flex items-center gap-1">
            <span className="flex-1">공유 주소</span>
            <div className="flex flex-[3] items-center">
              <input
                className="input input-bordered mr-2 flex-1"
                type="text"
                readOnly
                value={shareLink}
              />
              <button
                type="button"
                className="btn btn-square btn-sm"
                onClick={handleShareLinkCopy}
              >
                <FaCopy />
              </button>
            </div>
          </label>

          <label className="flex items-center gap-1">
            <span className="flex-1">공유 만료일</span>
            <div className="flex flex-[3] items-center">
              <input
                {...register("expiredAt", {
                  required: false,
                })}
                type="date"
                className="input input-bordered mr-2 flex-1"
              />
            </div>
          </label>
        </form>
      }
      actions={
        <>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={disabled}
            onClick={submitForm}
          >
            저장하기
          </button>
          <button type="submit" className="btn btn-secondary btn-sm">
            닫기
          </button>
        </>
      }
      onClose={handleShareModalClose}
    />
  );
}
