import { supabase } from './supabase';
import { fetchPlaylistInfo, fetchPlaylistVideos } from './youtube-api';

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
 * Add a playlist to monitor with YouTube metadata
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

    // Fetch playlist info from YouTube API
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    let playlistInfo;

    try {
        playlistInfo = await fetchPlaylistInfo(playlistId, apiKey);
    } catch (err: any) {
        console.error('Failed to fetch playlist info:', err);
        throw new Error('Could not fetch playlist information. Please check the URL.');
    }

    // Insert new playlist with metadata
    const { data: newPlaylist, error } = await supabase
        .from('playlists')
        .insert({
            user_id: userId,
            playlist_id: playlistId,
            playlist_url: playlistUrl,
            title: playlistInfo.title,
            thumbnail: playlistInfo.thumbnail,
            channel_name: playlistInfo.channelTitle,
            video_count: playlistInfo.itemCount,
            created_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) throw error;

    // Trigger initial video sync
    try {
        await syncPlaylistVideos(newPlaylist.id);
    } catch (syncErr) {
        console.error('Initial video sync failed:', syncErr);
        // Don't fail the whole operation, just log error
    }

    return newPlaylist;
}

/**
 * Sync videos for a playlist from YouTube API
 */
export async function syncPlaylistVideos(id: string) {
    // 1. Get playlist details
    const { data: playlist } = await supabase
        .from('playlists')
        .select('playlist_id')
        .eq('id', id)
        .single();

    if (!playlist) throw new Error('Playlist not found');

    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

    // 2. Fetch videos from YouTube
    // Fetch only the first 50 videos for initial sync to be fast
    console.log('Fetching videos from YouTube for playlist:', playlist.playlist_id);
    let videos = [];
    try {
        videos = await fetchPlaylistVideos(playlist.playlist_id, apiKey, undefined, 50);
    } catch (fetchErr: any) {
        console.error('YouTube API fetch failed:', fetchErr);
        throw new Error(`YouTube API Error: ${fetchErr.message}`);
    }

    console.log(`Fetched ${videos.length} videos from YouTube`);

    if (videos.length === 0) {
        throw new Error('No videos found in YouTube playlist. Check if playlist is private or empty.');
    }

    // 3. Get existing video IDs for this playlist to avoid duplicates
    const { data: existingVideos } = await supabase
        .from('videos')
        .select('video_id')
        .eq('playlist_id', id);

    const existingVideoIds = new Set((existingVideos || []).map(v => v.video_id));

    // 4. Filter out already synced videos
    const newVideos = videos.filter(v => !existingVideoIds.has(v.videoId));

    console.log(`Found ${existingVideoIds.size} existing videos, ${newVideos.length} new videos to add`);

    if (newVideos.length === 0) {
        console.log('All videos already synced');
        return;
    }

    // 5. Transform for DB
    const dbVideos = newVideos.map(v => ({
        playlist_id: id,
        video_id: v.videoId,
        title: v.title,
        description: v.description,
        thumbnail_url: v.thumbnail,
        published_at: v.publishedAt,
        is_new: true
    }));

    // 6. Insert new videos (no upsert needed now since we filtered)
    const { error } = await supabase
        .from('videos')
        .insert(dbVideos);

    if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(`Database Error: ${error.message}`);
    }

    console.log(`Successfully inserted ${dbVideos.length} videos`);
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
    // Delete videos first (though cascade delete should handle this if set up)
    await supabase.from('videos').delete().eq('playlist_id', playlistId);

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
    console.log('Fetching videos for playlist:', playlistId);
    const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('playlist_id', playlistId)
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Error fetching videos from DB:', error);
        throw error;
    }
    console.log('Videos found:', data?.length);
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
