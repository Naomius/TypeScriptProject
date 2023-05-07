import {CustomHttp} from "../services/custom-http";
import { Auth } from "../services/auth";
import config from "../../config/config";
import {FormFieldType} from "../types/form-field.type";
import {SignupResponseType} from "../types/signup-response.type";
import {LoginResponseType} from "../types/login-response.type";


export class Register {
    readonly processElement: HTMLElement | null;
    readonly page: 'index' | 'register';
    private pass: HTMLElement | null;
    private fields: FormFieldType[] = [];

    constructor(page: 'index' | 'register') {
        this.processElement = null;
        this.page = page;
        this.activePlaceholder()
        this.pass = document.getElementById('password');

        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/mainIncomes'
            return;
        }

        this.fields = [

            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: this.page === 'register' ? /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/ : '',
                valid: false,
            },

        ];

        if (this.page === 'register') {
            this.fields.unshift({
                name: 'fullName',
                id: 'fullName',
                element: null,
                regex: /^[А-Я]+\s[а-я]+$/i,
                valid: false,
            },

                {
                    name: 'passwordRepeat',
                    id: 'passwordRepeat',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false,
                });
        }

        const that: Register = this;
        this.fields.forEach((item: FormFieldType) => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            if (item.element) {
                item.element.oninput = function () {
                    that.validateField.call(that, item, <HTMLInputElement>this)
                }
            }

        });

        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.onclick = function (event) {
                event.preventDefault();
                that.processForm();
            }
        }
    }

    private validateField(field: FormFieldType, element: HTMLInputElement): void {
        const errorRepeatPass: HTMLElement | null = document.querySelector('.repeatPasswordValidText');
        const emptyRepeatPassInput = document.querySelector('.passwordValidTextRegister')
        // passwordRepeat === '' ? emptyRepeatPassInput.style.display = 'block' : emptyRepeatPassInput.style.display = 'none'
        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = 'red';
            field.valid = false;
            this.textValidation(field);
        } else if (element.id === 'passwordRepeat' && element.value !== (this.pass as HTMLInputElement).value && 'password' !== 'passwordRepeat') {
            if (errorRepeatPass) {
                errorRepeatPass.style.display = 'block';
            }
            if (this.processElement) {
                this.processElement.setAttribute('disabled', '')
            }
            field.valid = false
        } else {
            // errorRepeatPass.style.display = 'none';
            element.removeAttribute('style');
            field.valid = true;
            this.textValidationRemove(field);
        }
        this.validateForm()
    }

    private textValidation(field: any): void {
       const textBlockEmail: HTMLElement | null = document.querySelector('.validationText');
       const textBlockPassword: HTMLElement | null = document.querySelector('.passwordValidText');
       const fullNameTextBlockPassword: HTMLElement | null = document.querySelector('.fullnameValidText');
       const repeatPassTextBlockPassword: HTMLElement | null = document.querySelector('.repeatPasswordValidText');

       if (field.name === 'email') {
           if (textBlockEmail) {
               textBlockEmail.style.display = 'block'
           }
       }
       if (field.name === 'password') {
           if (textBlockPassword) {
               textBlockPassword.style.display = 'block'
           }
       }
       if (field.name === 'fullName') {
           if (fullNameTextBlockPassword) {
               fullNameTextBlockPassword.style.display = 'block'
           }
       }
       if (field.name === 'passwordRepeat') {
           if (repeatPassTextBlockPassword) {
               repeatPassTextBlockPassword.style.display = 'block'
           }
       }
    }
    private textValidationRemove(field: any): void {
       const textBlockEmail: HTMLElement | null = document.querySelector('.validationText');
       const textBlockPassword: HTMLElement | null = document.querySelector('.passwordValidText');
       const fullNameTextBlockPassword: HTMLElement | null = document.querySelector('.fullnameValidText');
       const repeatPassTextBlockPassword: HTMLElement | null = document.querySelector('.repeatPasswordValidText');

        if (field.name === 'email') {
            if (textBlockEmail) {
                textBlockEmail.style.display = 'none'
            }
        }
        if (field.name === 'password') {
            if (textBlockPassword) {
                textBlockPassword.style.display = 'none'
            }
        }
        if (field.name === 'fullName') {
            if (fullNameTextBlockPassword) {
                fullNameTextBlockPassword.style.display = 'none'
            }
        }
        if (field.name === 'passwordRepeat') {
            if (repeatPassTextBlockPassword) {
                repeatPassTextBlockPassword.style.display = 'none'
            }
        }
    }

    private validateForm(): boolean {
        const validForm: boolean = this.fields.every(item => item.valid);
        if (validForm) {
            if (this.processElement) {
                this.processElement.removeAttribute('disabled')
            }
        }
            return validForm;
    }

    private validElement(): void {
        (document.querySelector('.notValidTextBack') as HTMLElement).style.display = 'block'
    }

   private async processForm(): Promise<void> {
        if(this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email')?.element?.value;
            const password = this.fields.find(item => item.name === 'password')?.element?.value;


            if (this.page === 'register') {
                try {
                  const result: SignupResponseType = await CustomHttp.request(config.host + '/signup', "POST", {
                        fullName: this.fields.find(item => item.name === 'fullName')?.element?.value,
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'passwordRepeat')?.element?.value,
                    })
                    if (result) {
                        if (!result.user) {
                            throw new Error(result.message)
                        }
                        location.href = '#/'
                    }
                    location.href = '#/'
                } catch (error) {
                    console.log(error);
                    return;
                }
            }


                try {
                    const result: LoginResponseType = await CustomHttp.request(config.host + '/login', "POST", {
                        email: email,
                        password: password,
                    })

                    if (result) {
                        if (!result.user || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.fullName || !result.user.id) {
                            throw new Error(result.message)
                        }

                        Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                        Auth.setUserInfo({
                            fullName: result.user.fullName,
                            userId: result.user.id
                        })

                        if (!result.error) {
                            location.href = '#/mainIncomes'
                        }

                    }
                } catch (error) {
                    this.validElement()
                   console.log(error);
                }

        }
    }


    activePlaceholder() {
        const inputEmail: HTMLElement | null = document.querySelector('#email');
        const inputFullName: HTMLElement | null = document.querySelector('#fullName');
        const inputPassword: HTMLElement | null = document.querySelector('#password');
        const inputRepeatPass: HTMLElement | null = document.querySelector('#passwordRepeat');

        if (inputEmail) {
            inputEmail.addEventListener('focus', this.focusPlaceholder);
            inputEmail.addEventListener('blur', this.blurPlaceholder);
        }

        if (this.page === 'register') {
            if (inputFullName && inputRepeatPass) {
                inputFullName.addEventListener('focus', this.focusFullNamePlaceholder);
                inputFullName.addEventListener('blur', this.blurFullNamePlaceholder);
                inputRepeatPass.addEventListener('focus', this.focusRepeatPassPlaceholder);
                inputRepeatPass.addEventListener('blur', this.blurRepeatPassPlaceholder);
            }
        }

        if (inputPassword) {
            inputPassword.addEventListener('focus', this.focusPassPlaceholder);
            inputPassword.addEventListener('blur', this.blurPassPlaceholder);
        }



    }

    //Алексей, пробовал через цикл и event добраться, не получается продумать, чтобы именно label удалялся.
    //Поэтому пока оставил через кучу функций..(без оптимизации так сказать)

    // activePlaceholder() {
    //     const inputEmail = document.querySelectorAll('input')
    //     const labels = document.querySelectorAll('label');
    //     console.log(labels)
    //     inputEmail.forEach(item => {
    //         item.addEventListener('focus', (event) => {
    //             labels.forEach(item => {
    //               event.target.style.display = 'none'
    //             })
    //         })
    //     })
    // }

    focusPlaceholder() {
        (document.querySelector('label[for=email]') as HTMLElement).style.display = 'none';
        (document.querySelector('#email') as HTMLInputElement).style.paddingBottom = '20px';
    }
    private blurPlaceholder():void {
        if ((document.querySelector('input') as any).value == 0) {
            (document.querySelector('label[for=email]') as HTMLInputElement).style.display = 'block';
        }
    }
    focusFullNamePlaceholder() {
        (document.querySelector('label[for=fullName]') as HTMLInputElement).style.display = 'none';
        (document.querySelector('#fullName') as HTMLInputElement).style.paddingBottom = '20px';
    }
    blurFullNamePlaceholder() {
        if ((document.querySelector('input') as any).value == 0) {
            (document.querySelector('label[for=fullName]') as HTMLElement).style.display = 'block';
        }
    }
    focusPassPlaceholder() {
        (document.querySelector('label[for=password]') as HTMLElement).style.display = 'none';
        (document.querySelector('#password') as HTMLElement).style.paddingBottom = '20px';
    }
    blurPassPlaceholder() {
        if ((document.querySelector('input') as any).value == 0) {
            (document.querySelector('label[for=password]') as HTMLElement).style.display = 'block';
        }
    }
    focusRepeatPassPlaceholder() {
        (document.querySelector('label[for=passwordRepeat]') as HTMLElement).style.display = 'none';
        (document.querySelector('#passwordRepeat') as HTMLElement).style.paddingBottom = '20px';
    }
    blurRepeatPassPlaceholder() {
        if ((document.querySelector('input') as any).value == 0) {
            (document.querySelector('label[for=passwordRepeat]') as HTMLElement).style.display = 'block';
        }
    }


}