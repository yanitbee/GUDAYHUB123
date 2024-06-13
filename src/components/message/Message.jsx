import './message.css'
import { format } from 'timeago.js';

export default function Message({message,own}) {



  return (
    <div className={own ? "message own" : "message"}>
        <div className="messageTop">
            <img className='messageImg' src="https://static.scientificamerican.com/sciam/cache/file/32665E6F-8D90-4567-9769D59E11DB7F26_source.jpg?w=900" alt="" />
            <p className='messageText'>{message.text}</p>
        </div>
        <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}
