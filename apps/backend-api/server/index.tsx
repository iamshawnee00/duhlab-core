import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Initialize Supabase client with anon key for auth operations
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

// Health check endpoint
app.get("/make-server-e7b4487d/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign Up endpoint
app.post("/make-server-e7b4487d/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    // Check if user already exists in Supabase users table
    const { data: existingUsers, error: checkError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means table doesn't exist, which is ok
      console.log(`Error checking existing users: ${checkError.message}`);
    }

    if (existingUsers && existingUsers.length > 0) {
      return c.json({ error: "User with this email already exists" }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Sign up error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    const userId = data.user.id;
    const createdAt = new Date().toISOString();

    const userData = {
      id: userId,
      email,
      name,
      created_at: createdAt,
    };

    // Save to Supabase users table
    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert([userData]);

    if (insertError) {
      console.log(`Error inserting user into table: ${insertError.message}`);
      // Continue anyway - we'll use KV store as fallback
    }

    // Initialize user data in KV store (as backup)
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      name,
      createdAt,
    });

    // Initialize user coins in database
    const { error: coinsInsertError } = await supabaseAdmin
      .from('user_coins')
      .insert([{ user_id: userId, coins: 0 }]);

    if (coinsInsertError) {
      console.log(`Error inserting user coins: ${coinsInsertError.message}`);
    }

    // Initialize user coins in KV store (as backup)
    await kv.set(`coins:${userId}`, 0);

    // Initialize user rewards in KV store
    await kv.set(`rewards:${userId}`, {
      totalCoins: 0,
      surveysCompleted: 0,
      insights: [],
    });

    console.log(`User created successfully: ${userId}`);
    return c.json({ 
      success: true, 
      userId,
      message: "Account created successfully" 
    });

  } catch (error) {
    console.log(`Sign up error: ${error}`);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

// Login endpoint
app.post("/make-server-e7b4487d/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Check if user exists in Supabase users table
    const { data: existingUsers, error: checkError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (checkError && checkError.code !== 'PGRST116') {
      console.log(`Error checking users table: ${checkError.message}`);
    }

    if (!existingUsers || existingUsers.length === 0) {
      console.log(`Login attempt for non-existent user: ${email}`);
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Login error for ${email}: ${error.message}`);
      return c.json({ error: "Invalid email or password" }, 401);
    }

    const userId = data.user.id;
    const accessToken = data.session.access_token;

    // Get user data from Supabase table
    const { data: userDataFromDB } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    // Fallback to KV store if table query fails
    const userData = userDataFromDB || await kv.get(`user:${userId}`);

    // Get coins from database
    const { data: coinsData } = await supabaseAdmin
      .from('user_coins')
      .select('coins')
      .eq('user_id', userId)
      .single();

    // Fallback to KV store for coins
    const coins = coinsData?.coins ?? await kv.get(`coins:${userId}`) ?? 0;

    console.log(`User logged in successfully: ${userId}`);
    return c.json({ 
      success: true,
      userId,
      accessToken,
      user: userData,
      coins
    });

  } catch (error) {
    console.log(`Login error: ${error}`);
    return c.json({ error: "Failed to login" }, 500);
  }
});

// Guest Login endpoint
app.post("/make-server-e7b4487d/guest-login", async (c) => {
  try {
    const guestEmail = "guest@duhlab.com";
    const guestPassword = "GuestDemo2024!";
    const guestName = "Guest User";

    // Check if guest account exists
    const { data: existingUsers, error: checkError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', guestEmail)
      .limit(1);

    if (checkError && checkError.code !== 'PGRST116') {
      console.log(`Error checking guest user: ${checkError.message}`);
    }

    let userId: string;

    // Create guest account if it doesn't exist
    if (!existingUsers || existingUsers.length === 0) {
      console.log('Creating guest account...');
      
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: guestEmail,
        password: guestPassword,
        user_metadata: { name: guestName },
        email_confirm: true
      });

      if (error) {
        console.log(`Guest account creation error: ${error.message}`);
        return c.json({ error: "Failed to create guest account" }, 500);
      }

      userId = data.user.id;
      const createdAt = new Date().toISOString();

      const userData = {
        id: userId,
        email: guestEmail,
        name: guestName,
        created_at: createdAt,
      };

      // Save to database
      await supabaseAdmin.from('users').insert([userData]);
      await supabaseAdmin.from('user_coins').insert([{ user_id: userId, coins: 0 }]);

      // Save to KV store
      await kv.set(`user:${userId}`, { id: userId, email: guestEmail, name: guestName, createdAt });
      await kv.set(`coins:${userId}`, 0);
      await kv.set(`rewards:${userId}`, { totalCoins: 0, surveysCompleted: 0, insights: [] });

      console.log(`Guest account created: ${userId}`);
    }

    // Sign in as guest
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: guestEmail,
      password: guestPassword,
    });

    if (error) {
      console.log(`Guest login error: ${error.message}`);
      return c.json({ error: "Failed to login as guest" }, 500);
    }

    userId = data.user.id;
    const accessToken = data.session.access_token;

    // Get user data
    const { data: userDataFromDB } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    const userData = userDataFromDB || await kv.get(`user:${userId}`);

    // Get coins
    const { data: coinsData } = await supabaseAdmin
      .from('user_coins')
      .select('coins')
      .eq('user_id', userId)
      .single();

    const coins = coinsData?.coins ?? await kv.get(`coins:${userId}`) ?? 0;

    console.log(`Guest logged in successfully: ${userId}`);
    return c.json({ 
      success: true,
      userId,
      accessToken,
      user: userData,
      coins
    });

  } catch (error) {
    console.log(`Guest login error: ${error}`);
    return c.json({ error: "Failed to login as guest" }, 500);
  }
});

// Get current session
app.get("/make-server-e7b4487d/session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // Use the client (anon key) to validate the user's JWT token
    const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Invalid session" }, 401);
    }

    const userId = user.id;
    const userData = await kv.get(`user:${userId}`);
    const coins = await kv.get(`coins:${userId}`) || 0;

    return c.json({ 
      success: true,
      userId,
      user: userData,
      coins
    });

  } catch (error) {
    console.log(`Session check error: ${error}`);
    return c.json({ error: "Failed to check session" }, 500);
  }
});

// Submit survey
app.post("/make-server-e7b4487d/surveys", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.log('Survey submission - no access token provided');
      return c.json({ error: "Unauthorized - no access token" }, 401);
    }

    console.log('Survey submission - validating access token');

    // Use the client (anon key) to validate the user's JWT token
    const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Survey submission - auth error: ${error?.message || 'No user'}`);
      return c.json({ error: "Unauthorized - invalid token", details: error?.message }, 401);
    }

    const userId = user.id;
    const { district, answers } = await c.req.json();

    console.log(`Survey submission - user ${userId}, district: ${district}`);

    if (!district || !answers) {
      return c.json({ error: "District and answers are required" }, 400);
    }

    // Generate survey ID
    const surveyId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const completedAt = new Date().toISOString();
    
    // Calculate coins earned (e.g., 50 coins per survey)
    const coinsEarned = 50;

    // Save survey response to database
    const { error: surveyInsertError } = await supabaseAdmin
      .from('surveys')
      .insert([{
        id: surveyId,
        user_id: userId,
        district,
        answers,
        completed_at: completedAt,
        coins_earned: coinsEarned,
      }]);

    if (surveyInsertError) {
      console.log(`Error inserting survey into table: ${surveyInsertError.message}`);
    }

    // Save survey response to KV store (as backup)
    await kv.set(`survey:${userId}:${surveyId}`, {
      id: surveyId,
      userId,
      district,
      answers,
      completedAt,
      coinsEarned,
    });

    // Get current coins from database
    const { data: coinsData } = await supabaseAdmin
      .from('user_coins')
      .select('coins')
      .eq('user_id', userId)
      .single();

    const currentCoins = coinsData?.coins ?? await kv.get(`coins:${userId}`) ?? 0;
    const newCoins = currentCoins + coinsEarned;

    console.log(`Current coins: ${currentCoins}, new coins: ${newCoins}`);

    // Update user coins in database
    const { error: updateCoinsError } = await supabaseAdmin
      .from('user_coins')
      .update({ coins: newCoins })
      .eq('user_id', userId);

    if (updateCoinsError) {
      console.log(`Error updating user coins in table: ${updateCoinsError.message}`);
    }

    // Update user coins in KV store (as backup)
    await kv.set(`coins:${userId}`, newCoins);

    // Update user rewards in KV store
    const rewards = await kv.get(`rewards:${userId}`) || {
      totalCoins: 0,
      surveysCompleted: 0,
      insights: [],
    };

    rewards.totalCoins = newCoins;
    rewards.surveysCompleted = (rewards.surveysCompleted || 0) + 1;
    
    // Add insight based on district
    const insight = {
      district,
      completedAt,
    };
    rewards.insights = [...(rewards.insights || []), insight];

    await kv.set(`rewards:${userId}`, rewards);

    console.log(`Survey submitted by user ${userId}: ${surveyId}, earned ${coinsEarned} coins`);
    return c.json({ 
      success: true,
      surveyId,
      coinsEarned,
      totalCoins: newCoins
    });

  } catch (error) {
    console.log(`Survey submission error: ${error}`);
    return c.json({ error: "Failed to submit survey" }, 500);
  }
});

// Get user surveys
app.get("/make-server-e7b4487d/surveys", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Use the client (anon key) to validate the user's JWT token
    const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = user.id;
    
    // Get all surveys for this user
    const surveys = await kv.getByPrefix(`survey:${userId}:`);

    return c.json({ 
      success: true,
      surveys
    });

  } catch (error) {
    console.log(`Get surveys error: ${error}`);
    return c.json({ error: "Failed to get surveys" }, 500);
  }
});

// Get user rewards
app.get("/make-server-e7b4487d/rewards", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Use the client (anon key) to validate the user's JWT token
    const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = user.id;
    
    // Get user rewards and coins
    const rewards = await kv.get(`rewards:${userId}`) || {
      totalCoins: 0,
      surveysCompleted: 0,
      insights: [],
    };
    const coins = await kv.get(`coins:${userId}`) || 0;

    return c.json({ 
      success: true,
      coins,
      rewards
    });

  } catch (error) {
    console.log(`Get rewards error: ${error}`);
    return c.json({ error: "Failed to get rewards" }, 500);
  }
});

// Spend coins (for shop purchases)
app.post("/make-server-e7b4487d/spend-coins", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Use the client (anon key) to validate the user's JWT token
    const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = user.id;
    const { amount, itemName } = await c.req.json();

    if (!amount || amount <= 0) {
      return c.json({ error: "Invalid amount" }, 400);
    }

    // Get current coins from database
    const { data: coinsData } = await supabaseAdmin
      .from('user_coins')
      .select('coins')
      .eq('user_id', userId)
      .single();

    const currentCoins = coinsData?.coins ?? await kv.get(`coins:${userId}`) ?? 0;

    if (currentCoins < amount) {
      return c.json({ error: "Insufficient coins" }, 400);
    }

    const newCoins = currentCoins - amount;

    // Update coins in database
    const { error: updateCoinsError } = await supabaseAdmin
      .from('user_coins')
      .update({ coins: newCoins })
      .eq('user_id', userId);

    if (updateCoinsError) {
      console.log(`Error updating user coins in table: ${updateCoinsError.message}`);
    }

    // Update coins in KV store (as backup)
    await kv.set(`coins:${userId}`, newCoins);

    // Log transaction to database
    const transactionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const { error: transactionInsertError } = await supabaseAdmin
      .from('transactions')
      .insert([{
        id: transactionId,
        user_id: userId,
        type: 'spend',
        amount: -amount,
        item_name: itemName,
        timestamp,
        balance_after: newCoins,
      }]);

    if (transactionInsertError) {
      console.log(`Error inserting transaction into table: ${transactionInsertError.message}`);
    }

    // Log transaction to KV store (as backup)
    await kv.set(`transaction:${userId}:${transactionId}`, {
      id: transactionId,
      userId,
      type: 'spend',
      amount: -amount,
      itemName,
      timestamp,
      balanceAfter: newCoins,
    });

    console.log(`User ${userId} spent ${amount} coins on ${itemName}`);
    return c.json({ 
      success: true,
      newBalance: newCoins
    });

  } catch (error) {
    console.log(`Spend coins error: ${error}`);
    return c.json({ error: "Failed to spend coins" }, 500);
  }
});

// Get onboarding status
app.get("/make-server-e7b4487d/user/onboarding-status", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = user.id;
    const onboardingComplete = await kv.get(`onboarding:${userId}`) || false;

    return c.json({ 
      completed: onboardingComplete
    });

  } catch (error) {
    console.log(`Get onboarding status error: ${error}`);
    return c.json({ error: "Failed to get onboarding status" }, 500);
  }
});

// Mark onboarding as complete
app.post("/make-server-e7b4487d/user/complete-onboarding", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = user.id;
    await kv.set(`onboarding:${userId}`, true);

    console.log(`User ${userId} completed onboarding`);
    return c.json({ 
      success: true
    });

  } catch (error) {
    console.log(`Complete onboarding error: ${error}`);
    return c.json({ error: "Failed to complete onboarding" }, 500);
  }
});

// Helper function to determine archetype based on survey count
function getArchetypeForSurveyCount(surveyCount: number): string {
  if (surveyCount <= 2) return "The Explorer";
  if (surveyCount <= 5) return "The Curious";
  if (surveyCount <= 10) return "The Analyst";
  if (surveyCount <= 20) return "The Strategist";
  return "The Visionary";
}

// Helper function to get achievement definitions
function getAchievementDefinitions() {
  return [
    {
      id: 'first_survey',
      title: 'First Steps',
      description: 'Complete your first survey',
      icon: '🎯',
      requirement: 1,
      color: '#1A45FF',
    },
    {
      id: 'survey_streak_3',
      title: 'Getting Started',
      description: 'Complete 3 surveys',
      icon: '🔥',
      requirement: 3,
      color: '#FFC045',
    },
    {
      id: 'explorer',
      title: 'Explorer',
      description: 'Complete 5 surveys',
      icon: '🧭',
      requirement: 5,
      color: '#00D2D3',
    },
    {
      id: 'dedicated',
      title: 'Dedicated',
      description: 'Complete 10 surveys',
      icon: '⭐',
      requirement: 10,
      color: '#1A45FF',
    },
    {
      id: 'expert',
      title: 'Expert',
      description: 'Complete 25 surveys',
      icon: '🏆',
      requirement: 25,
      color: '#FFC045',
    },
    {
      id: 'master',
      title: 'Master',
      description: 'Complete 50 surveys',
      icon: '👑',
      requirement: 50,
      color: '#FF4757',
    },
  ];
}

// Get user progress (surveys, archetype evolution, achievements)
app.get("/make-server-e7b4487d/user/progress", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = user.id;

    // Get survey count
    const rewards = await kv.get(`rewards:${userId}`) || {
      totalCoins: 0,
      surveysCompleted: 0,
      insights: [],
    };
    
    const totalSurveys = rewards.surveysCompleted || 0;

    // Build archetype evolution history
    const archetypeHistory = [];
    const milestones = [0, 3, 6, 11, 21];
    
    for (let i = 0; i < milestones.length; i++) {
      const milestone = milestones[i];
      if (totalSurveys >= milestone) {
        const archetype = getArchetypeForSurveyCount(milestone);
        // Estimate date based on when they might have reached this milestone
        const daysAgo = (totalSurveys - milestone) * 1; // 1 day per survey difference
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        
        archetypeHistory.push({
          date: date.toISOString(),
          archetype,
          surveysCompleted: milestone,
        });
      }
    }

    // Get or initialize achievements
    const savedAchievements = await kv.get(`achievements:${userId}`) || [];
    const achievementDefs = getAchievementDefinitions();
    
    const achievements = achievementDefs.map(def => {
      const saved = savedAchievements.find((a: any) => a.id === def.id);
      const unlocked = totalSurveys >= def.requirement;
      
      return {
        ...def,
        progress: Math.min(totalSurveys, def.requirement),
        unlocked: unlocked,
        unlockedDate: saved?.unlockedDate || (unlocked ? new Date().toISOString() : undefined),
      };
    });

    // Save updated achievements
    await kv.set(`achievements:${userId}`, achievements.filter(a => a.unlocked));

    // Check for newly unlocked achievements (unlocked since last check)
    const lastCheckKey = `achievements_last_check:${userId}`;
    const lastCheckCount = await kv.get(lastCheckKey) || 0;
    const newlyUnlocked = achievements
      .filter(a => a.unlocked && a.requirement > lastCheckCount)
      .map(a => a.id);
    
    await kv.set(lastCheckKey, totalSurveys);

    console.log(`User ${userId} progress: ${totalSurveys} surveys, ${achievements.filter(a => a.unlocked).length} achievements`);
    return c.json({ 
      totalSurveys,
      archetypeHistory,
      achievements,
      newlyUnlocked,
    });

  } catch (error) {
    console.log(`Get user progress error: ${error}`);
    return c.json({ error: "Failed to get user progress" }, 500);
  }
});

Deno.serve(app.fetch);