/**
 * Checks whether a user with the given email is registered.
 *
 * @param {string} email - The email of the user to check.
 * @returns {Promise<boolean>} A promise that resolves to true if a user with that email exists.
 */
export const fetchUserByEmail = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/get-user_by-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const { exists } = await response.json();

    return Boolean(exists);
  } catch (error) {
    console.error("Error fetching user by email:", error);

    return false;
  }
};
