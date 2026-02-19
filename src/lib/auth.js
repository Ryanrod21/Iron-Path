import { supabase } from './supabaseClient';

// Sign up user
export async function signUpUser({ email, password, name }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name, role: 'user' },
    },
  });
  return { data, error };
}

// Login user
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

//Forgot password
export const sendPasswordResetEmail = async (email) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://iron-path-five.vercel.app/password-reset',
  });
};

// Logout user
export async function logoutUser() {
  await supabase.auth.signOut();
}

// Delete currently logged-in user
export async function deleteUser() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error getting user:', userError);
    return { error: userError };
  }

  if (!user) {
    console.error('No user logged in');
    return { error: 'No user logged in' };
  }

  const { error } = await supabase.auth.deleteUser();
  if (error) {
    console.error('Error deleting user:', error);
    return { error };
  }

  console.log('User deleted successfully');
  return { success: true };
}
