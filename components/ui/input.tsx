import { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="border p-2 rounded shadow-inner text-sm focus:outline-blue-400"
    />
  );
}

