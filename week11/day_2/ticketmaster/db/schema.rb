# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160705092635) do

  create_table "albums", force: :cascade do |t|
    t.string   "name"
    t.integer  "artist_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "albums", ["artist_id"], name: "index_albums_on_artist_id"

  create_table "artists", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "gigs", force: :cascade do |t|
    t.integer  "price"
    t.datetime "date"
    t.integer  "artist_id"
    t.integer  "venue_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "gigs", ["artist_id"], name: "index_gigs_on_artist_id"
  add_index "gigs", ["venue_id"], name: "index_gigs_on_venue_id"

  create_table "venues", force: :cascade do |t|
    t.string   "name"
    t.string   "location"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
