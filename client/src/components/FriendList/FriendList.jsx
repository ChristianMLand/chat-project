import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthContext } from '~/hooks';
import { logoutUser } from '~/services';

export default function FriendList() {
    const { socket, loggedUser, refresh, clear } = useAuthContext();
    const [friends, setFriends] = useState(loggedUser.allFriends.filter(f => f.Friendship.status == "ACCEPTED"));
    const navigate = useNavigate();
    const { id: friendshipId }  = useParams();

    const handleLogoutUser = () => {
        logoutUser().then(clear)
    }

    useEffect(() => {
        setFriends(loggedUser.allFriends.filter(f => f.Friendship.status == "ACCEPTED"));
        socket.on("friendActivityStatusChange", refresh);
        return () => {
            socket.off("friendActivityStatusChange", refresh);
        }
    }, [loggedUser]);

    return (
        <aside> 
            <h2 onClick={() => navigate("/dashboard")}>Logo</h2>
            <ul className="friend-list">
                {friends.sort((a, b) => (a.status !== "ACTIVE") - (b.status !== "ACTIVE")).map(friend => (
                    <li 
                        onClick={() => navigate("/chat/"+friend.Friendship.id)} 
                        key={friend.id} 
                        className={`friend ${friendshipId == friend.Friendship.id ? "active" : ""}`}
                    >
                        <span className={friend.status}>⬤</span>
                        <span>{friend.username}</span>
                    </li>
                ))}
            </ul>
            <button onClick={handleLogoutUser}>Logout</button>
        </aside>
    )
}