class FruitsController < ApplicationController
  def index
    fruits = Fruit.all

    render( json: fruits )
  end

  def show
    fruit = Fruit.find( params[:id] )

    render( json: fruit )
  end

  def create
    fruit = Fruit.new
    fruit.name = params[:name]
    fruit.save
    render( json: fruit )
  end

  def update
    fruit = Fruit.find_by(id: params[:id])
    fruit.update(name: params[:name])
    render( json: fruit )
  end

  def destroy
    fruit = Fruit.find(params[:id])
    fruit.destroy
    render( json: fruit )
  end


end
