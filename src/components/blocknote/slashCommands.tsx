import { type BlockSchema } from "@blocknote/core";
import { type ReactSlashMenuItem } from "@blocknote/react";
import { AiOutlineDash } from "react-icons/ai";
import { RiH1, RiText, RiListCheck, RiListOrdered } from "react-icons/ri";

export const slashCommands: ReactSlashMenuItem<BlockSchema>[] = [
  {
    name: "소제목",
    execute: (editor) => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "heading",
        props: {
          level: "3",
        },
      });
    },
    aliases: [],
    shortcut: "Ctrl+Alt+1",
    group: "Text",
    icon: <RiH1 />,
    hint: "소제목을 만듭니다",
  },
  {
    name: "본문",
    execute: (editor) => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "paragraph",
      });
    },
    aliases: ["paragraph", "text", "content", "p"],
    group: "Text",
    icon: <RiText />,
    hint: "본문을 만듭니다",
  },
  {
    name: "순서가 없는 목록",
    execute: (editor) => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "bulletListItem",
      });
    },
    aliases: ["list", "bullet", "ul"],
    group: "List",
    icon: <RiListCheck />,
    hint: "순서가 없는 목록을 만듭니다",
  },
  {
    name: "순서가 있는 목록",
    execute: (editor) => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "orderedListItem",
      });
    },
    aliases: ["ordered", "ol"],
    group: "List",
    icon: <RiListOrdered />,
    hint: "순서가 있는 목록을 만듭니다",
  },
  {
    name: "한줄 구분선",
    execute: (editor) => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "singleLine",
      });
    },
    aliases: ["line", "singe", "---", "hr"],
    group: "Line",
    icon: <AiOutlineDash />,
    hint: "구분선을 만듭니다",
  },
  {
    name: "두줄 구분선",
    execute: (editor) => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "doubleLine",
      });
    },
    aliases: ["line", "double", "===", "hr"],
    group: "Line",
    icon: <AiOutlineDash />,
    hint: "구분선을 만듭니다",
  },
];
