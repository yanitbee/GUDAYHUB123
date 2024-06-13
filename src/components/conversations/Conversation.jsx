import { useEffect, useState } from "react";
import axios from "axios";
import "./conversation.css";

export default function Conversation({ Conversation, currentUser }) {
  const [user, setuser] = useState(null);

  useEffect(() => {
    const friendId = Conversation.member.find((m) => m !== currentUser.userID);

    const getUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/user/getuser/${friendId}`
        );
        setuser(res.data);
      } catch (err) {
        console.log("error" + err);
      }
    };
    getUser();
  }, [Conversation, currentUser]);

  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };

  return (
    <div className="conversation">
      {user ? (
        <img
          className="conversationImg"
          src={
            user.freelancerprofile.profilepic === "" ||
            user.freelancerprofile.profilepic === null
              ? `/image/profile.jpg`
              : getProfilePicUrl(user.freelancerprofile.profilepic)
          }
        />
      ) : (
        <img className="conversationImg" src={`/image/profile.jpg`} />
      )}
      <span className="conversationName">{user ? user.username : null}</span>
    </div>
  );
}
