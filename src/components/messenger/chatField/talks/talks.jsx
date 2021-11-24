import React from 'react'
import classes from './talks.module.css'
import TalkItem from './talksItem' 
import {useDispatch, useSelector} from 'react-redux'

const Talks = ({ current, setTalk, createTalk, currentDialog, active}) => {
    const talks = useSelector(state => state.talks.talks)

    return (
        <div className={active ? classes.talks : classes.talks} style={active ? {width: '35%'} : {width: '0%', border: 'none'}}>
            <button onClick={() => (createTalk('123', currentDialog))} className={classes.talksHead}>Search</button>
            <div className={classes.talksItems}>
                {talks ? talks.map((talk) => <TalkItem   
                                                key={talk.id}
                                                id={talk.id}
                                                name={talk.title}
                                                item={talk}
                                                current={current === talk.id}
                                                onclick={setTalk} />) 
            : <div className={classes.noTalkItem}>Ещё не заведено ни одного разговора</div>}
            </div>
        </div>
    )
}

export default Talks
