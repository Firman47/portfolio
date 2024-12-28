"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";

import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { TextSelection } from "@tiptap/pm/state";
import { Input } from "@/components/ui/input";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaImage,
  FaLink,
  FaUndoAlt,
  FaRedoAlt,
  FaListOl,
  FaListUl,
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
} from "react-icons/lu";

export default function Editor() {
  const [oDialog, setODialog] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const selectionRef = useRef<TextSelection | null>(null);
  const [editingLink, setEditingLink] = useState<boolean>(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Link,
      Image,
      Table.configure({
        resizable: true, // opsional, jika ingin tabel bisa diubah ukurannya
      }),
      TableRow,
      TableCell,
      TableHeader,
      BulletList,
      OrderedList,
      ListItem,
      Document,
      Paragraph,
      Text,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Placeholder.configure({
        placeholder: "Write something …",
      }),
    ],
  });

  const handleOpenDialog = () => {
    const currentLink = editor?.getAttributes("link").href;
    if (currentLink) {
      setUrl(currentLink); // Tampilkan URL saat ini jika ada
      setEditingLink(true); // Mode edit
    } else {
      setUrl(""); // Teks baru, tidak ada URL
      setEditingLink(false);
    }

    if (editor?.state.selection.empty) {
      alert("Pilih teks terlebih dahulu!");
    } else {
      selectionRef.current = editor?.state.selection as TextSelection;
      setODialog(true);
    }
  };

  const addOrUpdateLink = () => {
    if (!url || !isValidURL(url)) {
      alert("Masukkan URL valid!");
      return;
    }

    if (editor && selectionRef.current) {
      editor?.chain().focus().toggleUnderline().run();
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
      setUrl("");
      setODialog(false);
    }
  };

  const removeLink = () => {
    editor?.chain().focus().toggleUnderline().run();
    editor?.chain().focus().unsetLink().run();
    setUrl("");
    setODialog(false);
  };

  const isValidURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          editor
            ?.chain()
            .focus()
            .setImage({ src: reader.result as string })
            .run();
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const headingLevels = [1, 2, 3, 4, 5, 6];

  return (
    <div className="space-y-3">
      <Dialog open={oDialog} onOpenChange={setODialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Edit Tautan" : "Tambahkan Tautan"}
            </DialogTitle>

            <DialogDescription>
              {editingLink
                ? "Edit URL untuk teks yang dipilih."
                : "Masukkan URL baru untuk teks yang dipilih."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Masukkan URL"
            />
            <Button onClick={addOrUpdateLink}>
              {editingLink ? "Perbarui" : "Tambahkan"}
            </Button>
            {editingLink && (
              <Button variant="destructive" onClick={removeLink}>
                Hapus
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex gap-2 items-center justify-start">
        <Button
          onClick={() => editor?.chain().focus().undo().run()}
          variant="outline"
          size="icon"
        >
          <FaUndoAlt />
        </Button>

        <Button
          onClick={() => editor?.chain().focus().redo().run()}
          variant="outline"
          size="icon"
        >
          <FaRedoAlt />
        </Button>

        <Button
          size="icon"
          variant={editor?.isActive("bold") ? "secondary" : "outline"}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <FaBold />
        </Button>

        <Button
          size="icon"
          variant={editor?.isActive("italic") ? "secondary" : "outline"}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <FaItalic className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant={editor?.isActive("underline") ? "secondary" : "outline"}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <FaUnderline className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant={editor?.isActive("bulletList") ? "secondary" : "outline"}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <FaListUl className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant={editor?.isActive("orderedList") ? "secondary" : "outline"}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <FaListOl className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant={"outline"}
          onClick={handleOpenDialog}
          disabled={editor?.state.selection?.empty} // Cek apakah seleksi kosong
          title={
            editor?.state.selection?.empty
              ? "Pilih teks dulu untuk menambahkan tautan"
              : ""
          }
        >
          <FaLink className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="outline">
          <label className="inline-flex items-center justify-center cursor-pointer">
            <input type="file" onChange={handleFileUpload} className="hidden" />
            <FaImage className="h-4 w-4" />
          </label>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              {editor?.isActive({ textAlign: "center" }) ? (
                <FaAlignCenter />
              ) : editor?.isActive({ textAlign: "justify" }) ? (
                <FaAlignJustify />
              ) : editor?.isActive({ textAlign: "left" }) ? (
                <FaAlignLeft />
              ) : (
                <FaAlignRight />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex">
            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().setTextAlign("center").run()
              }
              className={`w-fit ${
                editor?.isActive({ textAlign: "center" }) ? "bg-secondary" : ""
              }`}
            >
              <FaAlignCenter />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().setTextAlign("justify").run()
              }
              className={`w-fit ${
                editor?.isActive({ textAlign: "justify" }) ? "bg-secondary" : ""
              }`}
            >
              <FaAlignJustify />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor?.chain().focus().setTextAlign("left").run()}
              className={`w-fit ${
                editor?.isActive({ textAlign: "left" }) ? "bg-secondary" : ""
              }`}
            >
              <FaAlignLeft />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().setTextAlign("right").run()
              }
              className={`w-fit ${
                editor?.isActive({ textAlign: "right" }) ? "bg-secondary" : ""
              }`}
            >
              <FaAlignRight />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={editor?.isActive("heading") ? "secondary" : "outline"}
              size="icon"
            >
              {editor?.isActive("heading", { level: 1 }) ? (
                <LuHeading1 />
              ) : editor?.isActive("heading", { level: 2 }) ? (
                <LuHeading2 />
              ) : editor?.isActive("heading", { level: 3 }) ? (
                <LuHeading3 />
              ) : editor?.isActive("heading", { level: 4 }) ? (
                <LuHeading4 />
              ) : editor?.isActive("heading", { level: 5 }) ? (
                <LuHeading5 />
              ) : (
                <LuHeading6 />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="flex">
            {headingLevels.map((level) => (
              <DropdownMenuItem
                key={level}
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .toggleHeading({ level: level as unknown as 1 })
                    .run()
                }
                className={`w-fit ${
                  editor?.isActive("heading", { level }) ? "bg-secondary" : ""
                }`}
              >
                {level === 1 ? (
                  <LuHeading1 />
                ) : level === 2 ? (
                  <LuHeading2 />
                ) : level === 3 ? (
                  <LuHeading3 />
                ) : level === 4 ? (
                  <LuHeading4 />
                ) : level === 5 ? (
                  <LuHeading5 />
                ) : (
                  <LuHeading6 />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
