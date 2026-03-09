/**
 * Loading Component
 * =================
 * A reusable loading spinner component.
 * Can be used in different sizes and contexts.
 */

import React from 'react';
import './Loading.css';

const Loading = ({ size = 'medium', fullScreen = false, message = 'Loading...' }) => {
    if (fullScreen) {
        return (
            <div className="loading-fullscreen">
                <div className="loading-content">
                    <div className={`loading-spinner ${size}`}>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                    </div>
                    {message && <p className="loading-message">{message}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="loading-container">
            <div className={`loading-spinner ${size}`}>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
};

export default Loading;
