import './chatOnline.css';
const imageURL = 'https://cdn.intra.42.fr/users/small_ttranche.jpg';

function ChatOnline() {
  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img className="chatOnlineImg" src={imageURL} alt="" />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">Norminet</span>
      </div>
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img className="chatOnlineImg" src={imageURL} alt="" />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">Norminet</span>
      </div>
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img className="chatOnlineImg" src={imageURL} alt="" />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">Norminet</span>
      </div>
    </div>
  );
}
export default ChatOnline;
