import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth token from header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get current month/year
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Fetch entitlements
    const { data: entitlements, error: entitlementsError } = await supabase
      .from('entitlements')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', month)
      .eq('year', year)
      .maybeSingle();

    if (entitlementsError) {
      console.error('Entitlements error:', entitlementsError);
    }

    // Fetch transactions (last 6 months for analytics)
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .limit(50);

    if (transactionsError) {
      console.error('Transactions error:', transactionsError);
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Profile error:', profileError);
    }

    // Fetch household members
    const { data: householdMembers, error: householdError } = await supabase
      .from('household_members')
      .select('*')
      .eq('user_id', user.id);

    if (householdError) {
      console.error('Household members error:', householdError);
    }

    // Fetch historical entitlements for analytics (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const { data: historicalEntitlements, error: histError } = await supabase
      .from('entitlements')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('year', { ascending: true })
      .order('month', { ascending: true });

    if (histError) {
      console.error('Historical entitlements error:', histError);
    }

    return new Response(
      JSON.stringify({
        entitlements: entitlements || {
          rice_total: 25,
          rice_used: 0,
          wheat_total: 20,
          wheat_used: 0,
          sugar_total: 5,
          sugar_used: 0,
          month,
          year
        },
        transactions: transactions || [],
        profile: profile || {
          name: user.email,
          aadhaar: '****',
          phone: '****',
          ration_card_number: '0000000000000000',
          card_type: 'APL',
          issue_date: new Date().toISOString()
        },
        householdMembers: householdMembers || [],
        historicalEntitlements: historicalEntitlements || []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
