import { type ReactNode } from "react";

type ModalProps = {
  defaultOpen?: boolean;

  id: string;

  title: ReactNode;
  body: ReactNode;
  actions?: ReactNode;

  onClose: () => void;
};

export default function Modal({
  defaultOpen,
  id,
  title,
  body,
  actions,
  onClose,
}: ModalProps) {
  return (
    <dialog
      open={defaultOpen}
      id={id}
      className="modal modal-bottom sm:modal-middle"
      onClose={onClose}
    >
      <div className="modal-box z-50">
        {typeof title === "string" ? (
          <h3 className="text-lg font-bold">{title}</h3>
        ) : (
          title
        )}
        <div className="py-4">{body}</div>
        <form method="dialog" className="modal-action">
          {actions}
          {!actions && <button className="btn btn-primary btn-sm">닫기</button>}
        </form>
      </div>
      <form method="dialog" className="modal-backdrop z-40 bg-black/40">
        <button>닫기</button>
      </form>
      <form method="dialog" className="modal-backdrop pointer-events-none z-30">
        <button>닫기</button>
      </form>
    </dialog>
  );
}
