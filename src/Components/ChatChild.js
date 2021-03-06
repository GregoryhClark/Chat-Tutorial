import React, { Component } from "react";
import io from "socket.io-client";
class ChatChild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      // username: '',
      previousRoom: props.previousRoom,
      room: props.room,
      message: "",
      userTyping: false
    };
    this.socket = io.connect(":5000");

    this.socket.on("generate room response", data => this.roomResponse(data));
    this.socket.on("user is typing", data => this.setUserTyping(data));
    this.socket.on(`user not typing`, data => this.removeUserTyping(data));
  }
  componentDidMount() {
    if (this.props.room) {
      console.log("will join rooom ", this.props.room);
      this.socket.emit("join room", { room: this.props.room });
    }
  }
  componentDidUpdate() {
    if (this.props.room) {
      //might need to add a condtion to see if previous and current are different.
      console.log(
        "leaving ",
        this.props.previousRoom,
        " and joining ",
        this.props.room
      );
      this.socket.emit("leave room", { room: this.props.previousRoom });
      this.socket.emit("join room", { room: this.props.room });
    }
  }

  roomResponse(data) {
    this.setState({ messages: [...this.state.messages, data.message] });
  }

  sendMessage = (type, message) => {
    // if (!this.props.room) {
    //   this.socket.emit(`${type} message to general`, { message });
    // } else {
    this.socket.emit(`${type} message to room`, {
      message: this.props.userName + ': ' + message,
      room: this.props.room
    });
    // }
    this.setState({ message: "" }, () =>
      this.socket.emit("user not typing", { room: this.props.room })
    );
  };

  updateInput(val) {
    this.setState({ 
        message: val
     }, () => {
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

  render() {
    const messages = this.state.messages.map((message, index) => {
      return <p key={index}>{message}</p>;
    });
    return (
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title">
                  {this.props.room
                    ? `Room: ${this.props.room}`
                    : "Get a room!"}
                    <br/>
                    User:{this.props.userName}
                </div>
                <hr />
              </div>
              <div className="card-footer">
                {/* <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/> */}
                {/* <h3>User Name:</h3>
                                <h4>{this.props.userName}</h4> */}
                {/* <h3>Room:</h3>
                                <h4>{this.props.room}</h4> */}
                <div className="messages">{messages}</div>
                {this.state.userTyping && (
                  <p className="user-typing">Another User is Typing</p>
                )}
                <br />
                <input
                  type="text"
                  onChange={e => this.updateInput(e.target.value)}
                  // onChange={ev => this.setState({message: ev.target.value})}
                  // placeholder="Message"
                  className="form-control"
                  value={this.state.message}
                />
                <br />
                <button
                  onClick={() => this.sendMessage("blast", this.state.message)}
                  className="btn btn-primary form-control"
                >
                  Send
                </button>
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
