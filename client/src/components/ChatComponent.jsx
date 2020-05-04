import React, { Component } from 'react';
import '../styles/Chat.scss';
import WebSocketInstance from '../WebSocket';

class ChatComponent extends Component {
    constructor(props) {
        WebSocketInstance.connect();
        super(props);
        const chatroom_id = this.props.match.params.chatroom_id;
        this.state = { chat_username: '', chatroom_id: chatroom_id , init: 0};
        this.state = {
            message : '',
            messages : []
        };
    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(
            function(){
                if(WebSocketInstance.state() === 1){
                    console.log('Connection is made');
                    callback();
                    return;
                }
                else{
                    console.log("Waiting for connection..");
                    component.waitForSocketConnection(callback);
                }
            }, 100);
    }

    scrollToBottom = () => {
        const chat = this.messagesEnd;
        const scrollHeight = chat.scrollHeight;
        const height = chat.clientHeight;
        const maxScrollTop = scrollHeight - height;
        chat.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    };
    addMessage(message) {
        this.setState({
            messages : [...this.state.messages, message]
        });
    }

    setMessages(messages){
        this.setState ({
            messages : messages.reverse()
        });
        console.log('This was called')
    }

    messageChangeHandler = (event) => {
        this.setState({
            message : event.target.value
        });
    };

    sendMessageHandler = (e, message) => {
        const messageObject = {
            from : this.state.chat_username,
            text : message,
            chatroom : this.state.chatroom_id,
        };

        WebSocketInstance.newChatMessage(messageObject);

        this.setState({
            message : ''
        });

        e.preventDefault();
    };

    renderMessages = (messages) => {
        const currentUser = this.state.chat_username;
        return messages.map((message, i) => {
            return (
            <li key={message.id} className={message.author === currentUser ? 'me' : 'her'}
            >
                <h4 className='author'>
                    {message.author}
                </h4>
                <p>
                    {message.content}
                </p>
            </li>
            );

        });
    };

    getUsername(seller_id) {
        fetch(`http://localhost:8000/core/users?id=${seller_id}`, {
            method: 'GET',
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
            },
        }).then(res => {
            if(res.status >= 400) {
                throw new Error("");
            }
            return res.json();
        }).then(json => {
            console.log("HELLO");
            this.setState({ chat_username: json.username });
            console.log("Hey3 " + this.state.chat_username);
            this.setState({ chatroom_id: this.props.match.params.chatroom_id});
            this.getNameFromId(this.props.match.params.chatroom_id)
        });
    }


    getNameFromId(id)  {
        fetch(`http://localhost:8000/core/users?id=${id}`, {
            method: 'GET',
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
            },
        }).then(res => {
            if(res.status >= 400) {
                throw new Error("");
            }
            return res.json();
        }).then(json => {

            this.setState({ chatroom_name: json.username})
        });
    }


    componentDidMount() {
        this.scrollToBottom();
    }
    componentDidUpdate() {
        this.scrollToBottom();
        if (this.state.chat_username && !this.state.init) {
            this.init_chat();
            this.setState({ init: 1})

        }
        console.log("Hey2-- " + this.state.chat_username);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.getUsername(nextProps.id);
        }
        if (this.state.chat_username) {
            this.init_chat();
        }
    }

    init_chat() {
        this.waitForSocketConnection(() => {
            console.log("NOW " + this.state.chat_username);
            WebSocketInstance.initChatUser(this.state.chat_username);
            WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this));
            WebSocketInstance.fetchMessages(this.state.chatroom_id);
        });
        console.log("Messages:" + this.state.messages)
    }

    render() {
        const messages = this.state.messages;
        console.log("Messages2:" + this.state.messages);
        const username  = this.state.chat_username;
        const chatroomName = this.state.chatroom_name;
        const currentUser = username;
        console.log("HEYOO " + username);
        return (
            <div className='chat'>
                <div className="container">
                    <h1>Chatting as {currentUser} in chat room of {chatroomName}</h1>
                    <h3>Displaying only the recent 50 messages</h3>
                    <ul ref={(el) => {this.messagesEnd = el; }}>
                        {
                            messages &&
                            this.renderMessages(messages)
                        }
                    </ul>
                </div>
                <div className="container message-form">
                    <form
                    onSubmit={(e) => this.sendMessageHandler(e, this.state.message)}
                    className="form">
                        <input
                        type="text"
                        onChange={this.messageChangeHandler}
                        value={this.state.message}
                        placeholder="Start Typing"
                        required />
                        <button type="submit" className="submit" value="Submit">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default ChatComponent;