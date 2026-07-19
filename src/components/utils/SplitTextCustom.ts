export class SplitText {
  elements: HTMLElement[] = [];
  originalHTMLs: Map<HTMLElement, string> = new Map();
  chars: HTMLElement[] = [];
  words: HTMLElement[] = [];
  lines: HTMLElement[] = [];

  constructor(target: any, options?: { type?: string; linesClass?: string }) {
    if (typeof target === "string") {
      this.elements = Array.from(document.querySelectorAll(target)) as HTMLElement[];
    } else if (target instanceof HTMLElement) {
      this.elements = [target];
    } else if (target instanceof NodeList) {
      this.elements = Array.from(target) as HTMLElement[];
    } else if (Array.isArray(target)) {
      target.forEach((t) => {
        if (typeof t === "string") {
          this.elements.push(...(Array.from(document.querySelectorAll(t)) as HTMLElement[]));
        } else if (t instanceof HTMLElement) {
          this.elements.push(t);
        }
      });
    }

    const type = options?.type || "chars,words,lines";
    const linesClass = options?.linesClass || "split-line";

    this.elements.forEach((el) => {
      this.originalHTMLs.set(el, el.innerHTML);

      const elChars: HTMLElement[] = [];
      const elWords: HTMLElement[] = [];

      const childNodes = Array.from(el.childNodes);
      childNodes.forEach((child) => {
        this.splitNode(child, type, elChars, elWords);
      });

      this.chars.push(...elChars);
      this.words.push(...elWords);

      if (type.includes("lines")) {
        const elLines = this.groupIntoLines(el, elWords, linesClass);
        this.lines.push(...elLines);
      }
    });
  }

  private splitNode(node: Node, type: string, charsArr: HTMLElement[], wordsArr: HTMLElement[]) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      const parent = node.parentNode;
      if (!parent) return;

      const docFrag = document.createDocumentFragment();
      const tokens = text.split(/(\s+)/);

      tokens.forEach((token) => {
        if (token === "") return;
        if (/^\s+$/.test(token)) {
          docFrag.appendChild(document.createTextNode(token));
        } else {
          const wordSpan = document.createElement("span");
          wordSpan.className = "split-word";
          wordSpan.style.display = "inline-block";

          if (type.includes("chars")) {
            const chars = Array.from(token);
            chars.forEach((c) => {
              const charSpan = document.createElement("span");
              charSpan.className = "split-char";
              charSpan.style.display = "inline-block";
              charSpan.textContent = c;
              wordSpan.appendChild(charSpan);
              charsArr.push(charSpan);
            });
          } else {
            wordSpan.textContent = token;
          }

          docFrag.appendChild(wordSpan);
          wordsArr.push(wordSpan);
        }
      });

      parent.replaceChild(docFrag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const children = Array.from(node.childNodes);
      children.forEach((child) => {
        this.splitNode(child, type, charsArr, wordsArr);
      });
    }
  }

  private groupIntoLines(_el: HTMLElement, words: HTMLElement[], linesClass: string): HTMLElement[] {
    if (words.length === 0) return [];

    const linesMap = new Map<number, HTMLElement[]>();

    words.forEach((word) => {
      const rect = word.getBoundingClientRect();
      const top = rect.top;

      let found = false;
      for (const key of linesMap.keys()) {
        if (Math.abs(key - top) < 8) {
          linesMap.get(key)!.push(word);
          found = true;
          break;
        }
      }
      if (!found) {
        linesMap.set(top, [word]);
      }
    });

    const sortedKeys = Array.from(linesMap.keys()).sort((a, b) => a - b);
    const linesArr: HTMLElement[] = [];

    sortedKeys.forEach((key) => {
      const lineWords = linesMap.get(key)!;
      if (lineWords.length === 0) return;

      const lineSpan = document.createElement("div");
      lineSpan.className = linesClass;
      lineSpan.style.display = "block";
      lineSpan.style.position = "relative";

      const firstWord = lineWords[0];
      const parent = firstWord.parentNode;
      if (parent) {
        parent.insertBefore(lineSpan, firstWord);
        lineWords.forEach((word) => {
          lineSpan.appendChild(word);
        });
        linesArr.push(lineSpan);
      }
    });

    return linesArr;
  }

  revert() {
    this.elements.forEach((el) => {
      const originalHTML = this.originalHTMLs.get(el);
      if (originalHTML !== undefined) {
        el.innerHTML = originalHTML;
      }
    });
  }
}
