import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./App.css";

export default function App() {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <>
      <Editor
        apiKey="nsmf0p63cr6tsby6efmy5wwme5svcgsq8eeulvakknhj9h91"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        init={{
          height: "90vh", // Set to full viewport height
          width: "80vw", // Set to full viewport width
          menubar: false,
          branding: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "fontsize",
            "fontfamily",
            "wordcount",
            "underline",
            "strikethrough",
            "lineheight",
            "superscript",
            "subscript",
            "codesample",
            "table",
            "hr",
            "spellchecker",
            "speech",
          ],
          toolbar:
            "undo redo | blocks | bold italic underline strikethrough superscript subscript forecolor | fontfamily fontsize lineheight | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | charmap searchreplace | table hr | removeformat | link image media |code fullscreen preview codesample spellchecker | speech | help",
          toolbar_mode: "sliding",
          font_family_formats:
            "Poppins=Poppins, sans-serif;" +
            "Andale Mono=andale mono,times;" +
            "Arial=arial,helvetica,sans-serif;" +
            "Arial Black=arial black,avant garde;" +
            "Book Antiqua=book antiqua,palatino;" +
            "Comic Sans MS=comic sans ms,sans-serif;" +
            "Courier New=courier new,courier,monospace;" +
            "Georgia=georgia,palatino,serif;" +
            "Helvetica=helvetica;" +
            "Impact=impact,chicago;" +
            "Symbol=symbol;" +
            "Tahoma=tahoma,arial,helvetica,sans-serif;" +
            "Terminal=terminal,monaco;" +
            "Times New Roman=times new roman,times,serif;" +
            "Trebuchet MS=trebuchet ms,geneva;" +
            "Verdana=verdana,geneva,sans-serif;" +
            "Webdings=webdings;" +
            "Wingdings=wingdings,zapf dingbats;",
          content_style:
            "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');" +
            "body { font-family:Poppins, sans-serif; font-size:14px; margin:0; padding:0; }",
          spellchecker_dialog: true,
          spellchecker_whitelist: ["TinyMCE", "JavaScript"],
          speech_recognition: true,
          file_picker_callback: async (callback, value, meta) => {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.onchange = async function () {
                const file = this.files[0];
                if (file) {
                  const formData = new FormData();
                  formData.append("file", file);
                  try {
                    const response = await fetch(
                      "https://demo.mobilemasala.com/api/s3/upload?Content-Type=multipart/form-data",
                      { method: "POST", body: formData }
                    );
                    if (!response.ok) throw new Error("Failed to upload file");
                    const responseText = await response.json();
                    callback(responseText.FILE_URL, { alt: file.name });
                  } catch (error) {
                    console.error("Error uploading file:", error);
                  }
                }
              };
              input.click();
            } else if (meta.filetype === "media") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "video/*");
              input.onchange = function () {
                const file = this.files[0];
                if (file) {
                  const fileUrl = URL.createObjectURL(file);
                  callback(fileUrl, { alt: file.name });
                }
              };
              input.click();
            }
          },
        }}
      />
      {/* <button onClick={log}>Log editor content</button> */}
    </>
  );
}
