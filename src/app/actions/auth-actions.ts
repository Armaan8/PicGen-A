"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface AuthResponse {
  error: null | string;
  success: boolean;
  data: unknown | null;
}

export async function signup(formdata: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;
  const full_name = formdata.get("full_name") as string;

  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signupError) {
    return {
      error: signupError.message,
      success: false,
      data: null,
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      full_name,
    },
  });

  if (updateError) {
    return {
      error: updateError.message,
      success: false,
      data: null,
    };
  }

  return {
    error: null,
    success: true,
    data: signupData,
  };
}

export async function login(formdata: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  const data = {
    email: formdata.get("email") as string,
    password: formdata.get("password") as string,
  };

  const { data: signInData, error } = await supabase.auth.signInWithPassword(data);

  return {
    error: error?.message || "There was an error logging in!",
    success: !error,
    data: signInData || null,
  };
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updateProfile(values: { fullName: string }): Promise<AuthResponse> {
  const supabase = await createClient();
  const full_name = values.fullName;

  const { data: profileData, error } = await supabase.auth.updateUser({
    data: { full_name },
  });

  return {
    error: error?.message || "There was an error updating the profile!",
    success: !error,
    data: profileData || null,
  };
}

export async function resetPassword(values: { email: string }): Promise<AuthResponse> {
  const supabase = await createClient();

  const { data: resetPasswordData, error } = await supabase.auth.resetPasswordForEmail(
    values.email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    }
  );

  return {
    error: error?.message || "There was an error sending the reset password email!",
    success: !error,
    data: resetPasswordData || null,
  };
}

export async function changePassword(newPassword: string): Promise<AuthResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return {
    error: error?.message || "There was an error changing the password!",
    success: !error,
    data: data || null,
  };
}
