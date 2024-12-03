from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Field, Div

class LoginForm(forms.Form):
    username = forms.CharField(
        label='Username',
        widget=forms.TextInput(attrs={
            'placeholder': 'Enter username',
            'autocomplete': 'username',
        })
    )
    
    password = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Enter password',
            'autocomplete': 'current-password',
        })
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_class = 'space-y-6'
        self.helper.label_class = 'text-sm font-medium text-gray-300'
        self.helper.field_class = 'mt-1'
        
        # 自定義表單布局
        self.helper.layout = Layout(
            Div(
                Field('username', css_class='pl-10 block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200'),
                css_class='space-y-2'
            ),
            Div(
                Field('password', css_class='pl-10 block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200'),
                css_class='space-y-2'
            ),
            Div(
                Submit('submit', 'Login', css_class='w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105'),
                css_class='mt-6'
            )
        )

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')

        if not username:
            raise forms.ValidationError('Please enter username')
        if not password:
            raise forms.ValidationError('Please enter password')

        return cleaned_data 