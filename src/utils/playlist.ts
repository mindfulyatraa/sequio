import { supabase } from './supabase';

/**
 * Extract playlist ID from YouTube URL
 */
export function extractPlaylistId(url: string): string | null {
    try {
        const urlObj = new URL(url);

        // Handle different YouTube URL formats
        // Format 1: https://www.youtube.com/playlist?list=PLxxx
        if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/playlist') {
            return urlObj.searchParams.get('list');
        }

        // Format 2: https://youtube.com/playlist?list=PLxxx
        if (urlObj.hostname.includes('youtube.com')) {
            return urlObj.searchParams.get('list');
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Add a playlist to monitor
 */
export async function addPlaylist(userId: string, playlistUrl: string) {
    const playlistId = extractPlaylistId(playlistUrl);

    if (!playlistId) {
        throw new Error('Invalid YouTube playlist URL');
    }

    // Check if already exists
    const { data: existing } = await supabase
        .from('playlists')
        .select('id')
        .eq('user_id', userId)
        .eq('playlist_id', playlistId)
        .single();

    if (existing) {
        throw new Error('Playlist already being monitored');
    }

    // Insert new playlist
    const { data, error } = await supabase
        .from('playlists')
        .insert({
            user_id: userId,
            playlist_id: playlistId,
            playlist_url: playlistUrl,
            created_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Get all playlists for a user
 */
export async function getUserPlaylists(userId: string) {
    const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

/**
 * Delete a playlist
 */
export async function deletePlaylist(playlistId: string) {
    const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId);

    if (error) throw error;
}

/**
 * Get videos for a playlist
 */
export async function getPlaylistVideos(playlistId: string) {
    const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('playlist_id', playlistId)
        .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

/**
 * Mark video as watched
 */
export async function markVideoAsWatched(videoId: string) {
    const { error } = await supabase
        .from('videos')
        .update({ is_new: false })
        .eq('id', videoId);

    if (error) throw error;
}
