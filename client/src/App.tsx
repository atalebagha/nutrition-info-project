import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import AddDessert from './views/AddDessert'
import DessertList from './views/DessertList'
import './App.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
});

function App() {
	const [addDessert, setAddDesert] = React.useState(false);
  return (
		<ApolloProvider client={client}>
			<div className="mw9 center ph3-ns">
				<div className="ph2-ns">
					<div className="fl wl-100 pa2">
							{
								addDessert ?
									<AddDessert onClose={() => setAddDesert(false)}/> :
									<DessertList addDessert={() => setAddDesert(true)} rowsSelected={1} />
							}
					</div>
				</div>
			</div>
		</ApolloProvider>
  );
}

export default App;
