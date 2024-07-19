import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:8000/api'
});

http.defaults.withCredentials = true;

const serviceWrapper = func => {
  const inner = async (...args) => {
    let data, error;
    try {
      const res = await func(...args);
      data = res.data;
    } catch (err) {
      error = err.response.data?.errors ?? err.response.data;
    } finally {
      return { data, error };
    }
  }
  return inner;
}

export const getLoggedUser = serviceWrapper(
  async () => await http.get('/session')
);

export const registerUser = serviceWrapper(
  async data => await http.post('/users', data)
);

export const loginUser = serviceWrapper(
  async data => await http.post("/session", data)
);

export const logoutUser = serviceWrapper(
  async () => await http.delete('/session')
);

export const getMessages = serviceWrapper(
  async (friendshipId, offset, limit) =>
    await http.get('/messages', { params: { friendshipId, offset, limit } })
);

export const createMessage = serviceWrapper(
  async data => await http.post("/messages", data)
);

export const deleteMessage = serviceWrapper(
  async id => await http.patch("/messages/"+id)
);

export const updateMessage = serviceWrapper(
  async (id, data) => await http.put("/messages/"+id, data)
);

export const requestFriendship = serviceWrapper(
  async username => await http.post("/friendships", { username })
);

export const updateFriendship = serviceWrapper(
  async (id, status) => await http.patch("/friendships/"+id, { status })
);