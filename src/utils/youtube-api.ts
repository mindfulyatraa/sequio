import { getOAuthTokens } from './oauth-tokens';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

interface YouTubePlaylistInfo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    itemCount: number;
}

interface YouTubeVideo {
    videoId: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
    channelTitle: string;
    duration?: string;
}

/**
 * Fetch playlist information from YouTube API
 */
export async function fetchPlaylistInfo(
    playlistId: string,
    apiKey?: string,
    accessToken?: string
): Promise<YouTubePlaylistInfo> {
    const params = new URLSearchParams({
        part: 'snippet,contentDetails',
        id: playlistId,
    });

    // Use API key if provided, otherwise use OAuth token
    if (apiKey) {
        params.append('key', apiKey);
    }

    const headers: Record<string, string> = {};
    if (accessToken && !apiKey) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(
        `${YOUTUBE_API_BASE}/playlists?${params}`,
        { headers }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch playlist info');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        throw new Error('Playlist not found');
    }

    const item = data.items[0];

    return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        channelTitle: item.snippet.channelTitle,
        itemCount: item.contentDetails.itemCount
    };
}

/**
 * Fetch all videos from a playlist
 */
export async function fetchPlaylistVideos(
    playlistId: string,
    apiKey?: string,
    accessToken?: string,
    maxResults: number = 50
): Promise<YouTubeVideo[]> {
    const videos: YouTubeVideo[] = [];
    let pageToken: string | undefined;

    do {
        const params = new URLSearchParams({
            part: 'snippet,contentDetails',
            playlistId: playlistId,
            maxResults: maxResults.toString(),
        });

        if (apiKey) {
            params.append('key', apiKey);
        }

        if (pageToken) {
            params.append('pageToken', pageToken);
        }

        const headers: Record<string, string> = {};
        if (accessToken && !apiKey) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await fetch(
            `${YOUTUBE_API_BASE}/playlistItems?${params}`,
            { headers }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to fetch playlist videos');
        }

        const data = await response.json();

        if (data.items) {
            for (const item of data.items) {
                // Skip private/deleted videos
                if (item.snippet.title === 'Private video' || item.snippet.title === 'Deleted video') {
                    continue;
                }

                videos.push({
                    videoId: item.snippet.resourceId.videoId,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
                    publishedAt: item.snippet.publishedAt,
                    channelTitle: item.snippet.channelTitle,
                });
            }
        }

        pageToken = data.nextPageToken;
    } while (pageToken);

    return videos;
}

/**
 * Fetch user's YouTube playlists (requires OAuth)
 */
export async function fetchUserPlaylists(
    userId: string,
    maxResults: number = 50
): Promise<YouTubePlaylistInfo[]> {
    // Get user's OAuth token
    const tokens = await getOAuthTokens(userId, 'google');

    if (!tokens || !tokens.access_token) {
        throw new Error('No YouTube access token found. Please connect YouTube first.');
    }

    const playlists: YouTubePlaylistInfo[] = [];
    let pageToken: string | undefined;

    do {
        const params = new URLSearchParams({
            part: 'snippet,contentDetails',
            mine: 'true',
            maxResults: maxResults.toString(),
        });

        if (pageToken) {
            params.append('pageToken', pageToken);
        }

        const response = await fetch(
            `${YOUTUBE_API_BASE}/playlists?${params}`,
            {
                headers: {
                    'Authorization': `Bearer ${tokens.access_token}`
                }
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to fetch user playlists');
        }

        const data = await response.json();

        if (data.items) {
            for (const item of data.items) {
                playlists.push({
                    id: item.id,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
                    channelTitle: item.snippet.channelTitle,
                    itemCount: item.contentDetails.itemCount
                });
            }
        }

        pageToken = data.nextPageToken;
    } while (pageToken);

    return playlists;
}

/**
 * Get video details (duration, views, etc)
 */
export async function fetchVideoDetails(
    videoIds: string[],
    apiKey?: string,
    accessToken?: string
): Promise<any[]> {
    const params = new URLSearchParams({
        part: 'contentDetails,statistics',
        id: videoIds.join(','),
    });

    if (apiKey) {
        params.append('key', apiKey);
    }

    const headers: Record<string, string> = {};
    if (accessToken && !apiKey) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(
        `${YOUTUBE_API_BASE}/videos?${params}`,
        { headers }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch video details');
    }

    const data = await response.json();
    return data.items || [];
}
