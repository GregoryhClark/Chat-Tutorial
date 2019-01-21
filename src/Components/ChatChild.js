import React, {Component} from "react";
import io from "socket.io-client";
class ChatChild extends Component {
    constructor(props){
        super(props);
        this.state = {
            messages: [],
            // username: '',
            message: "",
            userTyping: false
        };
        this.socket = io.connect(":5000");
        // this.socket.on("generate general response", data => this.generalResponse(data));
        this.socket.on("generate room response", data => this.roomResponse(data));
        //Ignore for now
        this.socket.on("user is typing", data => this.setUserTyping(data));
        this.socket.on(`user not typing`, data => this.removeUserTyping(data));
        // this.socket.on('RECEIVE_MESSAGE', data =>{addMessage(data)});
        // const addMessage = data => {
        //     this.setState({messages: [...this.state.messages, data]});
        // };
        // this.sendMessage = ev => {
        //     console.log(this.props.room)
        //     ev.preventDefault();
        //     this.socket.emit('SEND_MESSAGE', {
        //         author: this.props.userName,
        //         message: this.state.message,
        //         room: this.props.room
        //     })
        //     this.setState({message: ''});
        // }
    }
    componentDidMount() {
        if (this.props.room) {
            console.log('hit this condition')
          this.socket.emit("join room", { room: this.props.room });
        }
      }
    // generalResponse(data) {
    //   if (!this.props.room) {
    //     this.setState({ messages: [...this.state.messages, data.message] });
    //   }
    // }
  roomResponse(data) {
    this.setState({ messages: [...this.state.messages, data.message] });
  }

  sendMessage = (type, message) => {
    // if (!this.props.room) {
    //   this.socket.emit(`${type} message to general`, { message });
    // } else {
      this.socket.emit(`${type} message to room`, {
        message,
        room: this.props.room
      });
    // }
    this.setState({ message: "" }, () =>
      this.socket.emit("user not typing", { room: this.props.room })
    );
  };
  
  updateInput(val) {
    this.setState({ message: val }, () => {
      if (this.state.message)
        this.socket.emit("user is typing", { room: this.props.room });
      else this.socket.emit("user not typing", { room: this.props.room });
    });
  }

  setUserTyping(data) {
    if (data.room === this.props.room) this.setState({ userTyping: true });
    else if (!data.room && !this.props.room)
      this.setState({ userTyping: true });
  }
  removeUserTyping(data) {
    if (data.room === this.props.room) this.setState({ userTyping: false });
    else if (!data.room && !this.props.room)
      this.setState({ userTyping: false });
  }

    render(){
        const messages = this.state.messages.map((message, index) => {
            return <p key={index}>{message}</p>;
          });
        return (
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title">{this.props.room ? `this.props.room is: ${this.props.room}` : "Get a room!"}</div>
                                <hr/>

                            </div>
                            <div className="card-footer">
                                {/* <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/> */}
                                {/* <h3>User Name:</h3>
                                <h4>{this.props.userName}</h4> */}
                                {/* <h3>Room:</h3>
                                <h4>{this.props.room}</h4> */}
                                <br/>
                                <input 
                                    type="text" 
                                    onChange={e => this.updateInput(e.target.value)}
                                    // onChange={ev => this.setState({message: ev.target.value})}
                                    // placeholder="Message" 
                                    className="form-control" 
                                    value={this.state.message} 
                                />
                                <br/>
                                <button onClick={()=>this.sendMessage("blast", this.state.message)} className="btn btn-primary form-control">Send</button>


                                <div className="messages">
                                    {messages}
                                </div>
                                {this.state.userTyping && (
                                    <p className="user-typing">Another User is Typing</p>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
                    //     <div className="container">
                    //     <div className="row">
                    //         <div className="col-4">
                    //             <div className="card">
                    //                 <div className="card-body">
                    //                     <div className="card-title">Chat Feature</div>
                    //                     <hr/>
                    //                     <div className="messages">
                    //                         {this.state.messages.map((message, index) => {
                    //                             return (
                    //                                 <div key={index}>{message.author}: {message.message}</div>
                    //                             )
                    //                         })}
                    //                     </div>
        
                    //                 </div>
                    //                 <div className="card-footer">
                    //                     {/* <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/> */}
                    //                     <h3>User Name:</h3>
                    //                     <h4>{this.props.userName}</h4>
                    //                     <h3>Room:</h3>
                    //                     <h4>{this.props.room}</h4>
                    //                     <br/>
                    //                     <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
                    //                     <br/>
                    //                     <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                    //                 </div>
                    //             </div>
                    //         </div>
                    //     </div>
                    // </div>
        );
    }
}

export default ChatChild;