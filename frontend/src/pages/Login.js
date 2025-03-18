import { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            alert("Login berhasil!");
            window.location.href = "/inventory";  
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
