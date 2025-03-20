import { makeAutoObservable, runInAction } from 'mobx';
import { authApis } from '../config/apiRoutes/authAPi';

interface User {
    _id: string;
    username: string;
    email: string;
    password?: string;
    firstname?: string;
    lastname?: string;
}

class AuthStore {
    loading: boolean = false;
    user: User | null = null;
    authToken: string | null = null;
    isAuthenticated: boolean = false;

    setUser = (user: User) => (this.user = user);
    setLoading = (load: boolean) => (this.loading = load);

    constructor() {
        makeAutoObservable(this);
        this.authToken = localStorage.getItem('authToken');
        this.isAuthenticated = !!this.authToken;
        this.getCurrentUser();
    }

    setAuthToken(authToken: string | null) {
        this.authToken = authToken;
        this.isAuthenticated = !!authToken;
        if (authToken) {
            localStorage.setItem('authToken', authToken);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    login = async (username: string, password: string) => {
        try {
            const response = await authApis.postLogin({ email: username, password });

            runInAction(() => {
                this.setUser({
                    _id: response.data.user._id,
                    username: response.data.user.username,
                    email: response.data.user.email,
                    firstname: response.data.user.firstname,
                    lastname: response.data.user.lastname,
                }); // No role & permissions
                this.setAuthToken(response.data.authToken);
            });
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    getCurrentUser = async () => {
        try {
            this.setLoading(true);
            const localAuthToken = localStorage.getItem('authToken');
            if (!localAuthToken || this.user) {
                return;
            }
            const response = await authApis.getCurrentUser();
            runInAction(() => {
                this.setUser({
                    _id: response.data._id,
                    username: response.data.username,
                    email: response.data.email,
                    firstname: response.data.firstname,
                    lastname: response.data.lastname,
                });
            });
        } catch (error) {
            console.error('Failed to get current user:', error);
            this.logout();
            window.location.reload();
        } finally {
            this.setLoading(false);
        }
    };

    logout = async () => {
        try {
            this.setLoading(true);
            await authApis.postLogout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            runInAction(() => {
                this.user = null;
                this.setAuthToken(null);
                this.isAuthenticated = false;
            });
            localStorage.clear();
            this.setLoading(false);
        }
    };
}

export const authStore = new AuthStore();
