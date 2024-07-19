import { SearchForm } from '~/components';
import { useAuthContext } from '~/hooks';
import { useEffect } from 'react';
import { updateFriendship } from '~/services';

export default function Dashboard() {
  const { loggedUser, refresh, socket } = useAuthContext();

  useEffect(() => {
    socket.on("friendshipRequested", refresh);
    socket.on("friendshipStatusChange", refresh);
    return () => {
      socket.off("friendshipStatusChange", refresh);
      socket.off("friendshipRequested", refresh);
    }
  }, [loggedUser]);

  const updateFriendRequest = async (friendshipId, status) => {
    await updateFriendship(friendshipId, status);
    // manually updated the logged users friendship list instead of refreshing??
  }

  return (
    <div id="friend-requests-container">
      <h2>Welcome, {loggedUser?.username}</h2>
      <div>
        <SearchForm />
        <h3>Pending Friend Requests</h3>
        <ul className="friend-requests">
          {loggedUser?.friendedBy.filter(friend => friend.Friendship?.status === "PENDING").map(friend => (
            <li key={friend.id}>
              <span>{friend.username}</span>
              <button onClick={() => updateFriendRequest(friend.Friendship.id, "ACCEPTED")}>Accept</button>
              <button onClick={() => updateFriendRequest(friend.Friendship.id, "REJECTED")}>Reject</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}