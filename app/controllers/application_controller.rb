class ApplicationController < ActionController::Base
  before_action :authenticate_user!

    include CableReady::Broadcaster
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  helper_method :current_team

  private

  def current_team
    current_user.team
  end
end
