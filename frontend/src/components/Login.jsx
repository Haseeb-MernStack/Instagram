import { Label } from './ui/label';
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/authSlice.js';

const Login = () => {
    const [input, setInput] = useState({
        email: '',
        password: ''
    })

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await axios.post(
                'http://localhost:8000/api/v1/user/login',
                input,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            console.log("Response received:", res);

            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate('/');
                toast.success(res.data.message);
                setInput({
                    email: '',
                    password: '',
                });
            }
        } catch (error) {
            if (error.response) {
                console.error("Server error:", error.response);
                toast.error(error.response.data?.message || "Server error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form
                onSubmit={signupHandler}
                className='shadow-lg flex flex-col gap-5 p-8'
            >
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>Instagram</h1>
                    <p className='text-sm text-center text-gray-500'>Login to see photos & videos from your friends</p>
                </div>
                <div>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        placeholder="abcd@example.com"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2 text-black"
                    />
                </div>
                <div>
                    <Label>Password</Label>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2 text-black"
                    />
                </div>
                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type="submit">Login</Button>
                    )
                }
                <span className='text-center'>{"Don't"} have any account?<Link to="/signup" className='text-blue-600 font-medium'>Signup</Link></span>
            </form>
        </div>
    )
}

export default Login;
