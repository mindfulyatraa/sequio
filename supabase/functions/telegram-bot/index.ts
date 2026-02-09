// Supabase Edge Function: telegram-bot
// Handles Telegram Bot webhook for receiving messages and sending responses

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

/**
 * Generate 6-character verification code
 */
function generateCode(): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return code
}

/**
 * Send message via Telegram Bot API
 */
async function sendTelegramMessage(chatId: string, text: string) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'HTML'
        })
    })

    return await response.json()
}

/**
 * Handle /start command
 */
async function handleStartCommand(chatId: string) {
    // Generate verification code
    const code = generateCode()

    console.log(`Generated code for chat ${chatId}: ${code}`)

    // Find or create notification_settings entry for this chat_id
    const { data: existingSettings, error: fetchError } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('telegram_chat_id', chatId)
        .maybeSingle()

    if (fetchError) {
        console.error('Error fetching settings:', fetchError)
    }

    if (existingSettings && existingSettings.telegram_enabled) {
        // Already connected
        await sendTelegramMessage(
            chatId,
            '✅ <b>Already Connected!</b>\n\nYour Telegram is already linked to your Sequio account. You\'ll receive notifications when new videos are added to your playlists.'
        )
        return
    }

    // Update or insert with new verification code
    const { error: upsertError } = await supabase
        .from('notification_settings')
        .upsert({
            telegram_chat_id: chatId,
            telegram_verification_code: code,
            telegram_enabled: false,
            telegram_verified_at: null,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'telegram_chat_id',
            ignoreDuplicates: false
        })

    if (upsertError) {
        console.error('Error saving verification code:', upsertError)
        await sendTelegramMessage(
            chatId,
            '❌ <b>Error</b>\n\nSorry, something went wrong. Please try again later.'
        )
        return
    }

    // Send verification code to user
    await sendTelegramMessage(
        chatId,
        `🔐 <b>Verification Code</b>\n\nYour code is: <code>${code}</code>\n\n📋 Copy this code and paste it on the Sequio website (Settings → Telegram) to connect your account.\n\n⏰ This code will expire once used or if you request a new one.`
    )
}

/**
 * Handle other messages (future: reminders, video queries)
 */
async function handleMessage(chatId: string, text: string) {
    // For non-command messages, check if user is connected
    const { data: settings } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('telegram_chat_id', chatId)
        .eq('telegram_enabled', true)
        .maybeSingle()

    if (!settings) {
        await sendTelegramMessage(
            chatId,
            '⚠️ <b>Not Connected</b>\n\nPlease send /start to connect your Telegram account first.'
        )
        return
    }

    // Future: Handle video reminders, queries, etc.
    await sendTelegramMessage(
        chatId,
        '👋 <b>Hi there!</b>\n\nYour Telegram is connected. You\'ll receive notifications when new videos are added to your playlists.\n\n🚀 More features coming soon!'
    )
}

serve(async (req) => {
    try {
        // Handle Telegram webhook
        const update = await req.json()

        console.log('Received update:', JSON.stringify(update))

        // Extract message
        const message = update.message
        if (!message) {
            return new Response(JSON.stringify({ ok: true }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const chatId = message.chat.id.toString()
        const text = message.text || ''

        // Handle commands
        if (text.startsWith('/start')) {
            await handleStartCommand(chatId)
        } else {
            await handleMessage(chatId, text)
        }

        return new Response(JSON.stringify({ ok: true }), {
            headers: { 'Content-Type': 'application/json' }
        })

    } catch (error) {
        console.error('Error handling webhook:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
})
