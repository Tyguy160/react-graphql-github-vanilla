import React, { Component } from 'react';
import axios from 'axios';

import logo from './logo.svg';
import './App.css';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
  }
})

const TITLE = 'React GraphQL GitHub Client'

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>{TITLE}</h1>
      </div>
    );
  }
}

export default App;
