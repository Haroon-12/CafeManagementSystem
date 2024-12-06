import React from 'react';

export function Alert({ children }) {
  return <div className="p-4 border rounded">{children}</div>;
}

export function AlertTitle({ children }) {
  return <h4 className="font-bold">{children}</h4>;
}

export function AlertDescription({ children }) {
  return <p>{children}</p>;
}
