import React, { Fragment } from "react";
import "./404.css";
import {Link} from 'react-router-dom'

const NotFound = () => {
  return (
    <Fragment>
      <div className="notFoundContainer">
          <svg viewBox="0 0 1000 400">
            <text id="mytext" x="50%" y="50%" textAnchor="middle" fill="none">PAGE NOT FOUND !</text>
            <use xlinkHref="#mytext" className="copy copy1" />
            <use xlinkHref="#mytext" className="copy copy2" />
            <use xlinkHref="#mytext" className="copy copy3" />
            <use xlinkHref="#mytext" className="copy copy4" />
            <use xlinkHref="#mytext" className="copy copy5" />
          </svg>
          <div className="goHome">
            <Link to="/">Home</Link>
          </div>
      </div>
    </Fragment>
  );
};

export default NotFound;