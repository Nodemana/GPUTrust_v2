import { supabase } from "@/shared/queries/dbclient";
import React from "react";

export async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}
export function listenForAuthStateChange(setIsAuthenticated: (isAuth: boolean) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state change:', event, session);
        
        // Set authentication state based on session presence
        const isAuthenticated = !!session;
        setIsAuthenticated(isAuthenticated);
    });
    
    return subscription;
}

// Custom hook for easier use in React components
export function useAuthState() {
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const session = await checkSession();
            setIsAuthenticated(!!session);
            setLoading(false);
        };

        getInitialSession();

        // Listen for auth changes
        const subscription = listenForAuthStateChange(setIsAuthenticated);

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    return { isAuthenticated, loading };
}