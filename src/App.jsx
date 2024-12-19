// import React, { useRef } from "react";
// import Jodit from "jodit";
// import "jodit/build/jodit.css";

// const App = () => {
//   const editorRef = useRef(null);

//   React.useEffect(() => {
//     const editor = new Jodit(editorRef.current, {
//       uploader: {
//         url: "https://demo.mobilemasala.com/api/s3/upload?",
//         method: "POST",
//         format: "json",
//         filesVariableName: () => "file", // Send the file with key 'file'
//         process: (response) => {
//           // Ensure response is in the correct format
//           if (response.FILE_URL) {
//             return { files: [response.FILE_URL] }; // Correct format for image URL
//           }
//           return { files: [] }; // Return empty array if no URL present
//         },
//         isSuccess: (response) => !!response.FILE_URL, // Check if the FILE_URL exists
//         error: (response) => {
//           console.error("Image upload failed:", response);
//           alert("Image upload failed. Please try again.");
//         },
//       },
//       toolbarAdaptive: false,
//       height: 400,
//       buttons: [
//         "bold",
//         "italic",
//         "underline",
//         "|",
//         "image",
//         "ul",
//         "ol",
//         "|",
//         "left",
//         "center",
//         "right",
//       ],
//     });

//     // Clean up editor instance on component unmount
//     return () => {
//       editor.destruct();
//     };
//   }, []);

//   return (
//     <div>
//       <h2>Jodit Editor with Image Upload</h2>
//       <textarea ref={editorRef}></textarea>
//     </div>
//   );
// };

// export default App;
import React, { useState, useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css"; // For React Quill styling
import ImageResize from "quill-image-resize"; // Import the image resize module

// Register the image resize module
Quill.register("modules/imageResize", ImageResize);

const Editor = () => {
  const [value, setValue] = useState(""); // State to store the editor content
  const quillRef = useRef(null); // Reference for the editor
  const [showImageModal, setShowImageModal] = useState(false); // Modal visibility state
  const [isVideoUpload, setIsVideoUpload] = useState(false); // State to differentiate between image and video upload

  // Function to handle editor content changes
  const handleChange = (content, delta, source, editor) => {
    setValue(editor.getHTML());
    console.log(editor.getHTML());
  };

  // Function to handle URL input
  const handleImageUrl = async () => {
    const url = prompt("Enter the image URL:");
    if (url) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append("file", blob, "image.jpg");

        // Replace this with your actual image upload API endpoint
        const uploadResponse = await fetch(
          "https://demo.mobilemasala.com/api/s3/upload?",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await uploadResponse.json();

        if (data && data.FILE_URL) {
          // Insert the uploaded image URL into the editor
          const range = quillRef.current.getEditor().getSelection();
          quillRef.current
            .getEditor()
            .insertEmbed(range.index, "image", data.FILE_URL);
        } else {
          alert("Image upload failed");
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Image upload failed. Please try again.");
      }
    }
    setShowImageModal(false); // Close modal
  };

  // Function to handle file upload
  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", isVideoUpload ? "video/*" : "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (isVideoUpload) {
        console.log(URL.createObjectURL(file));
        console.log(URL);
        const url = URL.createObjectURL(file);
        console.log(url);
        const range = quillRef.current.getEditor().getSelection();
        quillRef.current.getEditor().insertEmbed(range.index, "video", url);
      } else {
        const formData = new FormData();
        formData.append("file", file);

        try {
          // Replace this with your actual image upload API endpoint
          const response = await fetch(
            "https://demo.mobilemasala.com/api/s3/upload?",
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();

          if (data && data.FILE_URL) {
            // Insert the uploaded image URL into the editor
            const range = quillRef.current.getEditor().getSelection();
            quillRef.current
              .getEditor()
              .insertEmbed(range.index, "image", data.FILE_URL);
          } else {
            alert("Image upload failed");
          }
        } catch (error) {
          console.error("Image upload failed:", error);
          alert("Image upload failed. Please try again.");
        }
      }
      setShowImageModal(false); // Close modal
    };
  };

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const toolbar = quill.getModule("toolbar");

      // Add custom handlers for the image and video buttons
      toolbar.addHandler("image", () => {
        setIsVideoUpload(false);
        setShowImageModal(true);
      });
      toolbar.addHandler("video", () => {
        setIsVideoUpload(true);
        setShowImageModal(true);
      });
    }
  }, []);

  return (
    <div>
      <h2>React Quill Editor with Image and Video Upload</h2>
      {/* React Quill editor */}
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={handleChange}
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            ["link", "image", "video"],
            [{ align: [] }],
            ["clean"],
          ],
          imageResize: {
            modules: ["Resize", "DisplaySize", "Toolbar"],
          },
        }}
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "list",
          "bullet",
          "align",
          "link",
          "image",
          "video",
        ]}
      />

      {/* Modal for image and video options */}
      {showImageModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}>
          <h3>Select {isVideoUpload ? "Video" : "Image"} Option</h3>
          {!isVideoUpload && (
            <button
              onClick={handleImageUrl}
              style={{
                padding: "10px 20px",
                margin: "10px",
                cursor: "pointer",
              }}>
              Enter Image URL
            </button>
          )}
          <button
            onClick={handleFileUpload}
            style={{
              padding: "10px 20px",
              margin: "10px",
              cursor: "pointer",
            }}>
            Upload from System
          </button>
          <button
            onClick={() => setShowImageModal(false)}
            style={{
              padding: "10px 20px",
              margin: "10px",
              cursor: "pointer",
              backgroundColor: "red",
              color: "white",
            }}>
            Cancel
          </button>
        </div>
      )}

      {/* Overlay for modal */}
      {showImageModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={() => setShowImageModal(false)}
        />
      )}
    </div>
  );
};

export default Editor;
