import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMessages, createMessage, deleteMessage, updateMessage } from "~/services";
import { useAuthContext } from "~/hooks";
import { MessageForm, Message } from '~/components';

const MESSAGE_BATCH_SIZE = 10; // can increase/decrease this depending on how many messages we want to load at a time

export default function DirectMessage() {
  const { id: friendshipId } = useParams();
  const { socket, loggedUser } = useAuthContext();
  const [editingMessage, setEditingMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const chatContainer = useRef(null);
  const reachedEnd = useRef(false);
  const offset = useRef(0);
  const navigate = useNavigate();

  const friend = loggedUser?.friends.concat(loggedUser?.friendedBy)?.find(friend => friend?.Friendship.id == friendshipId);

  const handleCreateMessage = async content => {
    // TODO immediately append the returned message instead of waiting for the socket
    await createMessage({ senderId: loggedUser.id, friendshipId, content });
  }

  const handleUpdateMessage = async content => {
    // TODO immediately update message object instead of waiting for socket
    await updateMessage(editingMessage.id, { content })
    setEditingMessage(null);
  }

  const handleDeleteMessage = async id => {
    // TODO immediately update message object instead of waiting for socket
    await deleteMessage(id);
  }

  const updateMessageInDOM = updatedMessage => {
    setMessages(currentMessages =>
      currentMessages.map(message => message.id === updatedMessage.id ? updatedMessage : message)
    );
  }

  const addMessageToDOM = newMessage => {
    if (newMessage.friendshipId == friendshipId) {
      offset.current++;
      setMessages(currentMessages => [newMessage, ...currentMessages]);
    }
    // else show unread message indicator next to correct chat tab
  }

  const handleGetMessages = async () => {
    const { data } = await getMessages(friendshipId, offset.current, MESSAGE_BATCH_SIZE);
    if (data.length == 0) reachedEnd.current = true;
    return data;
  };

  const handleScroll = () => {
    const chat = chatContainer.current;
    if (Math.abs(chat.scrollTop) + chat.clientHeight >= chat.scrollHeight - 50 && !reachedEnd.current) {
      offset.current += MESSAGE_BATCH_SIZE;
      handleGetMessages().then(messageBatch => setMessages(currentMessages => currentMessages.concat(messageBatch)));
    }
  }

  useEffect(() => {
    if (!friend) navigate("/404");
    offset.current = 0;
    reachedEnd.current = false;
    setEditingMessage(null);
    handleGetMessages().then(setMessages);

    socket.on('messageCreated', addMessageToDOM);
    socket.on('messageUpdated', updateMessageInDOM);
    return () => {
      socket.off('messageCreated', addMessageToDOM);
      socket.off('messageUpdated', updateMessageInDOM);
    }
  }, [socket, friendshipId]);

  return (
    <div id="chat-container">
      <h2>Messaging {friend?.username}</h2>
      <ul id="message-list" ref={chatContainer} onScroll={handleScroll}>
        {messages?.map(message =>
          <Message
            key={message.id}
            message={message}
            handleEdit={() => setEditingMessage(message)}
            handleDelete={() => handleDeleteMessage(message.id)}
          />
        )}
      </ul>
      {editingMessage ?
        <MessageForm action={handleUpdateMessage} content={editingMessage.content} /> :
        <MessageForm action={handleCreateMessage} content="" />
      }
    </div>
  )
}