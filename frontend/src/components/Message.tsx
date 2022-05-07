import moment from 'moment';
import MessageInterface from '../interfaces/MessageInterface';
import './message.css';
const imageURL = 'https://cdn.iconscout.com/icon/free/png-256/list-message-2367725-1976875.png';

type MessageProps = {
	own: boolean;
	message: MessageInterface;
	imageURL: string | undefined;
  };  

  function Message({own, message, imageURL}: MessageProps) {
	  return (
		  <div className={own?"message own":"message"}>
		<div className="messageTop">
			<img className='messageImg' src={imageURL} alt="" />
			<p className='messageText'>{message.message}</p>
		</div>
		<div className="messageBottom">{moment(message.createdAt).fromNow()}</div>
	</div>
  )
}
export default Message