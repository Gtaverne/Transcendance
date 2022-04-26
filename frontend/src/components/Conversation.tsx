import './conversation.css';
const imageURL = 'https://cdn.intra.42.fr/users/small_bmerchin.jpg';

function Conversation() {
  return (
    <div className="conversation">
      <img className="conversationImg" src={imageURL}/>
      <span className="conversationName">bmerchin</span>
    </div>
  );
}
export default Conversation;
