
admin = Admin.create ( { 
  email: 'Skeletor@gmail.com',
  password:'skeletor',
  password_confirmation: 'password_confirmation' 
  })

user_one = User.create( { 
  email:'Beast_GoldMan@snake_Mountain.com', 
  password:'barmitzvah', 
  password_confirmation:'barmitzvah'
  })

user_two = User.create( { 
  email:'Evil_Lynn@snake_Mountain.com', 
  password:'evilisgr8', 
  password_confirmation:'evilisgr8'
  })

user_three = User.create( { 
  email:'Trap_jaw@snake_Mountain.com', 
  password:'clamps', 
  password_confirmation:'clamps'
  })

user_four = User.create( { 
  email:'Moss_Man@snake_Mountain.com', 
  password:'sexPanther', 
  password_confirmation:'sexPanther'
  })


mission_one = Mission.create( {
  name:'Attack',
  objective:'Attack the heroic fool He-Man and his pathetic friends. Then Eternia will be mine. The all powerful Skeletor.',
  user_id: user_one.id,
  admin_id: 1
  })

mission_two = Mission.create( {
  name:'Kidnap',
  objective:'Kidnap the muscle bound bowl cut and hold him till Eternia is mine. The master of evil. Skeletor.',
  user_id: user_two.id,
  admin_id: 1
  })

mission_three = Mission.create( {
  name:'The Prince Adam Polaroids',
  objective:'Black mail the King with those pictures of prince Adam from that time. Yeah, THAT time. Then Eternia will be mine. The prince of problems. Skeletor.',
  user_id: user_three.id,
  admin_id: 1
  })

mission_four = Mission.create( {
  name:'Bludgeon',
  objective:'Hit thos interfering heroes with lead pipes until they submit to me. Their rightful ruler. The duke of the dastardly. Skeletor!',
  user_id: user_four.id,
  admin_id: 1
  })

mission_five = Mission.create( {
  name:'Stealth',
  objective:'Sneak into the castle and put a mars bar in Prince Adams bed. The shame will force him to give up the throne to me. The unstoppable Skeletor. ',
  user_id: user_one.id,
  admin_id: 1
  })

