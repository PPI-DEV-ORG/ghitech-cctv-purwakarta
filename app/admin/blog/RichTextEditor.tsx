"use client";

import React, { useRef, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const COLOR_OPTIONS = [
  { label: "Hitam Default", value: "#0f172a" },
  { label: "Abu-Abu", value: "#64748b" },
  { label: "Biru G-Tech", value: "#0b4f9c" },
  { label: "Merah G-Tech", value: "#d32f2f" },
  { label: "Hijau Emerald", value: "#059669" },
  { label: "Amber / Oranye", value: "#d97706" },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis isi artikel di sini...",
  minHeight = "280px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  };

  const exec = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const color = e.target.value;
    if (color) {
      exec("foreColor", color);
      e.target.value = "";
    }
  };

  const handleHeading = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      exec("formatBlock", val);
      e.target.value = "";
    }
  };

  const handleInsertLink = () => {
    const url = prompt("Masukkan tautan URL (misal: https://example.com):");
    if (url) {
      exec("createLink", url);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden shadow-2xs">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-slate-50 p-2 text-xs">
        {/* Headings */}
        <select
          onChange={handleHeading}
          defaultValue=""
          className="h-8 rounded border border-border bg-white px-2 text-xs text-ink outline-none"
        >
          <option value="" disabled>Format Teks</option>
          <option value="p">Paragraf Normal</option>
          <option value="h2">Heading 2 (Besar)</option>
          <option value="h3">Heading 3 (Sedang)</option>
          <option value="blockquote">Kutipan (Quote)</option>
        </select>

        {/* Text Styling */}
        <button
          type="button"
          onClick={() => exec("bold")}
          title="Tebal (Bold)"
          className="h-8 w-8 rounded border border-border bg-white font-bold text-ink hover:bg-slate-100 flex items-center justify-center cursor-pointer"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          title="Miring (Italic)"
          className="h-8 w-8 rounded border border-border bg-white italic font-serif text-ink hover:bg-slate-100 flex items-center justify-center cursor-pointer"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          title="Garis Bawah (Underline)"
          className="h-8 w-8 rounded border border-border bg-white underline text-ink hover:bg-slate-100 flex items-center justify-center cursor-pointer"
        >
          U
        </button>

        <span className="mx-1 h-5 w-px bg-slate-300" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          title="Bullet List"
          className="h-8 px-2.5 rounded border border-border bg-white text-xs font-semibold text-ink hover:bg-slate-100 flex items-center justify-center cursor-pointer"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          title="Numbered List"
          className="h-8 px-2.5 rounded border border-border bg-white text-xs font-semibold text-ink hover:bg-slate-100 flex items-center justify-center cursor-pointer"
        >
          1. List
        </button>

        <span className="mx-1 h-5 w-px bg-slate-300" />

        {/* Color picker */}
        <select
          onChange={handleColorChange}
          defaultValue=""
          className="h-8 rounded border border-border bg-white px-2 text-xs text-ink outline-none"
        >
          <option value="" disabled>Warna Teks</option>
          {COLOR_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Link */}
        <button
          type="button"
          onClick={handleInsertLink}
          title="Sisipkan Tautan Link"
          className="h-8 px-2.5 rounded border border-border bg-white text-xs font-semibold text-amber hover:bg-slate-100 flex items-center justify-center cursor-pointer"
        >
          🔗 Link
        </button>

        <span className="mx-1 h-5 w-px bg-slate-300" />

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => exec("removeFormat")}
          title="Hapus Format"
          className="h-8 px-2 rounded border border-border bg-white text-xs text-muted hover:bg-slate-100 flex items-center justify-center cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        style={{ minHeight }}
        data-placeholder={placeholder}
        className="p-4 text-sm leading-relaxed text-ink outline-none focus:bg-slate-50/30 overflow-y-auto whitespace-pre-wrap"
      />
    </div>
  );
}

