import Button from "@/components/Utility/Button";

const LoginPage = () => {
  return (
    <div className="w-full mt-20 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">Login</h1>
      <p className="text-lg mb-8">Login to manage your parking rotations.</p>

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mt-6">
          <Button type="submit">Log in</Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
