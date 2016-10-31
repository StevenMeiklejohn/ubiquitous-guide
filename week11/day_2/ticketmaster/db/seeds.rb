Artist.delete_all
Gig.delete_all
Album.delete_all
Venue.delete_all

a1 = Artist.create( { name: 'Oasis' } )
a2 = Artist.create( { name: 'Blur' } )

Album.create( { name: 'Greatest hits', artist_id: a1.id})
Album.create( { name: 'Great Escape', artist_id: a2.id})

v1 = Venue.create( { name: 'o2', location: 'London' } )
v2 = Venue.create( { name: 'Corn Exchange', location: 'Edinburgh' } )
v3 = Venue.create( { name: 'Tuts', location: 'Glasgow' } )

Gig.create( { price: 15, date: DateTime.now() + 30, artist_id: a1.id, venue_id: v1.id } )
Gig.create( { price: 18, date: DateTime.now() + 30, artist_id: a2.id, venue_id: v2.id } )
