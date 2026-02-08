import { supabase } from './supabase';

export interface OAuthToken {
    id?: string;
    user_id: string;
    provider: string;
    access_token: string;
    refresh_token?: string;
    expires_at?: string;
    scope?: string;
}

/**
 * Save OAuth tokens to database
 */
export async function saveOAuthTokens(tokens: OAuthToken) {
    const { data, error } = await supabase
        .from('user_tokens')
        .upsert({
            user_id: tokens.user_id,
            provider: tokens.provider,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: tokens.expires_at,
            scope: tokens.scope,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id,provider'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Get OAuth tokens for a user and provider
 */
export async function getOAuthTokens(userId: string, provider: string) {
    const { data, error } = await supabase
        .from('user_tokens')
        .select('*')
        .eq('user_id', userId)
        .eq('provider', provider)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
}

/**
 * Check if user has valid YouTube tokens
 */
export async function hasYouTubeAccess(userId: string): Promise<boolean> {
    const tokens = await getOAuthTokens(userId, 'google');

    if (!tokens || !tokens.scope) return false;

    // Check if scope includes YouTube
    return tokens.scope.includes('youtube.readonly');
}

/**
 * Refresh OAuth access token if expired
 */
export async function refreshOAuthToken(userId: string, provider: string) {
    const tokens = await getOAuthTokens(userId, provider);

    if (!tokens || !tokens.refresh_token) {
        throw new Error('No refresh token available');
    }

    // Check if token is expired
    if (tokens.expires_at) {
        const expiresAt = new Date(tokens.expires_at);
        const now = new Date();

        if (expiresAt > now) {
            // Token still valid
            return tokens;
        }
    }

    // Use Supabase to refresh the session
    const { data, error } = await supabase.auth.refreshSession();

    if (error) throw error;

    if (data.session) {
        // Save the new tokens
        await saveOAuthTokens({
            user_id: userId,
            provider: provider,
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token || tokens.refresh_token,
            expires_at: new Date(Date.now() + (data.session.expires_in || 3600) * 1000).toISOString(),
        });

        return data.session;
    }

    return null;
}
