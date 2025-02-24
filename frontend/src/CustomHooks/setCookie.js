const COOKIE_KEY = "gitgrove_";

function setAuthCookie(username, token) {
  console.log("exe");

  const cookieName = COOKIE_KEY + username;
  const maxAge = 86400;
  const path = "/";

  const cookieString = `${cookieName}=${token}; Max-Age=${maxAge}; Path=${path}; Secure=false; HttpOnly=true`;

  document.cookie = cookieString;
  console.log(`Cookie set: ${cookieString}`);
}

export default setAuthCookie;
