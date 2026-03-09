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
// DASHBOARD REAL-TIME DATA
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
      .limit(5);

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

// ==========================================
// GAMEPLAY & CORE LOGIC
// ==========================================

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

// Start the Node.js Server
const port = 3001;
console.log(`DUHlab Backend is running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });