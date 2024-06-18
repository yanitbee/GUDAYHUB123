import { useContext, useEffect, useReducer, useRef, useState } from "react";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import "./messenger.css";
import { AuthContext } from "../../Hooks/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { BiHandicap } from "react-icons/bi";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setcurrentChat] = useState(null);
  const [messages, setmessages] = useState([]);
  const [newMessages, setnewMessages] = useState("");
  const [arrivalMessages, setarrivalMessages] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    socket.current = io("ws://localhost:4100");

    socket.current.on("getMessage", (data)=>{
      setarrivalMessages({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now()
      })

    })
  }, []);

  useEffect(()=>{
    arrivalMessages && 
    currentChat?.member.includes(arrivalMessages.sender) && 
    setmessages((prev)=>[...prev, arrivalMessages])
  }, [arrivalMessages, currentChat])

  useEffect(() => {
    socket.current.emit("addUser", user.userID);
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/conversations/${user.userID}`
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user.userID]);

  useEffect(() => {
    const getmessages = async () => {
      if (currentChat) {
        try {
          const res = await axios.get(
            `http://localhost:4000/messages/${currentChat._id}`
          );
          setmessages(res.data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getmessages();
  }, [currentChat]);

  const handleNew = async (e) => {
    e.preventDefault();
    const message = {
      sender: user.userID,
      text: newMessages,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.member.find(
      (member) => member !== user.userID
    );

    socket.current.emit("sendMessage", {
      senderId: user.userID,
      receiverId,
      text: newMessages,
    });

    try {
      const res = await axios.post(`http://localhost:4000/messages/`, message);
      setmessages([...messages, res.data]);
      setnewMessages("");
    } catch (err) {
      console.log("error" + err);
    }
  };



  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="search" className="chatMenuInput" />
            {conversations.map((convo) => (
              <div onClick={() => setcurrentChat(convo)}>
                <Conversation Conversation={convo} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user.userID} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something"
                    onChange={(e) => {
                      setnewMessages(e.target.value);
                    }}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleNew}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noconvo ">Open a conversation to start a chat</span>
            )}
          </div>
        </div>
        
        {/* chatBox 
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
          </div>
        </div>
        */}
      </div>
    </>
  );
}
