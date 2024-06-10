import ChatOnline from '../ChatOnline'
import Conversation from '../Conversation'
import Message from '../Message'
import '../messenger.css'

export default function messenger() {
  return (
    <>
    <div className='messenger'>
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <input  placeholder='search' className='chatMenuInput'/>
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
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
          </div>
          <div className="chatBoxBottom">
            <textarea className='chatMessageInput' placeholder='write something'></textarea>
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
  )
}
