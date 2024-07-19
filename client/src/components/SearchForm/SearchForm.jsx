import { useState } from 'react';
// import { useAuthContext } from '~/hooks';
import { requestFriendship } from '~/services';

export default function SearchForm() {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        if (username.length) {
            const { error } = await requestFriendship(username);
            if (error) setError(error[0].message);
        }
    }   

    return (
        <form id="searchForm" onSubmit={handleSubmit}>
            <fieldset>
                <input 
                    onChange={e => setUsername(e.target.value)} 
                    type="text" 
                    name="username"
                    placeholder="Add a friend.."
                />
                <button>Add</button>
            </fieldset>
            { error && <p className="error">{error}</p> }
        </form>
    );
}