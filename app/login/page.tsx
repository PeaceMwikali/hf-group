import Login from "@/components/auth/login";

const LoginPage = () => {
  return (
    <div className="w-full h-screen flex">
      <img
        src="https://images.unsplash.com/photo-1540569876033-6e5d046a1d77?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
        alt="background"
        className="object-cover object-center h-screen w-7/12"
      />
      <div className="bg-white flex flex-col justify-center items-center w-5/12 shadow-lg">
        <h1 className="text-3xl font-bold text-orange-500 mb-2">LOGIN</h1>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
