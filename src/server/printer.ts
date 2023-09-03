import {
  type BlockSchema,
  type Block,
  type InlineContent,
} from "@blocknote/core";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  CharacterSet,
  PrinterTypes,
  ThermalPrinter,
} from "node-thermal-printer";

dayjs.extend(utc);
dayjs.extend(timezone);

type printArgs = {
  ip: string;
  port: string;
  title: string;
  blocks: Block<BlockSchema>[];
};

const numberedListItemIndex = {
  0: 1,
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
};

function renderBlock(
  printer: ThermalPrinter,
  block: Block<BlockSchema>,
  depth = 0
) {
  // reset style
  printer.setTextNormal();
  printer.invert(false);

  // add depth
  printer.print(String().padStart(depth * 2, " "));

  // render heading
  if (block.type === "heading") {
    switch (block.props.level) {
      case "2": {
        printer.setTextSize(1, 1);
      }
      case "3": {
        printer.bold(true);
      }
    }
  }

  // render bulletListItem
  if (block.type === "bulletListItem") {
    printer.print("• ");
  }

  // render numberedListItem
  if (block.type === "numberedListItem") {
    printer.print(
      `${numberedListItemIndex[depth as keyof typeof numberedListItemIndex]}. `
    );
    numberedListItemIndex[depth as keyof typeof numberedListItemIndex]++;
  } else {
    numberedListItemIndex[depth as keyof typeof numberedListItemIndex] = 1;
  }

  if (block.type === "singleLine") {
    printer.println(Array(42).fill("-").join(""));
  }

  if (block.type === "doubleLine") {
    printer.println(Array(42).fill("=").join(""));
  }

  // render props
  Object.entries(block.props).forEach(([key, value]) => {
    // Align
    if (key === "textAlignment") {
      switch (value) {
        case "left":
          return printer.alignLeft();
        case "center":
          return printer.alignCenter();
        case "right":
          return printer.alignRight();
      }
    }

    // Invert
    if (key === "backgroundColor") {
      if (value === "gray") {
        printer.invert(true);
      }
      return;
    }

    // ignore props
    if (key === "level") return;
    if (key === "textColor") return;

    throw new Error("invalid prop");
  });

  // render contents
  if (block.content.length > 0) {
    renderContent(printer, block.content);
  }

  // render children
  if (block.children.length > 0) {
    block.children.forEach((child) => {
      renderBlock(printer, child, depth + 1);
    });
  }
}

function renderContent(printer: ThermalPrinter, content: InlineContent[]) {
  if (!content.length) return;

  content.forEach((content) => {
    if (content.type === "text") {
      const { text } = content;

      Object.entries(content.styles).forEach(([key, value]) => {
        // Bold
        if (key === "bold") {
          if (value === true) printer.bold(true);
          return;
        }
        // Underline
        if (key === "underline") {
          if (value === true) printer.underline(true);
          return;
        }

        throw new Error("invalid style");
      });

      return printer.println(text);
    }

    if (content.type === "link") {
      return renderContent(printer, content.content);
    }

    throw new Error("invalid content type");
  });
}

export const print = async ({ ip, port, title, blocks }: printArgs) => {
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: `tcp://${ip}:${port}`,
    characterSet: CharacterSet.KOREA,
    removeSpecialCharacters: false,
    lineCharacter: "=",
    width: 42,
    options: {
      timeout: 3000,
    },
  });

  const isConnected = await printer.isPrinterConnected();

  if (!isConnected) throw new Error("프린터와 연결되어 있지 않습니다.");

  if (title !== "무제") {
    renderBlock(printer, {
      id: "title",
      type: "heading",
      props: {
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left",
        level: "2",
      },
      children: [],
      content: [
        {
          type: "text",
          text: title,
          styles: {},
        },
      ],
    });

    renderBlock(printer, {
      id: "paragraph",
      type: "paragraph",
      props: {
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left",
      },
      children: [],
      content: [
        {
          type: "text",
          text: dayjs().tz("Asia/Seoul").format("YYYY년 MM월 DD일 HH시 mm분"),
          styles: {
            bold: true,
          },
        },
      ],
    });

    renderBlock(printer, {
      id: "doubleLine",
      type: "doubleLine",
      props: {
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left",
      },
      children: [],
      content: [],
    });
  }

  blocks.forEach((item) => renderBlock(printer, item));

  printer.cut();
  await printer.execute();

  return "Success";
};
