import "./App.css";
import "./index.css";

import { useEffect, useRef, useState } from "react";

import { TwitterPicker } from "react-color";
import ContentEditable from "react-contenteditable";

function App() {
  const [color, setColor] = useState("#FFF033");
  const [html, setHtml] = useState("");
  const [offsets, setOffsets] = useState([]);
  const [selectedLine, setSelectedLine] = useState(0);
  const editorRef = useRef();

  const mapHTML = (text) => {
    if (!text || text.trim().length === 0) return text;
    return text
      .split(" ")
      .map((t) => "<span class='word'>" + boldWord(t) + " </span>")
      .join("");
  };

  const boldWord = (word) => {
    const len = word.trim().length;
    if (!word || len === 0) return word;
    if (len === 1) return `<strong>${word}</strong>`;
    let n;
    if (len === 2 || len === 3) n = 1;
    else if (len === 4) n = 2;
    else if (len === 5 || len === 6) n = 3;
    else if (len === 7) n = 4;
    else if (len === 8 || len === 9) n = 5;
    else if (len >= 10) n = 6;
    return `<strong>${word.slice(0, n)}</strong>${word.slice(n)}`;
  };

  const handleColorChange = (color, event) => {
    setColor(color.hex);
  };

  function handleChange(e) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = e.target.value;
    let plainText = tmp.textContent || tmp.innerText || "";
    setHtml(
      plainText
        .split(/(\s+)/)
        .filter((c) => !!c.trim())
        .join(" ")
    );
  }
  useEffect(() => {
    let words = document.getElementsByClassName("word");
    let offsets = [];
    for (let i = 0; i < words?.length; i++) {
      const element = words[i];
      offsets = [...offsets, element.offsetTop];
    }
    let uniqueOffsets = [...new Set(offsets)];
    setOffsets(uniqueOffsets);
    if (!html) setSelectedLine(-1);
    
  }, [html]);

  useEffect(() => {
    let words = document.getElementsByClassName("word");
    for (let i = 0; i < words?.length; i++) {
      const element = words[i];
      if (element.offsetTop === offsets[selectedLine])
        element.style.backgroundColor = color;
    }
  });
  const handleKeyPress = (event) => {
    if (event.key === "ArrowDown") {
      if (selectedLine + 2 <= offsets.length) setSelectedLine(selectedLine + 1);
    }
    if (event.key === "ArrowUp") {
      if (selectedLine - 1 >= 0) setSelectedLine(selectedLine - 1);
    }
  };
  return (
    <div>
      <div className="container mx-auto flex flex-col justify-center items-center space-y-4">
        <h1 className="text-4xl text-black">LE.IO</h1>
        <p className="max-w-[660px] text-center mb-6 text-black">
          Paste your text in the space bellow. Any other instruction would go
          here as well as usual. Instructions should be crucial & good
        </p>
        <div className="flex space-x-8">
          <div
            style={{ background: color }}
            className="rounded-full w-8 h-8 cursor-pointer rotate-90"
          >
            {<TwitterPicker onChange={handleColorChange} />}
          </div>
          <form>
            <ContentEditable
              innerRef={editorRef}
              html={mapHTML(html)}
              disabled={false}
              onChange={handleChange}
              tagName="p"
              className="text-black max-w-[800px] min-h-[200px] border p-4"
              style={{ minWidth: "20rem" }}
              onKeyDown={handleKeyPress}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
