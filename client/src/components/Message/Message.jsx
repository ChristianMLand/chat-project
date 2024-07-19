import { useState } from 'react';
import { useAuthContext } from '~/hooks';
import moment from 'moment';

export default function Message({ message, handleEdit, handleDelete }) {
    const { loggedUser } = useAuthContext();
    const [isHovering, setIsHovering] = useState(false);
    const toggleIsHovering = () => setIsHovering(currentHoverStatus => !currentHoverStatus);

    return (
        <li onMouseOver={toggleIsHovering} onMouseOut={toggleIsHovering} className="message">
            <div>
                <p>
                    <span className="text-light">{message.sender?.username}</span>
                    <span>{moment(message.updatedAt).calendar()}</span>
                    <span>{message.status == "EDITED" && "(edited)"}</span>
                </p>
                { isHovering && loggedUser.id == message.sender?.id && message.status !== "DELETED" &&
                    <div>
                        <button onClick={handleEdit}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                }
            </div>
            <p>{message.status === "DELETED" ? "Message was deleted by User" : message.content}</p>
        </li>
    )
}