import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import client from './client'
import App from './components/App'
import './index.css'

const Root = () => (
  <BrowserRouter>
<<<<<<< HEAD
  <ApolloProvider client={client}>
    <App />
    </ApolloProvider>
=======
    <App />
>>>>>>> b3994c9a7a939ea2cf497bf8da2c5642694f57b8
  </BrowserRouter>
)

ReactDOM.render(<Root />, document.getElementById('app'))

if (module.hot) {
  module.hot.accept()
}
