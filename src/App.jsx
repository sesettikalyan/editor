import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";

const App = () => {
  const editor = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const config = {
    uploader: {
      url: "https://demo.mobilemasala.com/api/s3/upload?Content-Type=multipart/form-data",
      method: "POST",
      prepareData: (formData) => {
        console.log("Preparing FormData...");
        const file = formData.get("files[0]");
        formData.delete("files[0]");
        formData.append("file", file); // Rename the key to "file"
        return formData;
      },
      isSuccess: (response) => {
        console.log("Response from server:", response);
        return response && response.FILE_URL;
      },
      process: (response) => {
        console.log("Processing response:", response);
        const fileUrl = response.FILE_URL;

        if (fileUrl) {
          console.log("Image URL to insert:", fileUrl);
          if (isEditorReady && editor.current) {
            const jodit = editor.current.editor;
            console.log("Editor instance:", editor.current);
            console.log("Editor is ready, inserting image.");
            // Insert the image URL as HTML
            const imgTag = `<img src="${fileUrl}" alt="Image" />`;
            console.log(imgTag);
            jodit.insertHTML(imgTag); // Insert the image HTML
          } else {
            console.error("Editor not ready.");
          }
        } else {
          console.error("No FILE_URL found in the response.");
        }

        return {
          files: fileUrl ? [fileUrl] : [],
          msg: response.message || "",
        };
      },
      error: (error) => {
        console.error("Error during upload:", error);
      },
    },
    defaultActionOnPaste: "insert_as_html",
    controls: {
      font: {
        list: {
          Poppins: "Poppins, sans-serif",
        },
      },
    },
    style: {
      font: ["Poppins"],
    },
    events: {
      afterInit: () => {
        setIsEditorReady(true); // Set editor as ready after initialization
        console.log("Editor is initialized.");
      },
    },
  };

  return (
    <div>
      <JoditEditor
        ref={editor}
        config={config}
        onBlur={(newContent) => {
          console.log("Editor content:", newContent);
        }}
        onChange={(newContent) => {
          console.log("Editor content:", newContent);
        }}
      />
      {!isEditorReady && <p>Editor is loading...</p>}{" "}
      {/* Show loading message */}
    </div>
  );
};

export default App;
