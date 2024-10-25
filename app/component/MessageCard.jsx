import React from 'react';
import moment from 'moment';

function MessageCard({ message, me, other }) {
  const isMessageFromMe = message.sender === me.id;

  const formatTimeAgo = (timestamp) => moment(timestamp?.toDate()).fromNow();

  return (
    <div className={`flex mb-4 ${isMessageFromMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`w-10 h-10 ${isMessageFromMe ? 'ml-2 mr-2' : 'mr-2'}`}>
        <img className="w-full h-full object-cover rounded-full" src={isMessageFromMe ? me.avatarUrl : other.avatarUrl} alt="Avatar" />
      </div>

      <div className={`text-white p-2 rounded-md ${isMessageFromMe ? 'bg-blue-500' : 'bg-[#19D39E]'}`}>
        {message.image && <img src={message.image} className="max-h-60 w-60 mb-4" alt="Message Attachment" />}
        <p>{message.content || 'No content'}</p>
        <div className="text-xs text-gray-200">{formatTimeAgo(message.time)}</div>
      </div>
    </div>
  );
}

export default MessageCard;
