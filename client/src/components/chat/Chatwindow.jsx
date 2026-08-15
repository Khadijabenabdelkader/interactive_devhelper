import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";


export default function ChatWindow({
messages,
loading
}){


return (

<div

className="
flex-1
overflow-y-auto
p-8
"

>


{

messages.map(message=>(


<ChatMessage

key={message.id}

message={message}

/>


))

}



{

loading &&

<TypingIndicator/>

}


</div>

)

}