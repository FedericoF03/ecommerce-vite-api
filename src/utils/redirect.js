export const redirect = async (query = "") => {
  const HTTPConfig = {
    url: `http://localhost:3005/auth/authorization${query}`,
    body: {
      credentials: "include",
    },
  };
  try {
    const getAuthURL = await fetch(HTTPConfig.url, HTTPConfig.body);
    const AuthURL = await getAuthURL.json();
    if(getAuthURL.status == 200) location.href = AuthURL;
  } catch (error) {
    console.error(error)
  }
};
