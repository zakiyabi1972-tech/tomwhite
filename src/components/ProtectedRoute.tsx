'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/admin/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Show message if user is not admin
    if (!isAdmin && !isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-display font-bold mb-2">Access Denied</h1>
                    <p className="text-muted-foreground mb-4">
                        You don&apos;t have admin access. Please contact the administrator.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="text-primary underline"
                    >
                        Return to Homepage
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
