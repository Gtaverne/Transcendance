import './message.css';
const imageURL = 'https://cdn.iconscout.com/icon/free/png-256/list-message-2367725-1976875.png';

function Message({own = false}) {
  return (
	<div className={own?"message own":"message"}>
		<div className="messageTop">
			<img className='messageImg' src={imageURL} alt="" />
			<p className='messageText'>Hello this is a message</p>
		</div>
		<div className="messageBottom">1 hour ago</div>
	</div>
  )
}
export default Message