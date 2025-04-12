import { supabase } from '../lib/supabase';

/**
 * Makes a user an admin by setting is_admin=true in their profile
 * This function should be run in the browser console by an existing admin
 * @param email The email of the user to make an admin
 */
export const makeUserAdmin = async (email: string) => {
  try {
    // First, find the user by email
    const { data: profiles, error: findError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email);
      
    if (findError) throw findError;
    
    if (!profiles || profiles.length === 0) {
      console.error(`No user found with email: ${email}`);
      return { success: false, message: 'User not found' };
    }
    
    const userProfile = profiles[0];
    
    // Update the user's profile to make them an admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', userProfile.id);
      
    if (updateError) throw updateError;
    
    console.log(`User ${email} is now an admin!`);
    return { success: true, message: `User ${email} is now an admin!` };
  } catch (error) {
    console.error('Error making user admin:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// To use this function, open the browser console and run:
// 
// import { makeUserAdmin } from './utils/makeAdmin';
// makeUserAdmin('user@example.com');
//
// Or, add a button to the admin interface to call this function
