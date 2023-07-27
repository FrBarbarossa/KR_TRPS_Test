from django import forms


class NameForm(forms.Form):
    your_name = forms.CharField(label="Your name", max_length=100)

class SurnameForm(forms.Form):
    surname = forms.CharField(label="Your surname", max_length=200)