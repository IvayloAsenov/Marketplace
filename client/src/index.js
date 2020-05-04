import App from './App';
import cartReducer from './reducers/cartReducer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_PATH = 'ws://localhost:8000/ws/chat';

export default {
    API_PATH
};

function saveToLocalStorage(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (e) {
        console.log(e);
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

const persistedState = loadFromLocalStorage();

const store = createStore(
    cartReducer,
    persistedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => saveToLocalStorage(store.getState()));

const stripePromise = loadStripe("pk_test_TqTgAThD0sZ6e71qdzurjoCC00o0RWyr0R");

ReactDOM.render(<Elements stripe={stripePromise}>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </Elements>, document.getElementById('root'));

