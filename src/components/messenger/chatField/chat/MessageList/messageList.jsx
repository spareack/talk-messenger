import React, {useState, useRef, useEffect} from 'react'
import MessageListItem from '../MessageListItem/MessageListItem'
import classes from './MessageList.module.css'
import { useDispatch, useSelector } from 'react-redux'

const MessageList = ({active, getMessages}) => {
    const dispatch = useDispatch()
    const list = useRef(null)
    const [scrollIsActive, setActiveScroll] = useState(false)

    const user = useSelector(state => state.user)
    const messages = useSelector(state => state.messages.messages)
    const talks = useSelector(state => state.talks)

    const scrollToggler = () => {
        setActiveScroll((scrollIsActive) => (!scrollIsActive))
    }

    const messageFetching = async () => {
        if(list.current.scrollHeight + list.current.scrollTop === list.current.clientHeight){
            const currentTalkIndex = talks.talks.findIndex((element) => {if(element.id === talks.currentTalk) return true})
            console.log('currentTalkIndex ' + currentTalkIndex)
            if(currentTalkIndex){
                const fetchCurrentTalk = talks.talks[currentTalkIndex-1].id
                dispatch({type: 'setCurrentTalk', payload: fetchCurrentTalk})
                let _messages = await getMessages(fetchCurrentTalk)
                dispatch({type: 'setMessages', payload: [...messages, ..._messages]})
                // console.log(messages)
                // list.current.scrollTo({
                //     top: 0
                //   })
            }
        }
    }

    return (
        <div style={{paddingInline: active? '15px' : '15%'}} ref={list} className={!scrollIsActive ? classes.MessageList + ' ' + classes.MessageListNoScroll : classes.MessageList} onScroll={messageFetching} onMouseOver={scrollToggler} onMouseOut={scrollToggler}>
            {messages ?
            messages.map((msgItem, index) => 
                <MessageListItem from={user.id === msgItem.sender} text={msgItem.value} time={msgItem.date} key={index}/>
            )
            :<MessageListItem from={true} text={'Напишите этому человеку!'} time={'А это не важно'}/>}
        </div>
    )
}

export default MessageList