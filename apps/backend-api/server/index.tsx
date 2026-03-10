import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config'; 

const app = new Hono();

app.use('*', logger());
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
);

const supabaseClient = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_ANON_KEY ?? '',
);

app.get("/", (c: any) => c.text("DUHlab API is running perfectly!"));
app.get("/make-server-e7b4487d/health", (c: any) => c.json({ status: "ok" }));

// ==========================================
// DOOR 1: CONSUMER AUTHENTICATION (The Game)
// ==========================================

app.post("/make-server-e7b4487d/consumer/signup", async (c: any) => {
  try {
    const { email, password, name } = await c.req.json();
    if (!email || !password || !name) return c.json({ error: "Missing fields" }, 400);

    const { data: existing } = await supabaseAdmin.from('users').select('*').eq('email', email).limit(1);
    if (existing && existing.length > 0) return c.json({ error: "Email already in use" }, 400);

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email, password, user_metadata: { name, role: 'consumer' }, email_confirm: true
    });

    if (error) return c.json({ error: error.message }, 400);

    const userId = data.user.id;
    const userData = { id: userId, email, name, role: 'consumer', created_at: new Date().toISOString() };

    const { error: dbError } = await supabaseAdmin.from('users').insert([userData]);
    
    if (dbError) {
      console.error("DB Insert Error:", dbError);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return c.json({ error: "Failed to setup database profile." }, 500);
    }

    await supabaseAdmin.from('user_coins').insert([{ user_id: userId, coins: 0 }]);

    return c.json({ success: true, userId, message: "Consumer account created" });
  } catch (error) {
    console.error("Signup Error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/make-server-e7b4487d/consumer/login", async (c: any) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ error: "Missing credentials" }, 400);

    const { data: userRecord } = await supabaseAdmin.from('users').select('*').eq('email', email).single();
    if (!userRecord) return c.json({ error: "Invalid credentials" }, 401);
    
    if ((userRecord as any).role !== 'consumer') {
      return c.json({ error: "This account belongs to a Business Client. Log in via the Client Portal." }, 403);
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return c.json({ error: "Invalid credentials" }, 401);

    const { data: coinsData } = await supabaseAdmin.from('user_coins').select('coins').eq('user_id', data.user.id).single();
    const coins = coinsData ? (coinsData as any).coins : 0;

    return c.json({ success: true, userId: data.user.id, accessToken: data.session.access_token, user: userRecord, coins });
  } catch (error) {
    return c.json({ error: "Failed to login" }, 500);
  }
});

// ==========================================
// DOOR 2: CLIENT AUTHENTICATION (B2B Portal)
// ==========================================

app.post("/make-server-e7b4487d/client/signup", async (c: any) => {
  try {
    const { email, password, name } = await c.req.json();
    if (!email || !password) return c.json({ error: "Missing fields" }, 400);

    const { data: existing } = await supabaseAdmin.from('users').select('*').eq('email', email).limit(1);
    if (existing && existing.length > 0) return c.json({ error: "Email already in use" }, 400);

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email, password, user_metadata: { name, role: 'client' }, email_confirm: true
    });

    if (error) return c.json({ error: error.message }, 400);

    const userId = data.user.id;
    const userData = { id: userId, email, name: name || "Enterprise User", role: 'client', created_at: new Date().toISOString() };

    const { error: dbError } = await supabaseAdmin.from('users').insert([userData]);
    
    if (dbError) {
      console.error("DB Insert Error:", dbError);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return c.json({ error: "Failed to setup database profile." }, 500);
    }

    return c.json({ success: true, userId, message: "Client account created" });
  } catch (error) {
    console.error("Signup Error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/make-server-e7b4487d/client/login", async (c: any) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ error: "Missing credentials" }, 400);

    const { data: userRecord } = await supabaseAdmin.from('users').select('*').eq('email', email).single();
    if (!userRecord) return c.json({ error: "Invalid credentials" }, 401);
    
    if ((userRecord as any).role !== 'client') {
      return c.json({ error: "Access Denied: You do not have an enterprise account." }, 403);
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return c.json({ error: "Invalid credentials" }, 401);

    return c.json({ success: true, userId: data.user.id, accessToken: data.session.access_token, user: userRecord });
  } catch (error) {
    return c.json({ error: "Failed to login" }, 500);
  }
});

app.post("/make-server-e7b4487d/client/complete-onboarding", async (c: any) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) return c.json({ error: "Unauthorized" }, 401);

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) return c.json({ error: "Invalid session" }, 401);

    const { fullName, jobTitle, companyName, industry, metrics } = await c.req.json();

    const { error: dbError } = await supabaseAdmin
      .from('users')
      .update({
        name: fullName,
        job_title: jobTitle,
        company_name: companyName,
        industry: industry,
        success_metrics: metrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (dbError) throw dbError;

    return c.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Onboarding Error:", error);
    return c.json({ error: "Failed to save profile data" }, 500);
  }
});

// ==========================================
// DASHBOARD REAL-TIME DATA & CAMPAIGNS
// ==========================================

app.get("/make-server-e7b4487d/client/dashboard-stats", async (c: any) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) return c.json({ error: "Unauthorized" }, 401);

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) return c.json({ error: "Invalid session" }, 401);

    const { count: activeCount } = await supabaseAdmin
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', user.id)
      .eq('status', 'active');

    const { data: analytics } = await supabaseAdmin
      .from('campaigns')
      .select('id, campaign_analytics(total_completions)')
      .eq('client_id', user.id);

    const totalCompletions = analytics?.reduce((acc, curr) => {
      const completions = (curr.campaign_analytics as any)?.total_completions || 0;
      return acc + completions;
    }, 0) || 0;

    return c.json({
      activeResearch: activeCount || 0,
      totalInsights: totalCompletions || 0,
      userTrustRating: 0 
    });
  } catch (error) {
    return c.json({ activeResearch: 0, totalInsights: 0, userTrustRating: 0 });
  }
});

app.get("/make-server-e7b4487d/client/campaigns", async (c: any) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) return c.json({ error: "Unauthorized" }, 401);

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) return c.json({ error: "Invalid session" }, 401);

    const { data: campaigns, error: dbError } = await supabaseAdmin
      .from('campaigns')
      .select(`
        id, 
        title, 
        status, 
        created_at,
        campaign_analytics(total_completions)
      `)
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20); // Upped the limit so they can see more surveys

    if (dbError) throw dbError;

    const formatted = (campaigns || []).map(c => ({
      id: c.id,
      name: c.title,
      status: c.status,
      responses: (c.campaign_analytics as any)?.total_completions || 0,
      date: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      completion: 0 
    }));

    return c.json(formatted);
  } catch (error) {
    return c.json([]);
  }
});

// NEW: The Insights Data Route
app.get("/make-server-e7b4487d/client/campaign-results/:id", async (c: any) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) return c.json({ error: "Unauthorized" }, 401);

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) return c.json({ error: "Invalid session" }, 401);

    const campaignId = c.req.param('id');

    // Make sure the client owns this campaign
    const { data: campaign, error: campError } = await supabaseAdmin
      .from('campaigns')
      .select('client_id, survey_schema')
      .eq('id', campaignId)
      .single();

    if (campError || !campaign) return c.json({ error: "Campaign not found" }, 404);
    if (campaign.client_id !== user.id) return c.json({ error: "Unauthorized access" }, 403);

    // Get all the raw answers from the events table
    const { data: events, error: eventsError } = await supabaseAdmin
      .from('events')
      .select('payload, created_at')
      .eq('event_type', 'survey_completed')
      .eq('reference_id', campaignId);

    if (eventsError) throw eventsError;

    return c.json({ success: true, schema: campaign.survey_schema, responses: events || [] });
  } catch (error) {
    console.error("Fetch Results Error:", error);
    return c.json({ error: "Failed to fetch insights" }, 500);
  }
});

app.post("/make-server-e7b4487d/client/campaigns", async (c: any) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) return c.json({ error: "Unauthorized" }, 401);

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) return c.json({ error: "Invalid session" }, 401);

    const { title, target_audience, survey_schema, status, budget_coins } = await c.req.json();

    if (!title) {
      return c.json({ error: "Campaign title is required" }, 400);
    }

    // 1. Insert the new campaign
    const newCampaign = {
      client_id: user.id,
      title,
      target_audience: target_audience || {},
      survey_schema: survey_schema || {},
      status: status || 'active', 
      budget_coins: budget_coins || 0,
      created_at: new Date().toISOString()
    };

    const { data: campaignData, error: dbError } = await supabaseAdmin
      .from('campaigns')
      .insert([newCampaign])
      .select('id')
      .single();

    if (dbError) throw dbError;

    // 2. Initialize the empty analytics tracker
    const { error: analyticsError } = await supabaseAdmin
      .from('campaign_analytics')
      .insert([{
        campaign_id: campaignData.id,
        total_views: 0,
        total_completions: 0,
        results_tally: {}
      }]);

    if (analyticsError) console.error("Failed to init analytics:", analyticsError);

    return c.json({ success: true, campaignId: campaignData.id, message: "Survey created successfully" });
  } catch (error) {
    console.error("Create Campaign Error:", error);
    return c.json({ error: "Failed to create survey campaign" }, 500);
  }
});

// ==========================================
// GAMEPLAY & CORE LOGIC
// ==========================================

app.get("/make-server-e7b4487d/consumer/campaigns", async (c: any) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) return c.json({ error: "Unauthorized" }, 401);

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) return c.json({ error: "Invalid session" }, 401);

    const { data: campaigns, error: dbError } = await supabaseAdmin
      .from('campaigns')
      .select('id, title, budget_coins, survey_schema, created_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (dbError) throw dbError;

    return c.json({ success: true, campaigns: campaigns || [] });
  } catch (error) {
    console.error("Fetch Consumer Campaigns Error:", error);
    return c.json({ error: "Failed to fetch campaigns" }, 500);
  }
});

app.post("/make-server-e7b4487d/consumer/submit-survey", async (c: any) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) return c.json({ error: "Unauthorized" }, 401);

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) return c.json({ error: "Invalid session" }, 401);

    const { campaignId, answers, rewardCoins } = await c.req.json();
    if (!campaignId) return c.json({ error: "Missing campaign ID" }, 400);

    // 1. Log the consumer's answers into the events table
    await supabaseAdmin.from('events').insert([{
      user_id: user.id,
      event_type: 'survey_completed',
      reference_id: campaignId,
      payload: { answers }
    }]);

    // 2. Award coins to the consumer
    const { data: coinData } = await supabaseAdmin.from('user_coins').select('coins').eq('user_id', user.id).single();
    const currentCoins = coinData ? (coinData as any).coins : 0;
    
    const coinsToAward = rewardCoins || 100; 
    const newBalance = currentCoins + coinsToAward;

    await supabaseAdmin.from('user_coins').update({ coins: newBalance }).eq('user_id', user.id);

    // 3. Update the B2B Client's Analytics (increment total completions)
    const { data: analyticsData } = await supabaseAdmin.from('campaign_analytics').select('*').eq('campaign_id', campaignId).single();
    if (analyticsData) {
      const currentCompletions = (analyticsData as any).total_completions || 0;
      await supabaseAdmin.from('campaign_analytics')
        .update({ total_completions: currentCompletions + 1 })
        .eq('campaign_id', campaignId);
    }

    return c.json({ success: true, newBalance, coinsEarned: coinsToAward, message: "Survey completed and coins awarded!" });
  } catch (error) {
    console.error("Submit Survey Error:", error);
    return c.json({ error: "Failed to submit survey" }, 500);
  }
});

app.post("/make-server-e7b4487d/guest-login", async (c: any) => {
  try {
    const guestEmail = "guest@duhlab.com";
    const guestPassword = "GuestDemo2024!";
    
    const { data: existing } = await supabaseAdmin.from('users').select('*').eq('email', guestEmail).limit(1);
    let userId: string;

    if (!existing || existing.length === 0) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({ email: guestEmail, password: guestPassword, user_metadata: { role: 'consumer' }, email_confirm: true });
      if (error) return c.json({ error: "Failed" }, 500);
      userId = data.user.id;
      const userData = { id: userId, email: guestEmail, name: "Guest", role: 'consumer', created_at: new Date().toISOString() };
      
      await supabaseAdmin.from('users').insert([userData]);
      await supabaseAdmin.from('user_coins').insert([{ user_id: userId, coins: 0 }]);
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email: guestEmail, password: guestPassword });
    if (error) return c.json({ error: "Failed to login as guest" }, 500);

    const { data: userRecord } = await supabaseAdmin.from('users').select('*').eq('id', data.user.id).single();
    const { data: coinsData } = await supabaseAdmin.from('user_coins').select('coins').eq('user_id', data.user.id).single();
    
    return c.json({ success: true, userId: data.user.id, accessToken: data.session.access_token, user: userRecord, coins: coinsData ? (coinsData as any).coins : 0 });
  } catch (error) {
    return c.json({ error: "Failed" }, 500);
  }
});

app.get("/make-server-e7b4487d/session", async (c: any) => {
  const token = c.req.header('Authorization')?.split(' ')[1];
  if (!token) return c.json({ error: "No token" }, 401);
  const { data: { user }, error } = await supabaseClient.auth.getUser(token);
  if (error || !user) return c.json({ error: "Invalid session" }, 401);
  
  const { data: userData } = await supabaseAdmin.from('users').select('*').eq('id', user.id).single();
  
  return c.json({ success: true, userId: user.id, user: userData });
});

const port = 3001;
console.log(`DUHlab Backend is running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });