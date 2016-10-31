User.delete_all
Mission.delete_all


user_one = User.create ( { 
  email: 'Skeletor@gmail.com',
  password:'skeletor',
  password_confirmation: 'skeletor',
  user_type: 'admin' 
  })

user_two = User.create( { 
  email:'BeastGoldMan@gmail.com', 
  password:'barmitzvah', 
  password_confirmation:'barmitzvah',
  user_type:'user'
  })

user_three = User.create( { 
  email:'EvilLynn@gmail.com', 
  password:'evilisgr8', 
  password_confirmation:'evilisgr8',
  user_type:'user'
  })

user_four = User.create( { 
  email:'TrapJaw@gmail.com', 
  password:'clamps', 
  password_confirmation:'clamps',
  user_type:'user'
  })

user_five = User.create( { 
  email:'MossMan@gmail.com', 
  password:'sexPanther', 
  password_confirmation:'sexPanther',
  user_type:'user'
  })


mission_one = Mission.create( {
  name:'Attack',
  objective:'Attack the heroic fool He-Man and his pathetic friends. Then Eternia will be mine. The all powerful Skeletor.',
  user_id: user_two.id
  })

mission_two = Mission.create( {
  name:'Kidnap',
  objective:'Kidnap the muscle bound bowl cut and hold him till Eternia is mine. The master of evil. Skeletor.',
  user_id: user_two.id
  })

mission_three = Mission.create( {
  name:'The Prince Adam Polaroids',
  objective:'Black mail the King with those pictures of prince Adam from that time. Yeah, THAT time. Then Eternia will be mine. The prince of problems. Skeletor.',
  user_id: user_three.id
  })

mission_four = Mission.create( {
  name:'Bludgeon',
  objective:'Hit thos interfering heroes with lead pipes until they submit to me. Their rightful ruler. The duke of the dastardly. Skeletor!',
  user_id: user_four.id
  })

mission_five = Mission.create( {
  name:'Stealth',
  objective:'Sneak into the castle and put a mars bar in Prince Adams bed. The shame will force him to give up the throne to me. The unstoppable Skeletor. ',
  user_id: user_five.id
  })

