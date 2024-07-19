import { Outlet } from 'react-router-dom';
import { useAuthContext } from "~/hooks";
import { FriendList } from "~/components";

export default function Layout() {
    const { loggedUser } = useAuthContext();

    if (!loggedUser) return <h1>Loading...</h1>;

    return (
        <main>
            <FriendList />
            <Outlet />
        </main>
    );
}