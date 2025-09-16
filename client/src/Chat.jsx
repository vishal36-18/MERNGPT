import React, { useContext, useState, useEffect } from 'react';
import './Chat.css';
import { MyContext } from './MyContext.jsx';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

export default function Chat() {
  const { newChat, prevChats, reply, theme } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  // Dynamically load highlight.js theme
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.id = "hljs-theme";
    link.href =
      theme === "dark"
        ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css"
        : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github.min.css";

    const oldLink = document.getElementById("hljs-theme");
    if (oldLink) oldLink.remove();
    document.head.appendChild(link);
  }, [theme]);

  // Typing effect
  useEffect(() => {
    if (reply === null) { setLatestReply(null); return; }
    if (!prevChats?.length) return;

    const content = reply.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  return (
    <>
      {newChat && <h1>Start a New Chat</h1>}
      <div className="chats">
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div className={chat.role === 'user' ? "userDiv" : "gptDiv"} key={idx}>
            {chat.role === 'user'
              ? <p className='userMessage'>{chat.content}</p>
              : <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
            }
          </div>
        ))}

        {prevChats.length > 0 && latestReply !== null &&
          <div className='gptDiv' key={"typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
          </div>
        }

        {prevChats.length > 0 && latestReply === null &&
          <div className='gptDiv' key={"non-typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {prevChats[prevChats.length - 1].content}
            </ReactMarkdown>
          </div>
        }
      </div>
    </>
  );
}
