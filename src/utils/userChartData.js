// handleGymSave.js
export const handleGymSave = async ({
  type,
  supabase,
  user,
  weightEnter,
  setWeightEnter,
  setWeightHistory,
  mileEnter,
  setMileEnter,
  setMileHistory,
  goalWeight,
  setGoalWeight,
  goalMile,
  setGoalMile,
  setIsEdit,
}) => {
  if (!weightEnter && type === 'weight_progress') return;
  if (!goalWeight && type === 'weight_goal') return;
  if (!mileEnter && type === 'miles_progress') return;
  if (!goalMile && type === 'miles_goal') return;

  const today = new Date().toISOString().split('T')[0];

  // WEIGHT PROGRESS
  if (type === 'weight_progress') {
    const { data, error } = await supabase
      .from('gym')
      .select('weight_progress')
      .eq('id', user.id)
      .single();

    if (error) return console.error(error);

    const updated = [
      ...(data?.weight_progress || []),
      { date: today, weight: Number(weightEnter) },
    ];

    await supabase
      .from('gym')
      .update({ weight_progress: updated })
      .eq('id', user.id);

    setWeightHistory((p) => [
      ...p,
      { date: today, weight: Number(weightEnter) },
    ]);
    setWeightEnter('');
    setIsEdit('');
  }

  // MILES PROGRESS
  else if (type === 'miles_progress') {
    const { data, error } = await supabase
      .from('gym')
      .select('miles_progress')
      .eq('id', user.id)
      .single();

    if (error) return console.error(error);

    const updated = [
      ...(data?.miles_progress || []),
      { date: today, miles: Number(mileEnter) },
    ];

    await supabase
      .from('gym')
      .update({ miles_progress: updated })
      .eq('id', user.id);

    setMileHistory((p) => [...p, { date: today, miles: Number(mileEnter) }]);
    setMileEnter('');
    setIsEdit('');
  }

  // WEIGHT GOAL
  else if (type === 'weight_goal') {
    await supabase
      .from('gym')
      .update({ weight_goal: Number(goalWeight) })
      .eq('id', user.id);

    setGoalWeight(Number(goalWeight));
    setIsEdit('');
  }

  // MILES GOAL
  else if (type === 'miles_goal') {
    await supabase
      .from('gym')
      .update({ miles_goal: Number(goalMile) })
      .eq('id', user.id);

    setGoalMile(Number(goalMile));
    setIsEdit('');
  }
};

export const fetchGymData = async ({ supabase, userId }) => {
  const { data, error } = await supabase
    .from('gym')
    .select('weight_progress, miles_progress, weight_goal, miles_goal')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Failed to fetch gym data:', error);
    return null;
  }

  return data;
};
