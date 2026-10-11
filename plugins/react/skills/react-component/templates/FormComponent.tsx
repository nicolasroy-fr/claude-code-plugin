import { useState, type FormEvent } from "react";

export interface __Name__Props {
  onSubmit: (values: { email: string }) => void;
}

export function __Name__({ onSubmit }: __Name__Props) {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ email });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-1">
        Email
        <input
          type="email"
          className="rounded-md border px-3 py-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
