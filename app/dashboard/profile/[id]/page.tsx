"use client";
import {
  EditProfileForm,
  ProfileUser,
} from "@/components/profile-form/edit-profile-form";
import useFetchData from "@/hooks/use-fetch-data";
import React from "react";
  
export default function ProfilePage({ params }: { params: { id: string } }) {
    const { id } = params;
    const { data: user, isLoading, isError } = useFetchData({
      tags: "user",
      endpointOptions: `/users/${id}`,
    });
  
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading user data</p>;
  
    return (
      <div className="container">
        <EditProfileForm user={user?.data as ProfileUser} />
      </div>
    );
  }
  