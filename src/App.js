import React, {Component} from 'react'
import Rebase from 're-base'
import './App.css'
import rebaseOptions from './rebaseOptions.json'
//enter your app apikey into rebaseOptions.json to connect firebase
//sample structure in rebaseOptions.sample.json

let base = Rebase.createClass(rebaseOptions)

let initialState = {
  authUserChanges: [],
  authMsg: ""
}

function timeNow() {
  let d = new Date()
  let h = (d.getHours() < 10
    ? '0'
    : '') + d.getHours()
  let m = (d.getMinutes() < 10
    ? '0'
    : '') + d.getMinutes();
  return h + ':' + m;
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  componentDidMount() {
    base.onAuth((user) => {
      if (user === null) {
        if (this.bindingRef) {
          base.removeBinding(this.bindingRef);
          delete this.bindingRef;
        }
        this.setState(initialState)
      } else {
        this.bindingRef = base.syncState(`authUserChanges`, {
          context: this,
          state: 'authUserChanges',
          asArray: true
        })
      }
    })
  }

  handleSubmitSignup(evt) {
    evt.preventDefault()
    base.createUser({
      email: this.refs.signup_email.value,
      password: this.verifySamePassword(this.refs.signup_pw1.value, this.refs.signup_pw2.value)
    }, this.handleSignup.bind(this))
  }

  handleSignup(error, user) {
    if (error) {
      console.log(error)
    } else {
      console.log("user: ", user)
      this.sendEmailVerification()
    }
  }

  sendEmailVerification() {
    if (base.auth().currentUser) {
      base.auth().currentUser.sendEmailVerification().then(() => {
        this.setAuthMsg('Email Verification Sent!')
      })
    }
  }

  handleSubmitLogin(evt) {
    evt.preventDefault()
    base.authWithPassword({
      email: this.refs.login_email.value,
      password: this.refs.login_password.value
    }, this.handleAuth.bind(this))
  }

  handleAuth(error, user) {
    if (error) {
      console.log("error", error)
    } else {
      if (user.emailVerified) {
        this.setAuthMsg(user.email + ' signed in and email verifyed!')
      } else {
        this.setAuthMsg(user.email + ' signed in but not verifyed!')
      }
    }
  }

  verifySamePassword(pw1, pw2) {
    if (pw1 === pw2) {
      return pw2
    }
    return undefined
  }

  handleResendVerificationClick(evt) {
    evt.preventDefault()
    this.sendEmailVerification()
  }

  handleDBChangeClick(evt) {
    if (base.auth().currentUser && base.auth().currentUser.emailVerified) {
      this.setState({
        authUserChanges: this.state.authUserChanges.concat({user: base.auth().currentUser.email, time: timeNow()})
      })
    }
  }

  handleLogoutClick(evt) {
    evt.preventDefault()
    base.unauth()
    this.setAuthMsg('Logged out!')
  }

  setAuthMsg(msg) {
    this.setState({authMsg: msg})
  }

  render() {
    return (
      <div className="App">
        <h2>Firebase User Authentication Using Re-base and React</h2>
        <input type="button" style={{
          alignSelf: "flex-end",
          margin: "5px"
        }} ref="btn_logout" onClick={this.handleLogoutClick.bind(this)} value="Logout"/>
        <form className="create-user-box" onSubmit={this.handleSubmitSignup.bind(this)}>
          <h4>Sign Up:</h4>
          <lable>Email:
            <input type="email" required ref="signup_email"/></lable>
          <lable>Password:
            <input type="password" required ref="signup_pw1"/></lable>
          <lable>Re-type Password:
            <input type="password" required ref="signup_pw2"/></lable>
          <input type="submit" value="Submit"/>
        </form>
        <form className="login-box" onSubmit={this.handleSubmitLogin.bind(this)}>
          <h4>Login:</h4>
          <lable>Email:
            <input type="email" required ref="login_email"/></lable>
          <lable>Password:
            <input type="password" required ref="login_password"/></lable>
          <input type="submit" value="Submit"/>
        </form>
        <div className="authenticated-area" style={{
          border: "1px solid black",
          padding: "5px",
          margin: "10px"
        }}>
          <h4>Authenticated Area</h4>
          <input type="button" ref="btn_verification" onClick={this.handleResendVerificationClick.bind(this)} value="resend verificaton email"/>
          <input type="button" ref="btn_db_change" onClick={this.handleDBChangeClick.bind(this)} value="make authenticated database change"/>
          <div className="authenticated-msg" style={{
            height: "40px",
            margin: "10px"
          }}>{this.state.authMsg}</div>
          <div className="authenticated-db-list">
            {this.state.authUserChanges.map((item, index) => <div key={index} className="db-item">
              {item.user + " " + item.time}
            </div>)}
          </div>
        </div>
      </div>
    )
  }
}

export default App
