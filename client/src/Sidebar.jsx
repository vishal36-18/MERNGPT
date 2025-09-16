import React, { useContext, useState, useEffect } from 'react';
import './Sidebar.css';
import { MyContext } from './MyContext.jsx';
import { v1 as uuidv1 } from "uuid";
import { jwtDecode } from "jwt-decode";

export default function Sidebar() {
  const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);

  const token = localStorage.getItem("token");
  let username = "User";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.username || "User";
    } catch (e) {
      console.error("Invalid token:", e);
    }
  }

  const getAllThreads = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/thread", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAllThreads(data.map(thread => ({ threadId: thread.threadId, title: thread.title })));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { getAllThreads(); }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const res = await fetch(`http://localhost:5050/api/thread/${newThreadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPrevChats(data);
      setNewChat(false);
      setReply(null);
    } catch (error) { console.log(error); }
  };

  const deleteThread = async (threadId) => {
    try {
      await fetch(`http://localhost:5050/api/thread/${threadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
      if (threadId === currThreadId) createNewChat();
    } catch (error) { console.log(error); }
  };

  return (
    <section className='sidebar'>
      <button onClick={createNewChat}>
        <img src="src/assets/blacklogo.png" alt="gpt logo" className='logo'></img>
        <h3>New Chat</h3>
        <span><i className="fa-solid fa-pen-to-square"></i></span>
      </button>

      <ul className='history'>
        {allThreads?.map((thread, idx) => (
          <li key={idx}
            onClick={(e) => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : " "}>
            {thread.title}
            <i className="fa-solid fa-trash"
              onClick={(e) => { e.stopPropagation(); deleteThread(thread.threadId); }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>{username} &hearts;</p>
      </div>
    </section>
  );
}
