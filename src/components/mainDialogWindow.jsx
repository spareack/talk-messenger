import React, {useState, useEffect, useRef} from 'react'
import classes from './styles/MainWindow.module.css'
import MessageList from './messageList'
import Companion from './Companion'

const MainWindow = ({companion, messages, user, sendMessage,active , setActiveTalkMenu}) => {
    const textareaRef = useRef(null);
    const [messageText, setMessageText] = useState('')

    const sendMessageLocal = (e) => {
        e.preventDefault()
        setMessageText('');
        sendMessage(messageText)
    }

    useEffect(()=> {
        textareaRef.current.style.height = "0px";
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = scrollHeight + "px";
        
    }, [messageText])

    return (
        <div className={classes.dialogWindow}>

            <Companion companion={companion} setActive={setActiveTalkMenu}/>
            
            <MessageList messages={messages} user={user}/>
            <form className={classes.txtArea}>
            <div className={classes.wInputContainer}>
                <textarea ref={textareaRef} className={classes.wrapper} placeholder="Type a message" value={messageText} onChange={(e) => (setMessageText(e.target.value))}></textarea>
            </div>
            <button onClick={sendMessageLocal}>Send</button>
            </form>
        </div>
    )
}

export default MainWindow