import { useState, useEffect } from 'react';

export default function MessageForm({ action, content }) {
    const [messageContent, setMessageContent] = useState(content);

    useEffect(() => setMessageContent(content), [content]);

    const handleSubmit = e => {
        e.preventDefault();
        if (messageContent.length) {
            action(messageContent);
            setMessageContent("");
        }
    }

    return (
        <form id="messageForm" onSubmit={handleSubmit}>
            <input 
                value={messageContent}
                placeholder="Send a message..." 
                type="text" 
                name="content"
                onChange={e => setMessageContent(e.target.value)}
            />
            <button>{ content ?  "Update" : "Send" }</button>
        </form>
    );
}