class AuthService {
    static async loginWithGoogle() {
        // You'll need to replace the following URL with your actual OAuth login endpoint
        const oauthEndpoint = `${
           process.env.NEXT_PUBLIC_BACKEND_URL
        }oauth_login/google?redirect_uri=${process.env.NEXT_PUBLIC_FRONTEND_URL}app`;

        window.location.href = oauthEndpoint;
    }

    static async loginWithGithub() {
        // You'll need to replace the following URL with your actual OAuth login endpoint
        const oauthEndpoint = `${
            process.env.NEXT_PUBLIC_BACKEND_URL
        }oauth_login/github?redirect_uri=${process.env.NEXT_PUBLIC_FRONTEND_URL}app`;

        window.location.href = oauthEndpoint;
    }
}

export default AuthService;