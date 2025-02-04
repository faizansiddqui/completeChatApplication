import React, { useEffect, useState, useRef } from 'react';
import MessageCard from './MessageCard';
import MessageInput from './MessageInput';
import { firestore } from '@/lib/firebase';
import { addDoc, collection, doc, serverTimestamp, onSnapshot, query, where, orderBy, updateDoc } from 'firebase/firestore';

function ChatRoom({ user, selectedChatroom }) {
  const me = selectedChatroom?.myData;
  const other = selectedChatroom?.otherData;
  const chatRoomId = selectedChatroom?.id;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!chatRoomId) return;
    const unsubscribe = onSnapshot(
      query(collection(firestore, 'messages'), where('chatRoomId', '==', chatRoomId), orderBy('time', 'asc')),
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messages);
      }
    );
    return unsubscribe;
  }, [chatRoomId]);

  const sendMessage = async () => {
    if (message === '' && image === '') return;

    try {
      const newMessage = {
        chatRoomId,
        sender: me.id,
        content: message,
        time: serverTimestamp(),
        image,
      };

      await addDoc(collection(firestore, 'messages'), newMessage);
      setMessage('');
      setImage(null);

      await updateDoc(doc(firestore, 'chatrooms', chatRoomId), {
        lastMessage: message ? message : 'Image',
      });

      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  return (
    <div className='flex flex-col h-screen'>
      <div ref={messagesContainerRef} className='flex-1 overflow-y-auto p-10'>
        {messages?.map((message) => (
          <MessageCard key={message.id} message={message} me={me} other={other} />
        ))}
      </div>
      <MessageInput sendMessage={sendMessage} message={message} setMessage={setMessage} image={image} setImage={setImage} />
    </div>
  );
}

export default ChatRoom;
