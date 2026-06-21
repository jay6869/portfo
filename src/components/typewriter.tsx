"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function Typewriter({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) {
      setText(words[i]);
      const t = setTimeout(() => setI((i + 1) % words.length), 2200);
      return () => clearTimeout(t);
    }
    const current = words[i];
    const tick = deleting ? 32 : 70;
    const pause = !deleting && text === current ? 1300 : deleting && text === "" ? 250 : 0;

    const t = setTimeout(() => {
      if (!deleting && text === current) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setI((i + 1) % words.length);
      } else {
        setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
      }
    }, pause || tick);
    return () => clearTimeout(t);
  }, [text, deleting, i, words, reduced]);

  return (
    <span className={className}>
      <span className="signal-text">{text}</span>
      <span className="caret" aria-hidden="true" />
    </span>
  );
}
