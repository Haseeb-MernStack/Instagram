import { setAuthUser } from '../redux/authSlice.js';
import store from '../redux/store.js';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import axios from 'axios';
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CreatePost from './CreatePost.jsx';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while logging out.");
        }
    };



    const sidebarHandler = (textType) => {
        if (textType.toLowerCase() === "logout") {
            logoutHandler();
        } else if (textType.toLowerCase() === "create") {
            setOpen(true);
        }
    };

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage className='rounded-full' src={user?.profilePicture} alt="logo" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ), text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ];

    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-1/6 h-screen'>
            <div className='flex flex-col'>
                <h1 className='font-bold text-xl py-4 pl-3 my-2'>Instagram</h1>
                <div>
                    {sidebarItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => sidebarHandler(item.text)}
                            className='flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'
                            aria-label={`Navigate to ${item.text}`}
                        >
                            {item.icon}
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
};

export default LeftSidebar;
