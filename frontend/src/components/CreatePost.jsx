// Importing required dependencies and components
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '../lib/utils.js';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../redux/postSlice.js';

const CreatePost = ({ open, setOpen }) => {
    // References and state hooks
    const imageRef = useRef();
    const [file, setFile] = useState("");
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { posts } = useSelector((state) => state.post);
    const dispatch = useDispatch();

    /**
     * Handles file input changes.
     * Reads the selected file and generates a preview image.
     */
    const fileChangeHandler = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const dataUrl = await readFileAsDataURL(selectedFile);
            setImagePreview(dataUrl);
        }
    };

    /**
     * Handles the creation of a new post.
     * Validates input, sends data to the server, and updates the Redux store on success.
     */
    const createPostHandler = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Validation for empty fields
        if (!caption || !file) {
            return toast.error("Caption and image are required.");
        }

        // Prepare form data for API request
        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("image", file);

        try {
            setLoading(true);

            // Sending the POST request to the API
            const response = await axios.post(
                'http://localhost:8000/api/v1/post/addpost',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true, // Include credentials (cookies)
                }
            );

            // If the request succeeds, update the Redux store and reset inputs
            if (response.data.success) {
                dispatch(setPosts([response.data.post, ...posts]));
                toast.success(response.data.message);
                setOpen(false); // Close the dialog
                setCaption(""); // Reset caption
                setFile(""); // Reset file input
                setImagePreview(""); // Clear image preview
            }
        } catch (error) {
            // Handle errors
            const errorMessage =
                error.response?.data?.message || "An unexpected error occurred.";
            toast.error(errorMessage);
        } finally {
            setLoading(false); // Stop the loading spinner
        }
    };

    return (
        <div>
            <Dialog open={open}>
                <DialogContent onInteractOutside={() => setOpen(false)}>
                    <DialogHeader className="text-center font-semibold">
                        Create New Post
                    </DialogHeader>
                    <div className="flex gap-3 items-center">
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} alt="img" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="font-semibold text-xs">{user?.username}</h1>
                            <span className="text-gray-600 text-xs">Bio here...</span>
                        </div>
                    </div>
                    <Textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Write a caption..."
                        className="focus-visible:ring-transparent border-none"
                    />
                    {imagePreview && (
                        <div className="w-full h-64 flex items-center justify-center">
                            <img
                                className="object-cover h-full w-full rounded-md"
                                src={imagePreview}
                                alt="preview_img"
                            />
                        </div>
                    )}
                    <input
                        ref={imageRef}
                        onChange={fileChangeHandler}
                        type="file"
                        className="hidden"
                    />
                    <Button
                        onClick={() => imageRef.current.click()}
                        className="w-fit mx-auto bg-[#0095f6] hover:bg-[#258bcf]"
                    >
                        Select from computer
                    </Button>
                    {imagePreview &&
                        (loading ? (
                            <Button>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait...
                            </Button>
                        ) : (
                            <Button
                                onClick={createPostHandler}
                                type="submit"
                                className="w-full"
                            >
                                Post
                            </Button>
                        ))}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreatePost;
