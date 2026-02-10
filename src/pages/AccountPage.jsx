import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AccountPage() {
  const [data, setData] = useState('');
  const [history, setHistory] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: userData, error } = await supabase
        .from('gym')
        .select('*')
        .eq('user_id', user.id)
        .order('week', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching user data:', error.message);
        return;
      }

      const { history: userHistory, historyError } = await supabase
        .from('gym_history')
        .select('*')
        .eq('user_id', user.id)
        .order('week', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (historyError) {
        console.error('Error fetching user data:', error.message);
        return;
      }

      setData(userData);
      setHistory(userHistory);
    };

    fetchUserData();
  }, []);

  console.log('User Data', data);
  console.log('History', history);
  return (
    <div className="landing-page">
      <h1>Account</h1>

      {!data.selected_plan && (
        <div>
          <h1>No Workout plans found</h1>
        </div>
      )}

      {(!history || history.length === 0) && (
        <div>
          <h1>No history found</h1>
          <p>Log your first week to get started 💪</p>
        </div>
      )}
    </div>
  );
}
