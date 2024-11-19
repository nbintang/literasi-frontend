"use client";
import axiosInstance from "@/lib/axios-instances";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useFetchData({
  tags,
  endpointOptions,
}: {
  tags: string;
  endpointOptions?: string;
}) {
  const { data, ...rest } = useQuery({
    queryKey: [tags, endpointOptions], // Unique key for caching
    async queryFn() {
      if (!endpointOptions) throw new Error("Endpoint is required");
      const response = await axiosInstance.get(endpointOptions);
      return response.data; // Return the `data` property from the server
    },
    staleTime: 5000, // Optional: prevent refetching for 5 seconds
    retry: 1, // Optional: retry once on failure
  });

  return { data, ...rest }; // Spread additional properties like `isLoading`, etc.
}
