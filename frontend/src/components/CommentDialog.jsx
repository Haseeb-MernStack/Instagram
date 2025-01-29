import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog'
import { MoreHorizontal } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useSelector } from 'react-redux'
import store from '../redux/store.js';
import { Comment } from 'postcss'

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState("");
    const { selectedPost } = useSelector(store => store.post)

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    const sendMessageHandler = async () => {
        alert(text);
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className='max-w-5xl p-0 flex flex-col'>
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <img
                            className='w-full h-full object-cover rounded-l-lg'
                            src={selectedPost?.image}
                            alt="post_image" />
                    </div>

                    <div className='w-1/2 flex flex-col justify-between'>
                        <div className='flex items-center justify-between p-4'>
                            <div className='flex gap-3 items-center'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='font-semibold text-xs '>{selectedPost?.author?.username} </Link>
                                    {/* <span className='text-gray-600 text-sm'>{selectedPost?.author?.bio} </span> */}
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer' />
                                </DialogTrigger>
                                <DialogContent className='flex flex-col items-center text-sm text-center'>
                                    <div className='cursor-pointer w-full font-bold text-[#ed4956]'>Unfollow</div>
                                    <div className='cursor-pointer w-full'>Add to favorites</div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                            {
                                selectedPost?.comments.map((comment) => <Comment key={comment._id} comment={comment} />)
                            }
                        </div>
                        <div className='p-4'>
                            <div className='flex items-center gap-2'>
                                <input
                                    type="text"
                                    placeholder='Add a comment...'
                                    onChange={changeEventHandler}
                                    value={text}
                                    className='w-full outline-none border-gray-300 border p-2 rounded'
                                />
                                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Send</Button>
                            </div>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog
