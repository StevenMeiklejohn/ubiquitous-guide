class CommentsController < ApplicationController

  def index
    comments = Comment.all
    render :json => comments
  end

  def create
    comment = Comment.create({author: params[:author], text: params[:text]})
    render :json => comments
  end


  # def create
    # comment = Comment.create( comment_params )
    # render :json => comment
  # end

  # private

  # def comment_params
  #   params.require(:comment).permit(:text, :author)
  # end
end