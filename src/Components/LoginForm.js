import React from "react";

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
      error: "",
    };
    this.timer = null;
    this.transport = this.props.transport;

    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (!["constructor", "render"].includes(key)) {
        this[key] = this[key].bind(this);
      }
    }
  }

  auth() {
    const errorEvents = [
      [
        this.state.login.length < 5 ||
          this.state.password.length < 5 ||
          this.state.login.length > 16 ||
          this.state.password.length > 16,
        { message: "Login & password length should be 5..16" },
      ],
      [
        this.state.login.match("^[a-zA-Z0-9_.-]*$") === null ||
          this.state.password.match("^[a-zA-Z0-9_.-]*$") === null,
        { message: "Login & password should only contain [a-zA-Z0-9_.-]" },
      ],
    ];

    for (const event of errorEvents) {
      if (event[0]) {
        this.showError(event[1]);
        return;
      }
    }

    this.transport
      .socketCall("authUser", {
        user: { login: this.state.login, password: this.state.password },
      })
      .then(this.props.callback)
      .catch(this.showError);
  }

  showError(err) {
    console.log("IN SHOWERROR: ", err);
    this.setState({ error: err.message });
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.setState({ error: "" }), 5000);
  }

  render() {
    return (
      <div className="login-form">
        <h1 className="form-title">Login</h1>
        <input
          className="form-field"
          value={this.login}
          onChange={(event) => this.setState({ login: event.target.value })}
          type="text"
          name="input"
          placeholder="Enter login"
        />
        <input
          className="form-field"
          value={this.password}
          onChange={(event) => this.setState({ password: event.target.value })}
          type="password"
          name="input"
          placeholder="Enter password"
        />
        <button className="form-button" onClick={this.auth}>
          Login
        </button>
        <h1 className="error-box">{this.state.error}</h1>
      </div>
    );
  }
}
