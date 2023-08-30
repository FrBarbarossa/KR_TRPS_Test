from django import forms
from polls.models import *
import datetime

class NameForm(forms.Form):
    your_name = forms.CharField(label="Your name", max_length=100)


class SurnameForm(forms.Form):
    surname = forms.CharField(label="Your surname", max_length=200)


class OrgForm(forms.ModelForm):
    name = forms.CharField(max_length=100,
                           required=True,
                           widget=forms.TextInput(attrs={"class": "form-control",
                                                         "placeholder": "Username",
                                                         "aria-label": "Username",
                                                         "aria-describedby": "basic-addon1"}))
    email = forms.EmailField(required=True,
                             widget=forms.TextInput(attrs={'class': 'form-control'}))
    bio = forms.CharField(required=True, widget=forms.Textarea(attrs={'class': 'form-control',
                                                                      'rows': 5,
                                                                      "maxlength": 1000,
                                                                      'placeholder': "Описание организации. Не более 1000 символов"}))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def clean_name(self):
        name = self.cleaned_data['name']
        print(self.instance.name)
        if self.instance.name != name and Organization.objects.filter(name=name):
            raise forms.ValidationError('Организация с таким названием уже существует.')
        return name

    def clean_email(self):
        # Check that email is not duplicate
        email = self.cleaned_data["email"]
        print(self.instance.email)
        if self.instance.email != email and Organization.objects.filter(email=email):
            raise forms.ValidationError('Пользователь с таким e-mail уже существует.')
        return email.lower()

    class Meta:
        model = Organization
        fields = ["name", "bio", "email"]


class OrderForm(forms.ModelForm):
    name = forms.CharField(max_length=50,
                           required=True,
                           widget=forms.TextInput(attrs={"class": "form-control",
                                                         "placeholder": "Название заказа (например: Есть ли кошка на фото?)",
                                                         "aria-label": "Username",
                                                         "aria-describedby": "basic-addon1"}))

    description = forms.CharField(required=True, widget=forms.Textarea(attrs={'class': 'form-control',
                                                                              'rows': 3,
                                                                              "maxlength": 150,
                                                                              'placeholder': "Описание задания. Не более 150 символов Будьте кратки :)"}))

    class Meta:
        model = Order
        fields = ['name', "description", 'instruction']