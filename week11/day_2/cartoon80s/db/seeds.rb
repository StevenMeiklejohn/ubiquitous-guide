Show.delete_all
Character.delete_all

s1 = Show.create( { 
  name:'Thundercats',
  year: 1985,
  location: 'Thundera',
  image: ""
}
)

s2 = Show.create( { 
  name:'He-Man',
  year: 1983,
  location: 'Eternia',
  image: ""
}
)

s3 = Show.create( {
  name: 'Teenage Mutant Ninja Turtles',
  year: 1987,
  location: 'New York',
  image: ""
}
)

s4 = Show.create( {
  name: 'MASK',
  year: 1985,
  location: 'Earth',
  image: ""
}
)



c1 = Character.create( {
  name: 'Lion-O',
  species: 'Human shaped cat type thing',
  catchphrase: 'Thundercats Ho!',
  show_id: s1.id
  }
  )

c2 = Character.create( {
  name: 'He-Man',
  species: 'Beefcake',
  catchphrase: 'I have the power!',
  show_id: s2.id
  }
  )

c3 = Character.create( {
  name: 'Splinter',
  species: 'Rat',
  catchphrase: 'Wax on, wax off',
  show_id: s3.id
  }
  )

c4 = Character.create( {
  name: 'Matt Tracker',
  species: 'Human',
  catchphrase: 'Hey baby, wanna wrestle?',
  show_id: s4.id
  }
  )
  




