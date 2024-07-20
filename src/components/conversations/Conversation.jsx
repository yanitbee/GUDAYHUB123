import { useEffect, useState } from "react";
import axios from "axios";
import "./conversation.css";

export default function Conversation({ Conversation, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = Conversation.member.find((m) => m !== currentUser.userID);

    const getUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/user/getuser/${friendId}`
        );
        setUser(res.data);
      } catch (err) {
        console.log("Error: " + err);
      }
    };

    getUser();
  }, [Conversation, currentUser]);

  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };

  return (
    <div className="conversation">
      {user && user.status !== "deleted" ? (
        <>
          <img
            className="conversationImg"
            src={
              user.freelancerprofile.profilepic === "" ||
              user.freelancerprofile.profilepic === null
                ? `/image/profile.jpg`
                : getProfilePicUrl(user.freelancerprofile.profilepic)
            }
            alt="Profile"
          />
          <span className="conversationName">{user.username}</span>
        </>
      ) : (
        <>
          <img className="conversationImg" src={`/image/deletedUser.png`} alt="Deleted User" />
          <span className="conversationName" 
          style={{color:"red"}}>Account Deleted</span>
        </>
      )}
    </div>
  );
}
