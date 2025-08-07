import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    const handleRegister =(event) =>{
        event.preventDefault();
        alert("Registration successful! You can now log in.");
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white border rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">Create your Togedr Account</h1>
                <form className="space-y-6" onSubmit={handleRegister}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            required 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input 
                            type="email" 
                            id="email" 
                            required 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            required 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Sign Up
                    </button>

                    <p className="text-sm text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:underline">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;