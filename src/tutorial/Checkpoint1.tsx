import ToggleButton from "@mui/material/ToggleButton";
import Typography from "@mui/material/Typography";
import type { EditorState } from "../editor/types";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import CodeIcon from '@mui/icons-material/Code';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import SubscriptIcon from '@mui/icons-material/Subscript';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';

const Checkpoint1 = [
  {
    name: "Make the following text bold",
    steps: <>
      <Typography variant="subtitle2" gutterBottom>
        1. Select the text
      </Typography>
      <Typography variant="subtitle2">
        2. Click the
        <ToggleButton value="bold" size="small" sx={{ m: 1 }}>
          <FormatBoldIcon />
        </ToggleButton>
        button in the toolbar
      </Typography>
    </>,
    check: (editorState?: EditorState) => {
      let result = false;
      if (!editorState) return result;
      editorState.read(() => {
        editorState._nodeMap.forEach((node) => {
          if (node.__value === 1) {
            const paragraphNode = node.getParent()?.getNextSibling();
            if (!paragraphNode) return result;
            const target = paragraphNode.getFirstChild();
            if (target && target.hasFormat("bold")) result = true;
          }
        });
      });
      return result;
    }
  },
  {
    name: "Make the following text italic",
    steps: <>
      <Typography variant="subtitle2" gutterBottom>
        1. Select the text
      </Typography>
      <Typography variant="subtitle2">
        2. Click the
        <ToggleButton value="italic" size="small" sx={{ m: 1 }}>
          <FormatItalicIcon />
        </ToggleButton>
        button in the toolbar
      </Typography>
    </>,
    check: (editorState?: EditorState) => {
      let result = false;
      if (!editorState) return result;
      editorState.read(() => {
        editorState._nodeMap.forEach((node) => {
          if (node.__value === 2) {
            const paragraphNode = node.getParent()?.getNextSibling();
            if (!paragraphNode) return result;
            const target = paragraphNode.getFirstChild();
            if (target && target.hasFormat("italic")) result = true;
          }
        });
      });
      return result;
    }
  },
  {
    name: "Make the following text underlined",
    steps: <>
      <Typography variant="subtitle2" gutterBottom>
        1. Select the text
      </Typography>
      <Typography variant="subtitle2">
        2. Click the
        <ToggleButton value="underline" size="small" sx={{ m: 1 }}>
          <FormatUnderlinedIcon />
        </ToggleButton>
        button in the toolbar
      </Typography>
    </>,
    check: (editorState?: EditorState) => {
      let result = false;
      if (!editorState) return result;
      editorState.read(() => {
        editorState._nodeMap.forEach((node) => {
          if (node.__value === 3) {
            const paragraphNode = node.getParent()?.getNextSibling();
            if (!paragraphNode) return result;
            const target = paragraphNode.getFirstChild();
            if (target && target.hasFormat("underline")) result = true;
          }
        });
      });
      return result;
    }
  },
  {
    name: "Format the following text inline code",
    steps: <>
      <Typography variant="subtitle2" gutterBottom>
        1. Select the text
      </Typography>
      <Typography variant="subtitle2">
        2. Click the
        <ToggleButton value="code" size="small" sx={{ m: 1 }}>
          <CodeIcon />
        </ToggleButton>
        button in the toolbar
      </Typography>
    </>,
    check: (editorState?: EditorState) => {
      let result = false;
      if (!editorState) return result;
      editorState.read(() => {
        editorState._nodeMap.forEach((node) => {
          if (node.__value === 4) {
            const paragraphNode = node.getParent()?.getNextSibling();
            if (!paragraphNode) return result;
            const target = paragraphNode.getFirstChild();
            if (target && target.hasFormat("code")) result = true;
          }
        });
      });
      return result;
    }
  },
  {
    name: "Format the following text with a strikethrough",
    steps: <>
      <Typography variant="subtitle2" gutterBottom>
        1. Select the text
      </Typography>
      <Typography variant="subtitle2">
        2. Click the
        <ToggleButton value="strike" size="small" sx={{ m: 1 }}>
          <FormatStrikethroughIcon />
        </ToggleButton>
        button in the toolbar
      </Typography>
    </>,
    check: (editorState?: EditorState) => {
      let result = false;
      if (!editorState) return result;
      editorState.read(() => {
        editorState._nodeMap.forEach((node) => {
          if (node.__value === 5) {
            const paragraphNode = node.getParent()?.getNextSibling();
            if (!paragraphNode) return result;
            const target = paragraphNode.getFirstChild();
            if (target && target.hasFormat("strikethrough")) result = true;
          }
        });
      });
      return result;
    }
  },
  {
    name: 'Make the word "subscript" a subscript',
    steps: <>
      <Typography variant="subtitle2" gutterBottom>
        1. Select the word
      </Typography>
      <Typography variant="subtitle2">
        2. Click the
        <ToggleButton value="subscript" size="small" sx={{ m: 1 }}>
          <SubscriptIcon />
        </ToggleButton>
        button in the toolbar
      </Typography>
    </>,
    check: (editorState?: EditorState) => {
      let result = false;
      if (!editorState) return result;
      editorState.read(() => {
        editorState._nodeMap.forEach((node) => {
          if (node.getTextContent() === "subscript") {
            if (node.hasFormat("subscript" as any)) result = true;
          }
        });
      });
      return result;
    }
  },
  {
    name: 'Make the word "superscript" a superscript',
    steps: <>
      <Typography variant="subtitle2" gutterBottom>
        1. Select the word
      </Typography>
      <Typography variant="subtitle2">
        2. Click the
        <ToggleButton value="superscript" size="small" sx={{ m: 1 }}>
          <SuperscriptIcon />
        </ToggleButton>
        button in the toolbar
      </Typography>
    </>,
    check: (editorState?: EditorState) => {
      let result = false;
      if (!editorState) return result;
      editorState.read(() => {
        editorState._nodeMap.forEach((node) => {
          if (node.getTextContent() === "superscript") {
            if (node.hasFormat("superscript" as any)) result = true;
          }
        });
      });
      return result;
    }
  },
  {
    name: "Change the font color of the following text",
    steps: <>
      <Typography variant="subtitle2" gutterBottom>
        1. Select the text
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        2. Click the
        <ToggleButton value="text" size="small" sx={{ m: 1 }}>
          <FormatColorFillIcon />
        </ToggleButton>
        button in the toolbar
      </Typography>
      <Typography variant="subtitle2">
        3. Select a text color
      </Typography>
    </>,
    check: (editorState?: EditorState) => {
      let result = false;
      if (!editorState) return result;
      editorState.read(() => {
        editorState._nodeMap.forEach((node) => {
          if (node.__value === 8) {
            const paragraphNode = node.getParent()?.getNextSibling();
            if (!paragraphNode) return result;
            const target = paragraphNode.getFirstChild();
            if (target && target.getStyle().includes("color")) result = true;
          }
        });
      });
      return result;
    }
  },
  {
    name: "Change the background color of the following text",
    steps: <>
      <Typography variant="subtitle2" gutterBottom>
        1. Select the text
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        2. Click the
        <ToggleButton value="background" size="small" sx={{ m: 1 }}>
          <FormatColorFillIcon />
        </ToggleButton>
        button in the toolbar
      </Typography>
      <Typography variant="subtitle2">
        3. Select a background color
      </Typography>
    </>,
    check: (editorState?: EditorState) => {
      let result = false;
      if (!editorState) return result;
      editorState.read(() => {
        editorState._nodeMap.forEach((node) => {
          if (node.__value === 9) {
            const paragraphNode = node.getParent()?.getNextSibling();
            if (!paragraphNode) return result;
            const target = paragraphNode.getFirstChild();
            if (target && target.getStyle().includes("background-color")) result = true;
          }
        });
      });
      return result;
    }
  },
];

export default Checkpoint1;