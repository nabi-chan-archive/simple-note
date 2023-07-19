import { useSideMenu } from "@/components/Layout/ButtonMenu/hooks/useSideMenu";
import CHANNEL_ATOM from "@/state/CHANNEL_ATOM";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useSession } from "next-auth/react";
import { FaHamburger } from "react-icons/fa";

export default function ButtonMenu() {
  const { status } = useSession();
  const { isOpen, toggleOpen, buttonList, modal } = useSideMenu();
  const unReadCount = useAtomValue(CHANNEL_ATOM.unReadMessageCount);

  if (status !== "authenticated") return null;

  return (
    <>
      <motion.aside className="fixed bottom-4 right-4 flex flex-col items-center gap-2">
        <motion.ul
          className="flex flex-col gap-2"
          initial={false}
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: {
              transition: {
                staggerChildren: 0.07,
                staggerDirection: -1,
              },
            },
            close: {
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          {buttonList.map(({ icon, customButton, ...button }) => (
            <motion.li
              key={button.title}
              variants={{
                open: {
                  opacity: 1,
                  y: 0,
                },
                closed: {
                  opacity: 0,
                  y: 25,
                },
              }}
            >
              {customButton ? (
                customButton({
                  ...button,
                  children: icon,
                  btnClassName: "btn btn-square btn-secondary btn-sm",
                })
              ) : (
                <motion.button
                  {...button}
                  className="btn btn-square btn-secondary btn-sm"
                >
                  {icon}
                </motion.button>
              )}
            </motion.li>
          ))}
        </motion.ul>
        <div className="indicator">
          {unReadCount ? (
            <span className="badge indicator-item badge-secondary right-[3px] z-20">
              {unReadCount}
            </span>
          ) : null}
          <button
            onClick={() => toggleOpen()}
            className="btn btn-square btn-primary z-10 text-xl text-white"
          >
            <FaHamburger />
          </button>
        </div>
      </motion.aside>
      {modal}
    </>
  );
}
