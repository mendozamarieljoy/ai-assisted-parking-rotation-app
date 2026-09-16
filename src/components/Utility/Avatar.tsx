const Avatar = () => {
  const isLoggedIn = true; // Replace with actual authentication logic

  if (!isLoggedIn) {
    return null; // Don't render the avatar if the user is not logged in
  }

  return (
    <div>
      <div className="rounded-full bg-white text-slate-700 font-black w-8 h-8 flex items-center justify-center text-center">
        {`A`}
      </div>

      <ul>
        <li>
          <a>Login</a>
        </li>
      </ul>
    </div>
  );
};

export default Avatar;
