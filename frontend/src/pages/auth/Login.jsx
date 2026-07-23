export default function Login() {
  return (
    <div>
      <h1>Login</h1>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </div>

      <button type="submit">Login</button>
    </div>
  );
}
