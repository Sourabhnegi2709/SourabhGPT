// components/ui/button.jsx
import React from "react";

const Button = ({ children, className, ...props }) => {
    return (
        <button
            className={`px-3 py-2 rounded-md  text-black ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export { Button };
