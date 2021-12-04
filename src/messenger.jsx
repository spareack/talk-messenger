import React, { useState, useEffect } from 'react';
import './App.css';
import DialogsField from './components/messenger/dialogs/dialogField/DialogField';
import WorkSpace from './components/messenger/chatField/chat/workSpace/workSpace';
import axios from 'axios'
import { socket } from './socket'
import { useDispatch, useSelector } from 'react-redux';
import { Talk, Message, Dialog, Member } from './components/constructor';
import { afkManager } from './afkManager';

function Messenger({ setLoggedOut }) {

  const dispatch = useDispatch()

  const user = useSelector(state => state.user)
  const messages = useSelector(state => state.messages.messages)
  const dialogs = useSelector(state => state.user.dialogs)
  const talks = useSelector(state => state.talks.talks)
  const currentTalk = useSelector(state => state.talks.currentTalk)
  const lastTalk = useSelector(state => state.talks.lastTalk)
  const currentDialog = useSelector(state => state.user.currentDialog)
  
  /* UI */
  const blurInput = () => {
    dispatch({ type: 'searchInputChange', payload: '' })
    dispatch({ type: 'DISABLE_NAMES' })
    dispatch({ type: 'DISABLE_MENU' })
  }
  /* UI ends */
  const [res, setResponse] = useState(null)
  const [userStatus, setUserStatus] = useState(null)


  useEffect(() => {
    socket.on("socket_info", res => {
      setResponse(res) 
    })
    socket.on('socket_status', res => {
      setUserStatus(res)
      console.log(res)
    })
  }, []) 

  /* Обновление статуса пользователя */
  useEffect(() => {
    if(userStatus !== null){
      const _dialogs = dialogs.map((dialog) => {
        if(dialog.id === userStatus.dialog_id){
          return {...dialog, other_members: dialog.other_members.map( (item)=> {return {...item, user_status: userStatus.user_status}}) } 
        } else return dialog
      })
      dispatch({ type: 'setUserDialogs', payload: _dialogs })
    }
  }, [userStatus, dispatch])


  /* Обработка ответа на socket_info */
  useEffect(() => {
    if(res !== null){
      const _dialog = dialogs.map( (dialog) => {
        if (dialog.id === res.dialog_id) {
          return { ...dialog, unread_count: res.unread_count, last_message: res.value}
        }
        else return dialog
      })
      dispatch({ type: 'setUserDialogs', payload: _dialog })
      if(currentDialog === res.dialog_id)dispatch({type: 'setMessages', payload: [ new Message(res.message_id, res.sender, res.value, res.date), ...messages] })
      socket.emit('read_messages', {dialog_id :user.currentDialog})
    }
  }, [res])

  const getMessages = async (talkId) => {
    let response = await axios({
      method: 'get',
      url: "/get_messages",
      params: {
        talk_id: talkId
      }
    })
    if(response.data.messages !== undefined){
      return new Promise((resolve, reject) => {
        resolve(response.data.messages.reverse())
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve(null)
      })
    }

  }

  const getTalks = async (id) => {
    let response = await axios({
      method: 'get',
      url: '/get_talks',
      params: {
        dialog_id: id
      }
    })
    return new Promise((resolve, reject) => {
      resolve(response.data)
    })
  }

  const createTalk = async (name, dialogID) => {
    let response = await axios({
      method: 'POST',
      url: '/create_talk',
      data: {
        title: name,
        dialog_id: dialogID
      }
    })
      return new Promise((resolve, reject) => {
        resolve(response.data)
      })
  }

  const createDialog = (name, dialogID) => {
    dispatch({ type: 'setUserDialogs', payload: [...dialogs, new Dialog(dialogID, null, [new Member(null, name, 0)])] }) 
  }

  const pushMessage = (messageText) => {
    axios({
      method: 'post',
      url: "/send_message",
      data: {
        sender_id: user.id,
        talk_id: lastTalk,
        dialog_id: currentDialog,
        message_type: 'text',
        value: messageText
      }
    }).then(res => {
      if (!res.data.status) {
        return
        // dispatch({ type: 'setMessages', payload: [{ sender: user.id, value: messageText, date: res.data.date, id: res.data.id }, ...messages] })
        // console.log('message received')
      }
    })
      .catch(error => console.log(error))
  }

  return (
    <div className="App" onClick={() => (blurInput())}>
      <DialogsField 
        dialogs={dialogs}
        setLoggedOut={setLoggedOut}
        getTalks={getTalks}
        getMessages={getMessages}
        createDialog={createDialog}
        createTalk={createTalk}
      />

      <WorkSpace 
        id={currentDialog}
        companion={dialogs.find(Dialog => (Dialog.id === currentDialog))}
        currentTalk={currentTalk} 
        getMsg={getMessages}
        sendMessage={pushMessage}
        createTalk={createTalk} />
    </div>
  );
}

export default Messenger;