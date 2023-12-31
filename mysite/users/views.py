from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.contrib.auth.models import Permission, User
from django.contrib.auth.views import LoginView, PasswordResetView, PasswordChangeView
from django.contrib import messages
from django.contrib.messages.views import SuccessMessageMixin
from django.views import View
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
import json
from polls.models import Organization, Transaction

from .forms import RegisterForm, LoginForm, UpdateUserForm, UpdateProfileForm


def home(request):
    print(request.user)
    return render(request, 'users/home.html')


def get_nav_info(request):
    data = {}
    if request.user.is_anonymous:
        data['type'] = 'anonymous'
    elif Organization.objects.filter(profile=request.user.profile):
        org = Organization.objects.filter(profile=request.user.profile)
        data['type'] = 'organization'
        data['id'] = org[0].id
        data['name'] = request.user.username
        data['avatar'] = request.user.profile.avatar.url
    elif request.user.profile:
        data['type'] = 'profile'
        data['id'] = request.user.profile.id
        data['name'] = request.user.username
        data['avatar'] = request.user.profile.avatar.url
        data['balance'] = request.user.profile.balance
    return JsonResponse({'status': 'Valid request', "data": data}, status=200)


class RegisterView(View):
    form_class = RegisterForm
    initial = {'key': 'value'}
    template_name = 'users/register.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(to='users:/')

        return super(RegisterView, self).dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        form = self.form_class(initial=self.initial)
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)

        if form.is_valid():
            form.save()

            username = form.cleaned_data.get('username')
            messages.success(request, f'Аккаунт создан для {username}')

            return redirect(to='users:login')

        return render(request, self.template_name, {'form': form})


class CustomLoginView(LoginView):
    form_class = LoginForm

    def form_valid(self, form):
        remember_me = form.cleaned_data.get('remember_me')
        if not remember_me:
            self.request.session.set_expiry(0)

            self.request.session.modified = True

        return super(CustomLoginView, self).form_valid(form)


class ResetPasswordView(SuccessMessageMixin, PasswordResetView):
    template_name = 'users/password_reset.html'
    email_template_name = 'users/password_reset_email.html'
    subject_template_name = 'users/password_reset_subject'
    success_message = "Мы отправили вам по электронной почте инструкции по установке вашего пароля, " \
                      "если существует учетная запись с указанным вами адресом электронной почты. Вы должны получить их в ближайшее время." \
                      "Если вы не получите электронное письмо," \
        "пожалуйста, убедитесь, что вы ввели адрес, по которому регистрировались, и проверьте свою папку со спамом."
    success_url = reverse_lazy('users:login')


class ChangePasswordView(SuccessMessageMixin, PasswordChangeView):
    template_name = 'users/change_password.html'
    success_message = "Пароль успешно изменён"
    success_url = reverse_lazy('users:users-home')


@login_required
def profile(request):
    if request.method == 'POST':
        user_form = UpdateUserForm(request.POST, instance=request.user)
        profile_form = UpdateProfileForm(request.POST, request.FILES, instance=request.user.profile)

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, 'Ваш профиль успешно обновлён')
            return redirect(to='users:users-profile')
    else:
        user_form = UpdateUserForm(instance=request.user)
        profile_form = UpdateProfileForm(instance=request.user.profile)
        profile = request.user.profile
        org = Organization.objects.filter(profile=profile)
        users_done_tasks = len(Transaction.objects.filter(status='DN').select_related('task').filter(
            task__executor_id=request.user.profile.id))
        users_undone_tasks = len(Transaction.objects.filter(status='CN').select_related('task').filter(
            task__executor_id=request.user.profile.id))
        users_earned_money = sum(Transaction.objects.filter(status='DN').select_related('task').filter(
            task__executor_id=request.user.profile.id).values_list('res_sum', flat=True))
        print(users_earned_money)
        # request.user.user_permissions.add(Permission.objects.get(codename="view_profile")) # тестирование добавления
        # print(request.user.get_user_permissions())
        # print(request.user.has_perm("users.view_profile"))
    return render(request, 'users/profile.html',
                  {'user_form': user_form, 'profile_form': profile_form, "profile": profile, 'org': len(org),
                   'users_done_tasks': users_done_tasks, 'users_undone_tasks': users_undone_tasks,
                   "users_earned_money": users_earned_money})
