import { supabase } from './supabase';

// Telegram Bot API Base URL
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}`;

/**
 * Send message to Telegram chat
 */
export async function sendTelegramMessage(chatId: string, text: string) {
    try {
        const response = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        if (!data.ok) {
            throw new Error(data.description || 'Failed to send message');
        }

        return data.result;
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        throw error;
    }
}

/**
 * Generate 6-character verification code (alphanumeric)
 */
export function generateVerificationCode(): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

/**
 * Verify Telegram code and connect user account
 */
export async function verifyTelegramCode(userId: string, code: string) {
    try {
        // Find notification settings with matching code (regardless of user_id)
        const { data, error } = await supabase
            .from('notification_settings')
            .select('*')
            .eq('telegram_verification_code', code)
            .is('telegram_verified_at', null)
            .single();

        if (error || !data) {
            throw new Error('Invalid verification code. Please check and try again.');
        }

        // Update: link to logged-in user and mark as verified
        const { error: updateError } = await supabase
            .from('notification_settings')
            .update({
                user_id: userId,
                telegram_enabled: true,
                telegram_verified_at: new Date().toISOString(),
                telegram_verification_code: null
            })
            .eq('id', data.id);

        if (updateError) {
            throw updateError;
        }

        // Send success message to Telegram
        if (data.telegram_chat_id) {
            await sendTelegramMessage(
                data.telegram_chat_id,
                '✅ <b>Connection Successful!</b>\n\nYour Telegram account is now connected to Sequio. You\'ll receive notifications when new videos are added to your playlists.'
            );
        }

        return true;
    } catch (error) {
        console.error('Error verifying Telegram code:', error);
        throw error;
    }
}

/**
 * Disconnect Telegram from user account
 */
export async function disconnectTelegram(userId: string) {
    const { data, error } = await supabase
        .from('notification_settings')
        .update({
            telegram_enabled: false,
            telegram_chat_id: null,
            telegram_verification_code: null,
            telegram_verified_at: null
        })
        .eq('user_id', userId);

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Get Telegram connection status for user
 */
export async function getTelegramStatus(userId: string) {
    const { data, error } = await supabase
        .from('notification_settings')
        .select('telegram_enabled, telegram_verified_at, telegram_chat_id')
        .eq('user_id', userId)
        .single();

    if (error) {
        // If no settings exist, create default row
        if (error.code === 'PGRST116') {
            await supabase
                .from('notification_settings')
                .insert({ user_id: userId });
            return {
                telegram_enabled: false,
                telegram_verified_at: null,
                telegram_chat_id: null
            };
        }
        throw error;
    }

    return data;
}

/**
 * Get bot username from environment
 */
export function getTelegramBotUsername(): string {
    return import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'your_bot_username_bot';
}
