// This is a script to run in the browser console to make the first user an admin
// Copy and paste this entire script into the browser console while logged in

(async function() {
  try {
    // Get the current user
    const { data: { user } } = await window.supabase.auth.getUser();
    
    if (!user) {
      console.error('No user is logged in');
      return;
    }
    
    console.log('Current user:', user.email);
    
    // Update the user's profile to make them an admin
    const { error } = await window.supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error making user admin:', error);
      return;
    }
    
    console.log(`User ${user.email} is now an admin!`);
    console.log('Please refresh the page to see the admin dashboard link in the dropdown menu.');
  } catch (error) {
    console.error('Error:', error);
  }
})();
