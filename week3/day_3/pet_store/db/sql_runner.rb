class SqlRunner

#using begin, ensure, end block
#Even if the code in the begin section fails, rubot will still carry out the code in the ensure block.
  def self.run( sql )
    begin
      db = PG.connect( { dbname:'pet_store', host:'localhost' } )
      result = db.exec( sql )
    ensure
      db.close()
    end
    return result
  end

end