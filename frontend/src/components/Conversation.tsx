import axios from 'axios';
import { useEffect, useState } from 'react';
import './conversation.css';
const imageURL = 'https://cdn.intra.42.fr/users/small_bmerchin.jpg';

function Conversation({ conversation, currentUser }: any) {
  const [users, setUsers] = useState(null);
  const [userDm, setUserDm] = useState('');

  //   console.log(conversation.id);
  //   console.log(currentUser);

  useEffect(() => {
    const getUsers = async () => {
      const res = await axios.get(
        process.env.REACT_APP_URL_BACK + 'rooms/users/' + conversation.id,
      );
      setUsers(res.data);
    //   if (conversation.isDm) {
	// 	  if (res.data)
	//   }
    };
    getUsers();
  }, [conversation, currentUser]);

  return (
    <div className="conversation">
      <img className="conversationImg" src={imageURL} />
      <span className="conversationName">{}</span>
    </div>
  );
}
export default Conversation;
