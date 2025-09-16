import React, { useContext, useState, useEffect } from 'react';
import Chat from './Chat.jsx';
import './ChatWindow.css';
import { MyContext } from './MyContext.jsx';
import { ScaleLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';

export default function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat, theme, setTheme } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const getReply = async () => {
    if (!prompt) return;
    setLoading(true);
    setNewChat(false);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5050/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: prompt, threadId: currThreadId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error fetching reply");

      setReply(data.reply);
    } catch (error) {
      console.log(error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats(prevChats => ([
        ...prevChats,
        { role: "user", content: prompt },
        { role: "assistant", content: reply }
      ]));
    }
    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
    setIsOpen(false);
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5050/api/delete", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete account");

      // clear storage + redirect
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      alert("Account deleted successfully");
      navigate("/signin");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>MERN-GPT<i className="fa-solid fa-angle-down"></i></span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className='userIcon'><i className="fa-solid fa-user"></i></span>
        </div>
      </div>

      {isOpen &&
        <div className="dropDown">
          <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
          <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
          <div className="dropDownItem" onClick={toggleTheme}>
            <i className="fa-solid fa-circle-half-stroke"></i> {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </div>
          <div className="dropDownItem" onClick={logout}><i className="fa-solid fa-right-from-bracket"></i> Log out</div>
          <div className="dropDownItem" onClick={deleteAccount}><i className="fa-solid fa-trash-can-arrow-up"></i> Delete</div>
        </div>
      }

      <Chat />

      <ScaleLoader color={theme === "dark" ? "#fff" : "#000"} loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder='Ask Anything'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
          />
          <div id='submit' onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
        </div>
        <p className='info'>MERN-GPT can make mistakes. Check important info. See Cookie Preferences.</p>
      </div>
    </div>
  );
}
