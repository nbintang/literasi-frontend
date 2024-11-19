import axiosInstance from '@/lib/axios-instances';
import { BookSchemaValues } from '@/schemas/create-book-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function useCreateData({endpointOptions, tag}:{endpointOptions:string, tag:string}) {
  const queryClient = useQueryClient()
    const router = useRouter()
    const result = useMutation({
        mutationKey: [tag],
        mutationFn: async (values:BookSchemaValues) => {
          const res = await axiosInstance.post(endpointOptions, values, {
            headers: {
              "Content-Type": "multipart/form-data"
            },
          });
          return res.data;
        },
        onMutate: () => {
          toast.loading("Uploading...");
        },
        onSuccess: (data) => {
            console.log(data)
          toast.success("Book created successfully")
          router.push(`/dashboard/books`)
          
          queryClient.invalidateQueries({ queryKey: [endpointOptions] });
        },
        onError: (error) => {
        console.log(error.message)
          toast.error("Something went wrong")
        }
      });
    return result
}
