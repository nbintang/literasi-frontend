import axiosInstance from '@/lib/axios-instances';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import toast from 'react-hot-toast';

export default function useDeleteData({endpointOptions, tag}:{endpointOptions: string, tag : string;}) {
    const queryClient = useQueryClient();
      const result = useMutation({
        mutationKey: [tag],
        mutationFn: async () => {
          const res = await axiosInstance.delete(endpointOptions);
          return res.data;
        },
        onSuccess: (data) => {
          console.log(data);
          toast.success("Book created successfully");
          queryClient.invalidateQueries({ queryKey: [tag] });
        },
        onError: (error) => {
          console.log(error.message);
          toast.error("Something went wrong");
        },
      });

      return result
}
