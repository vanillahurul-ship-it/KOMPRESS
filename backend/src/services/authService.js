const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const login = async (email, password) => {
  // Create a temporary client just for auth to avoid polluting the global service role client.
  // This prevents the global client's headers from being changed to the user's JWT.
  const authClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  login,
};