import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import toast from 'react-hot-toast';
import {Link} from 'react-router-dom';

const Navbar = () => {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });
  const {mutate:logout, isPending, isError, error} = useMutation({
    mutationFn: async({}) => {
        try {
            const res = await fetch("/api/auth/logout",{
                method:"POST",
            })
            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error|| "Something went wrong");
            };
        }catch(error){
            toast.error(error.message)
            throw error;
        }
    },
    onSuccess: () => {
        toast.success("Logout Successful");
        queryClient.invalidateQueries({queryKey: ["authUser"]})
    },
    onError: () => {
        toast.error("Logout failed");
    }
  });

  const data={}
    return (
    <div>
        <Link to='/'>
            <span>Home</span>
        </Link>
        <Link to='/notifications'>
            <span>Notifications</span>
        </Link>
        <Link to={`/profile/${authUser}.email`}>
            <span>Profile</span>
        </Link>
        {authUser && (
            <Link to={`/profile/${authUser.email}`}>
                <div>
                    <img src={authUser.profileImg} className='h-7'/>
                </div>
                <div>
                    <p>{authUser.fullName}</p>
                    <p>{authUser.email}</p>
                </div>
                <button onClick={(e) => {
                    e.preventDefault();
                    logout();
                }}>Logout
                </button>
            </Link>)}
    </div>
  )
}

export default Navbar
