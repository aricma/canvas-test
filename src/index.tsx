import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import PureCanvas from './v1';
import CanvasWithForms from './v2';
import reportWebVitals from './reportWebVitals';


ReactDOM.render(
    <React.StrictMode>
        {/*<PureCanvas/>*/}
        <CanvasWithForms/>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
