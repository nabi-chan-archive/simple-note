import { ReactSlashMenuItem } from "@blocknote/react";
import { RiH1, RiText, RiListCheck, RiListOrdered } from "react-icons/ri";
import { AiOutlineDash } from "react-icons/ai";

export const slashCommands = [
  new ReactSlashMenuItem(
    "Heading",
    (editor) => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "heading",
        props: {
          level: "3",
        },
      });
    },
    ["heading", "head", "title", "h"],
    "Text",
    <RiH1 />,
    "제목을 만듭니다"
  ),
  new ReactSlashMenuItem(
    "Paragraph",
    (editor) => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "paragraph",
      });
    },
    ["paragraph", "text", "content", "p"],
    "Text",
    <RiText />,
    "본문을 만듭니다"
  ),

  new ReactSlashMenuItem(
    "Bullet List",
    (editor) => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "bulletListItem",
      });
    },
    ["list", "bullet", "ul"],
    "List",
    <RiListCheck />,
    "순서가 없는 목록을 만듭니다"
  ),
  new ReactSlashMenuItem(
    "Numbered List",
    (editor) => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "numberedListItem",
      });
    },
    ["list", "numbered", "ol"],
    "List",
    <RiListOrdered />,
    "순서가 있는 목록을 만듭니다"
  ),

  new ReactSlashMenuItem(
    "Single Line",
    (editor) => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "singleLine",
      });
    },
    ["line", "singe", "---"],
    "Line",
    <AiOutlineDash />,
    "한줄짜리 구분선을 만듭니다."
  ),
  new ReactSlashMenuItem(
    "Double Line",
    (editor) => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "doubleLine",
      });
    },
    ["line", "double", "==="],
    "Line",
    <AiOutlineDash />,
    "두줄짜리 구분선을 만듭니다."
  ),
];
