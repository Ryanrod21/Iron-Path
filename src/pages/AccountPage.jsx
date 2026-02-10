import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Dumbbell, Zap, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './page.css'
import Button from '../components/button';

export default function AccountPage() {
  const [data, setData] = useState('');
  const [history, setHistory] = useState([]);
  const [userName, setUserName] = useState('')
  const [expandedIndex, setExpandedIndex] = useState(null);


  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

        if (user.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
      }

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

      const { data: userHistory, error: historyError } = await supabase
        .from('gym_history')
        .select('*')
        .eq('user_id', user.id)
        .order('week', { ascending: false })

      if (historyError) {
        console.error('Error fetching user data:', error.message);
        return;
      }


     
 

      setData(userData);
      setHistory(userHistory || []);
    };

    fetchUserData();
  }, []);

  const handleToggle = (index) => {
  setExpandedIndex(prev =>
    prev === index ? null : index
  );
};


  const plan_option = data?.plans?.[0]?.plans || []


  const plan = data.selected_plan

  const categoryIcons = {
      'Strength Builder': Dumbbell,
      'Endurance Elite': Zap,
      'Athletic Performance': Trophy,
    };

  const CategoryIcon = categoryIcons[plan?.category];
  
  const pastWorkout = history.selected_plan




  console.log("history", history)
  console.log(data)

  return (
    <div className="landing-page">
      <h1>Hello {userName}</h1>

{plan_option?.length > 0 && (
  <div
    className="big-plan-card"
  >
    <h1>Your Workout Plans Are Ready</h1>

    <div className="plan-summaries">
      {plan_option.map((plan, index) => {
        const CategoryIcon = categoryIcons[plan.category];

        return (
          <div key={index} className="single-plan-summary">
          <div className='user-plan-head'>
              <h2>{plan.category}</h2>
            </div>
            <div className="user-plan-header">
              <div className='icon-small-div picked'>
              {CategoryIcon && <CategoryIcon className="icon-small" />}
              </div>

            <p style={{ color: 'white', textAlign: 'start' }}>
              <strong>Summary:</strong> {plan.plan_summary}
            </p>
            </div>
          </div>
        );
      })}
    </div>
    <Button label={'Go See Plans!'} onClick={() => navigate('/results')} />
  </div>
)}


      {data.selected_plan && (
        <div className='big-plan-card'>
          <h1>Your current plan</h1>
          <div className='plan-summaires'>
        <div className= "single-plan-summary">
          <div className='user-plan-head'>
          <h2>Week {data.week}</h2>
                  <h2>{plan.category}</h2>
                  <p style={{ color: 'white' }}>
                    <strong>Summary:</strong> {plan.plan_summary}
                  </p>

                  </div>
              <div className="user-plan-header">
                <div className='icon-small-div picked '>
                  <CategoryIcon className="icon-small" />
                </div>

              
                <div className="user-plan-title">               
                    <div className="plan-expanded">
                      <ul className="custom-list">
                        {plan.expect.map((ex, i) => (
                          <li key={i}>
                            <CategoryIcon className="icon-bullet" />
                            <span style={{ color: 'white' }}>{ex}</span>
                          </li>
                        ))}
                      </ul>
                  </div>
                    </div>
                </div>
              </div>
            </div>
    <Button label={'Go To Your Plan!'} onClick={() => navigate('/selected-workout')} />

            </div>
      )}

      {history.length > 0 && (
         <div className= "big-plan-card" >
        <h1>Your Past workouts</h1>
        <div className="plan-summaries">
        {history.map((item, index) => {
        const plan = item.selected_plan;
        const CategoryIcon = categoryIcons[item.selected_plan.category];
        return (
          
          <div className={`single-plan-summary-history ${expandedIndex === index ? 'expanded-content' : ''}`} key={index}
            onClick={() => handleToggle(index)}
          >
            <div className="user-plan-head">
              <h2>Week {item.week} - {plan.category}</h2>
              <p style={{ color: 'white' }}>
                <strong>Summary:</strong> {plan.plan_summary}
              </p>
            </div>

          {expandedIndex === index && (

            <div className="user-plan-header">
              <div className="icon-small-div picked">
                <CategoryIcon className="icon-small" />
              </div>

              <div className="user-plan-title">
                <div className="plan-expanded">
                  {plan.expect && plan.expect.length > 0 && (
                    <ul className="custom-list">
                      {plan.expect.map((ex, i) => (
                        <li key={i}>
                          <CategoryIcon className="icon-bullet" />
                          <span style={{ color: 'white' }}>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}



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
