from django.urls import path
from .views import home, profile, RegisterView
from django.contrib import admin

from django.urls import path, include, re_path

from django.conf import settings
from django.conf.urls.static import static

from django.contrib.auth import views as auth_views
from .views import CustomLoginView, ResetPasswordView, ChangePasswordView

from .forms import LoginForm
from . import views

app_name = "urls"

urlpatterns = [
                  path('admin/', admin.site.urls),

                  path('', home, name='users-home'),
                  path('register/', RegisterView.as_view(), name='users-register'),
                  path('profile/', profile, name='users-profile'),

                  path('login/',
                       CustomLoginView.as_view(redirect_authenticated_user=True, template_name='users/login.html',
                                               authentication_form=LoginForm), name='login'),

                  path('logout/', auth_views.LogoutView.as_view(template_name='users/logout.html'), name='logout'),

                  path('password-reset/', ResetPasswordView.as_view(), name='password_reset'),

                  path('password-reset-confirm/<uidb64>/<token>/',
                       auth_views.PasswordResetConfirmView.as_view(template_name='users/password_reset_confirm.html'),
                       name='password_reset_confirm'),

                  path('password-change/', ChangePasswordView.as_view(), name='password_change'),
                  path('get_nav_info/', views.get_nav_info, name='get_nav_info'),

                  re_path(r'^oauth/', include('social_django.urls', namespace='social')),

              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
