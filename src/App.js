import React, { Component } from 'react';
import axios from 'axios';


import logo from './logo.svg';
import './App.css';

const getIssuesOfRepository = path => {
  const [organization, repository] = path.split('/');
  
  return axiosGitHubGraphQL
      .post('', {query: getIssuesOfRepositoryQuery(organization, repository)})
}

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
  }
})

const TITLE = 'React GraphQL GitHub Client'

const getIssuesOfRepositoryQuery = (organization, repository) => `
{
  organization(login: "${organization}") {
    name
    url
    repository(name: "${repository}") {
      name
      url
      issues (last: 5) {
        edges {
          node {
            id
            title
            url
          }
        }
      }
    }
  }
}
`;

const resolveIssuesQuery = queryResult => () => ({
  organization: queryResult.data.data.organization,
  errors: queryResult.data.errors,
})

class App extends Component {
  
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
    organization: null,
    errors: null,
  }
  
  componentDidMount() {
    // fetch data here
    this.onFetchFromGitHub(this.state.path);
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
    this.onFetchFromGitHub(this.state.path);
  }
  
  onFetchFromGitHub = path => {
    getIssuesOfRepository(path).then(queryResult =>
      this.setState(resolveIssuesQuery(queryResult)))
  }
  
  render() {
    
    const {path, organization, errors} = this.state;
    
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
        {organization ? (<Organization organization={organization} errors={errors} />) : (<p>No information yet...</p>)}
        
      </div>
    );
  }
}

const Organization = ({organization, errors}) => {
  if (errors) {
    return(
      <p>
      <strong>Something went wrong:</strong>
      {errors.map(erros => errors.message).join(' ')}
      </p>
      )
  }
  return(
    <div>
      <p>
        <strong>Issues from Organization: </strong>
        <a href={organization.url}>{organization.name}</a>
      </p>
      <Repository repository={organization.repository}/>
    </div>
    )
}

const Repository = ({ repository}) => {
  return (<div>
    <p>
      <strong>In Repository:</strong>
      <a href={repository.url}>{repository.name}</a>
    </p>
    <ul>
      {repository.issues.edges.map(issue => (
        <li key={issue.node.id}>
        <a href={issue.node.url}>{issue.node.title}</a>
        </li>
      ))}
    </ul>
  </div>)
}

export default App;
