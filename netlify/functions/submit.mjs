// Netlify Function — forwards alliance applications to Discord webhook
// DISCORD_WEBHOOK_URL must be set in Netlify environment variables

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const webhookUrl = Netlify.env.get('DISCORD_WEBHOOK_URL');
  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL is not set');
    return Response.json({ error: 'Webhook not configured on server' }, { status: 500 });
  }

  let data;
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const field = (name, value, inline = false) => ({
    name,
    value: String(value || 'Not provided').substring(0, 1024),
    inline,
  });

  const embed = {
    title: '📋 New CAN Alliance Application',
    color: 0xc8102e,
    fields: [
      field('Server Name', data.serverName, true),
      field('Server Owner', data.serverOwner, true),
      field('Member Count', data.members, true),
      field('Server Invite', data.invite),
      field('Staff Team Size', data.staffTeam, true),
      field('SHR Team Size', data.shrTeam, true),
      field('Other Ownership', data.otherOwnership),
      field('Why Join CAN?', data.whyJoin),
      field('Server Age', data.serverAge, true),
      field('Gets Full Often?', data.getsFull, true),
      field('Playerbase Consistency', data.playerbaseConsistency),
      field('Staff Rating (1–10)', data.staffRating, true),
      field('Growth Potential (1–10)', data.growthPotential, true),
      field('Weekly Discord Growth', data.weeklyGrowth, true),
      field('Anything Else', data.anythingElse),
    ],
    timestamp: new Date().toISOString(),
    footer: { text: 'CAN Alliance Application System' },
  };

  try {
    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!discordRes.ok) {
      const text = await discordRes.text();
      throw new Error(`Discord responded with ${discordRes.status}: ${text}`);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Webhook send failed:', err);
    return Response.json({ error: 'Failed to send application to Discord' }, { status: 500 });
  }
};

export const config = {
  path: '/api/submit',
  method: 'POST',
};
