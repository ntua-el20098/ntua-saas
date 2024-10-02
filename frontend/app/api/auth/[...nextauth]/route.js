import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const accessToken = account.access_token;

        await checkOrCreateUser(user, accessToken);
        await addCredits(user, accessToken);
        await fetchUserRole(user, accessToken);
      }
      return true; // Return true to proceed with the sign-in
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.role = user.role; // Store the role in the token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      session.user.role = token.role; // Add role to the session
      return session;
    },
  },
};

async function checkOrCreateUser(user, accessToken) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_USER_MANAGEMENT_API}/checkUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
      }),
    });

    const data = await response.json();
    console.log('Response from user management API:', data);
  } catch (error) {
    console.error('Error checking/creating user:', error);
  }
}

async function addCredits(user, accessToken) {
  try {
    const responseCredits = await fetch(`${process.env.NEXT_PUBLIC_CREDITS_API}/user/add/credits/0`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const dataCredits = await responseCredits.json();
    console.log('Response from credit microservice:', dataCredits);
  } catch (error) {
    console.error('Error adding credits:', error);
  }
}

async function fetchUserRole(user, accessToken) {
  try {
    const roleResponse = await fetch(`${process.env.NEXT_PUBLIC_USER_MANAGEMENT_API}/getRole`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (roleResponse.ok) {
      const roleData = await roleResponse.json();
      console.log('Response from role endpoint:', roleData);
      user.role = roleData.role; // Add role to the user object
    } else {
      const roleData = await roleResponse.json();
      console.error('Error fetching role:', roleData);
    }
  } catch (error) {
    console.error('Error fetching role:', error);
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
