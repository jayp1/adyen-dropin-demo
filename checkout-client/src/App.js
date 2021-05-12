import React from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Checkout from './Checkout';

export default function App() {

    return (
        <BrowserRouter>
            {/*<div className="links">
                <Link to='/'>Home</Link>
                <Link to='/success'>Success</Link>
                <Link to='/error'>Error</Link>
    </div>*/}

            <Switch>

                <Route path='/success'>
                    <Success />
                </Route>
                <Route path='/error'>
                    <Error />
                </Route>
                <Route path='/'>
                    <Checkout />
                </Route>
                <Redirect to="/" />
            </Switch>
        </BrowserRouter>
    );

}

function Success() {

    const handleReturn = e => {
        e.preventDefault();
        window.location.href = "/";
    }
    return (
        <main>
            <div className="card">
                

                <div className="result-box">
                <h2>Success</h2>

                </div>
                <p>Congratulations! Your payment was a success!</p>
                <button className="return-home-btn" type="submit" onClick={handleReturn}>Return Home</button>

            </div>

        </main>
    );
}
function Error() {
    const handleReturn = e => {
        e.preventDefault();
        window.location.href = "/";
    }
    return (
        <main>
            <div className="card">
                

                <div className="result-box">
                <h2 style={{color:'red'}}>Error</h2>

                </div>
                <p>Unfortunately your payment failed. Please try again</p>
                <button className="return-home-btn" type="submit" onClick={handleReturn}>Return Home</button>

            </div>

        </main>
    );
}