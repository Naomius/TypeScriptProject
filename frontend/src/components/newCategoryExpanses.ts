import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UserInfoType} from "../types/user-info.type";

export class NewCategoryExpanses {
    profileElement: HTMLElement | null;
    profileFullNameElement: HTMLElement | null;

    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.cancelExpButton();
        this.btnNewExpanse();
        this.dropDownToggle();
        this.categoryToggle();
        this.toggleUser();
    }


    btnNewExpanse() {
        const that = this;
        (document.querySelector('.newExpansesBtn') as HTMLElement).addEventListener('click', function () {
            that.creatNewCategory()
        })
    }

    cancelExpButton() {
        (document.querySelector('.cancelExpBtn') as HTMLElement).onclick = () => {
            location.href = '#/mainExpenses'
        }
    }

   private async creatNewCategory() {
        const newTitle= (document.querySelector('.newCategoryInputData') as HTMLInputElement).value;
        const emptyInput: HTMLElement | null = document.querySelector('.emptyInput-error');
        const sameCategory: HTMLElement | null = document.querySelector('.sameInput-error');


            if (!newTitle) {
                if (sameCategory) {
                    sameCategory.style.display = ''
                }
                if (emptyInput) {
                    emptyInput.style.display = 'block'
                }
                (emptyInput!.nextElementSibling!.nextElementSibling! as HTMLElement).style.border = '1px solid red'

                location.href = 'javascript:void(0)'
            } else if (newTitle) {
                if (emptyInput && sameCategory) {
                    emptyInput.style.display = ''
                    sameCategory.style.display = 'block'
                }
            }

            try {
                const resultData = await CustomHttp.request(config.host + '/categories/expense', 'POST', {
                    "title" : newTitle
                });
                if (resultData) {
                    if (resultData.error) {
                        throw new Error(resultData.error)
                    }

                    location.href = '#/mainExpenses'
                }
            } catch (error) {
                console.log(error)
            }
    }

   private dropDownToggle() {
        (<HTMLElement>document.getElementById('profileIssue')).onclick = () => {
            (<HTMLElement>document.getElementById("myDropdown")).classList.toggle("show")
        };
    }

   private categoryToggle() {
       (<HTMLElement>document.getElementById('navItemToggle')).onclick = () => {
           (<HTMLElement>document.getElementById("home-collapse")).classList.toggle("show")
        };
    }

   private toggleUser(): void {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (this.profileElement && this.profileFullNameElement) {
            if (userInfo && accessToken) {
                this.profileElement.style.display = 'block';
                this.profileFullNameElement.innerText = userInfo.fullName;
                // this.dropDownToggle();
                // this.categoryToggle();
            } else {
                this.profileElement.style.display = 'none';
            }
        }

    }
}