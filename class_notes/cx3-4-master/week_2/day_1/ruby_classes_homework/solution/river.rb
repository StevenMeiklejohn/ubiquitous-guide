class River

  def initialize(fishes)
    @fishes = fishes
  end

  def number_of_fishes
    @fishes.size
  end

  def get_fish
    @fishes.pop
  end
end