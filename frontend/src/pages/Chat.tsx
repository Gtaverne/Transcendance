import ChatOnline from '../components/ChatOnline';
import Conversation from '../components/Conversation';
import Message from '../components/Message';
import './chat.css';

function Chat() {
  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search For Friends" className="chatMenuInput" />
			<Conversation />
			<Conversation />
			<Conversation />
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
			  <div className="chatBoxTop">
				<Message />
				<Message own={true}/>
				<Message />
			  </div>
			  <div className="chatBoxBottom">
				   <textarea className='chatMessageInput' placeholder='write something...'></textarea>
				   <button className='chatSubmitButton'>Send</button>
			  </div>
		  </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
			  <ChatOnline />
		  </div>
        </div>
      </div>
    </>
  );
}
export default Chat;
