'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/reset-password`,
            });

            if (error) {
                toast.error(error.message || 'Failed to send reset email');
            } else {
                setIsSuccess(true);
                toast.success('Password reset email sent!');
            }
        } catch (err) {
            console.error('Password reset error:', err);
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-md">
                {/* Back Link */}
                <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                </Link>

                <Card>
                    <CardHeader className="text-center">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                            {isSuccess ? (
                                <CheckCircle className="h-6 w-6 text-primary-foreground" />
                            ) : (
                                <Mail className="h-6 w-6 text-primary-foreground" />
                            )}
                        </div>
                        <CardTitle className="font-display text-2xl">
                            {isSuccess ? 'Check Your Email' : 'Reset Password'}
                        </CardTitle>
                        <CardDescription>
                            {isSuccess
                                ? 'We sent a password reset link to your email address.'
                                : 'Enter your email address and we\'ll send you a reset link.'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isSuccess ? (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground text-center">
                                    Didn&apos;t receive the email? Check your spam folder or try again.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setIsSuccess(false)}
                                >
                                    Try Again
                                </Button>
                                <Button asChild className="w-full">
                                    <Link href="/admin/login">Back to Login</Link>
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
