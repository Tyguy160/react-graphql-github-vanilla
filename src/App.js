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

const GET_ORGANIZATION = `
{
  organization(long: "the-road-to-learn-react") {
    name
    url
  }
}
`

class App extends Component {
  
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
  }
  
  componentDidMount() {
    // fetch data here
    this.onFetchFromGitHub();
  }
  
  onChange = e => {
    this.setState({
      path: e.target.value
    })
  }
  
  onSubmit = e => {
    // fetch data
    e.preventDefault();
    console.log("Fetching data...")
  }
  
  onFetchFromGitHub = () => {
    axiosGitHubGraphQL
      .post('', {query: GET_ORGANIZATION})
      .then(result => console.log(result))
  }
  
  render() {
    
    const {path} = this.state;
    
    return (
      <div className="App">
        <h1>{TITLE}</h1>
        
        <form onSubmit={this.onSubmit}>
          <label htmlFor="url">
          Show open issues for https://github.com/
          </label>
          <input id="url" type="text" onChange={this.onChange} style={{width: '300px'}} value={path}/>
          <button type="submit">Search</button>
        </form>
        <hr/>
        
        {/*Display the results here */}
      </div>
    );
  }
}

export default App;
