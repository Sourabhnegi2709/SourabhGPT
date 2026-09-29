// App.jsx
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import { GPTProvider } from "./context/GPT.Context";

function App() {
  return (
    <AuthProvider>
      <GPTProvider>
        <ThemeProvider>
          <div className="app-container flex h-screen bg-gray-100 dark:bg-gray-900 relative">
            <Sidebar />
            <ChatWindow />
          </div>
        </ThemeProvider>
      </GPTProvider>
    </AuthProvider>
  );
}

export default App;

