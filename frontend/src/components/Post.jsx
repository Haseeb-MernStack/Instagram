import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@radix-ui/react-dialog';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@radix-ui/react-avatar';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts, setSelectedPost } from '../redux/postSlice.js';

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [comments, setComments] = useState(["Great post!", "Nice picture!", "Wow, amazing!"]);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        setText(e.target.value.trim() ? e.target.value : "");
    };

    const handlePostComment = () => {
        if (text.trim()) {
            setComments((prev) => [...prev, text.trim()]);
            setText("");
        }
    };

    const likeOrDislikeHandler = async () => {
        try {
            // Ensure post is not null
            if (!post || !post._id) {
                toast.error('Invalid post data');
                return;
            }

            const action = liked ? 'dislike' : 'like';
            const res = await axios.post(
                `http://localhost:8000/api/v1/post/${post._id}/${action}`,
                {}, // POST body (if needed)
                { withCredentials: true }
            );

            if (res.data.success) {
                setPostLike(liked ? postLike - 1 : postLike + 1);
                setLiked(!liked);

                const updatedPostData = posts.map(p =>
                    p._id === post._id
                        ? {
                            ...p,
                            likes: liked
                                ? p.likes.filter(id => id !== user._id)
                                : [...p.likes, user._id],
                        }
                        : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            } else {
                toast.error('Failed to update like/dislike status.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update like/dislike status.');
        }
    };





    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${post?._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.message];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...post, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);

        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(
                `http://localhost:8000/api/v1/post/delete/${post?._id}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete the post.");
        }
    };

    return (
        <div className="my-8 w-full max-w-sm mx-auto bg-white rounded-lg shadow-md">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <Avatar className="h-12 w-12">
                        <AvatarImage
                            className="h-12 w-12 rounded-full"
                            src={post.author?.profilePicture}
                            alt="user_avatar"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className="font-semibold text-gray-800">{post.author?.username}</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="p-2 rounded-full border border-gray-300 shadow-md hover:shadow-lg">
                            <MoreHorizontal className="text-gray-600 hover:text-gray-800" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6">
                            <DialogTitle className="text-center text-xl font-bold text-gray-900">
                                Post Options
                            </DialogTitle>
                            <div className="mt-4 space-y-4">
                                <button className="w-full py-2 text-red-500 font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg">
                                    Unfollow
                                </button>
                                <button className="w-full py-2 font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg">
                                    Add to Favorites
                                </button>
                                {user && user?._id === post?.author._id && (
                                    <button
                                        onClick={deletePostHandler}
                                        className="w-full py-2 font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Post Image */}
            <img
                src={post.image}
                alt="post_image"
                className="w-full rounded-sm object-cover"
            />

            {/* Post Actions */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} size={24} className='cursor-pointer text-red-600' /> : <FaRegHeart
                            onClick={likeOrDislikeHandler}
                            size={24}
                            className={`cursor-pointer ${liked ? "text-red-600" : "hover:text-red-600"}`}
                        />
                    }
                    <MessageCircle
                        size={24}
                        className="cursor-pointer hover:text-gray-600"
                        onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpen(true);
                        }}
                    />
                    <Send size={24} className="cursor-pointer hover:text-gray-600" />
                </div>
                <Bookmark size={24} className="cursor-pointer hover:text-gray-600" />
            </div>

            {/* Post Details */}
            <div className="px-4">
                <p className="font-medium">{postLike} likes</p>
                <p className="mt-1">
                    <span className="font-medium">{post.author?.username}</span> {post.caption}
                </p>
                <p
                    className="mt-1 text-sm text-gray-400 cursor-pointer"
                    onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }}
                >
                    View all {comment.length} comments
                </p>
            </div>

            {/* Comment Input */}
            <div className="flex items-center mt-4 justify-between px-4 py-2 border-t border-gray-200">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={text}
                    onChange={handleInputChange}
                    className="flex-1 text-sm outline-none"
                />
                {text && (
                    <button
                        onClick={commentHandler}
                        className="text-blue-500 font-medium cursor-pointer"
                    >
                        Post
                    </button>
                )}
            </div>

            {/* Comment Dialog */}
            {open && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6">
                            <DialogTitle className="text-center text-xl font-bold text-gray-900">
                                Comments
                            </DialogTitle>
                            <div className="mt-4 space-y-4 max-h-80 overflow-y-auto">
                                {comments.map((comment, index) => (
                                    <div
                                        key={index}
                                        className="text-gray-800 text-sm border-b border-gray-200 pb-2"
                                    >
                                        {comment}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="mt-4 w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Post;
