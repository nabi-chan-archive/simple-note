import { type ReactNode } from "react";

type ModalProps = {
  defaultOpen?: boolean;

  id: string;

  title: ReactNode;
  body: ReactNode;

  onClose: () => void;
};

export default function Modal({
  defaultOpen,
  id,
  title,
  body,
  onClose,
}: ModalProps) {
  return (
    <dialog
      open={defaultOpen}
      id={id}
      className="modal modal-bottom sm:modal-middle"
      onClose={onClose}
    >
      <form method="dialog" className="modal-box z-50">
        {typeof title === "string" ? (
          <h3 className="text-lg font-bold">{title}</h3>
        ) : (
          title
        )}
        <div className="py-4">{body}</div>
        <div className="modal-action">
          <button className="btn btn-primary btn-sm">닫기</button>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop z-40 bg-black/40">
        <button>닫기</button>
      </form>
      <form method="dialog" className="modal-backdrop pointer-events-none z-30">
        <button>닫기</button>
      </form>
    </dialog>
  );
}
