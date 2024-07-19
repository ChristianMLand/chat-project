import { Routes, Route } from "react-router-dom";
import { Layout, AuthContext } from '~/components';
import { DirectMessage, Dashboard, LogReg, Error } from "~/views";

function App() {
  return (
    <AuthContext>
      <Routes>
        <Route path="/" element={<LogReg />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat/:id" element={<DirectMessage />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </AuthContext>
  )
}

export default App
