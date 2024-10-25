import React, { useState } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import EmojiPicker from 'emoji-picker-react';

function MessageInput({ sendMessage, message, setMessage, image, setImage }) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false); // State for managing modal visibility

  const storage = getStorage();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => console.error('Error uploading file:', error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImage(downloadURL);
          setFile(null);
          setImagePreview(null);
          setUploadProgress(null); // Clear the progress
          setModalOpen(false); // Close modal
        });
      }
    );
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  return (
    <div className="relative flex items-center p-4 border-t border-gray-200">
      <FaPaperclip onClick={() => setModalOpen(true)} className="text-gray-500 mr-2 cursor-pointer" />

      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        placeholder="Type a message..."
        className="flex-1 border-none p-2 outline-none"
      />

      <FaPaperPlane onClick={sendMessage} className="text-blue-500 cursor-pointer ml-2" />

      {showEmojiPicker && (
        <div className="absolute right-0 bottom-full p-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} disableAutoFocus />
        </div>
      )}

      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            {imagePreview && <img src={imagePreview} alt="Uploaded" className="max-h-60 w-60 mb-4" />}
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div onClick={handleUpload} className="btn btn-sm btn-primary">
              Upload
            </div>
            {uploadProgress && <progress value={uploadProgress} max="100"></progress>}
            <button onClick={() => setModalOpen(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default MessageInput;
