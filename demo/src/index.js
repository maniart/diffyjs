import App from './app'
import React from 'react'
import ReactDOM from 'react-dom'

class RootComponent extends React.Component {
  render() {
    return (<div>Demo</div>)
  }
}

ReactDOM.render(<RootComponent />, document.getElementById('app'))
