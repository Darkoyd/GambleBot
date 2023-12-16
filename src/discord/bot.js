import express from 'express'

import { InteractionType, InteractionResponseType } from 'discord-interactions'
import { getRandomEmoji } from './utils.js'

const router = express.Router()


router.get('/health', async (req, res) => {
    return res.send('Okay!')
})

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
router.post('/interactions', async function (req, res) {
    // Interaction type and data
    const { type, id, data } = req.body
    console.log(req.body)

    /**
   * Handle verification requests
   */
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG })
    }

    /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data

        // "test" command
        if (name === 'test') {
            // Send a message into the channel where command was triggered from
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    // Fetches a random emoji to send from a helper function
                    content: 'hello world ' + getRandomEmoji(),
                },
            })
        }
    }
})

export default router