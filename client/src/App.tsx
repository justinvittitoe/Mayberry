import './App.css';
import { Outlet } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

const httpLink = createHttpLink({
  uri: '/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

function App() {
  return (
    <div className="app">
      <ApolloProvider client={client}>
        <ErrorBoundary>
          <Navbar />
          <main className="main-content">
            <Outlet />
          </main>
        </ErrorBoundary>
      </ApolloProvider>
    </div>
  );
}

export default App;
