class Venue < ActiveRecord::Base
  has_many( :gigs )
  has_many( :artists, { through: :gigs } )
end
