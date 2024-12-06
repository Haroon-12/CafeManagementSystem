// src/components/ui/switch.js

import React, { useState } from 'react';

const Switch = ({ checked, onChange, className }) => {
  return (
    <div
      className={`relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in ${
        className || ''
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-2 appearance-none cursor-pointer"
      />
      <span
        className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-400 cursor-pointer ${
          checked ? 'bg-blue-500' : 'bg-gray-400'
        }`}
      ></span>
    </div>
  );
};

export { Switch };
