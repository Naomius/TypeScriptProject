import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UserInfoType} from "../types/user-info.type";
import {IncomeCreatType} from "../types/income-creat.type";

export class NewCategoryIncome {
    readonly profileElement: HTMLElement | null;
    readonly profileFullNameElement: HTMLElement | null;

    constructor() {
        this.profileElement = document.getElementById('profileIssue');
        this.profileFullNameElement = document.getElementById('profileFullName');
        this.cancelButton();
        this.btnNewIssues();
        this.toggleUser();
        this.dropDownToggle();
        this.categoryToggle();
    }

    private toggleUser(): void {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (this.profileElement && this.profileFullNameElement) {
            if (userInfo && accessToken) {

                this.profileElement.style.display = 'block';
                this.profileFullNameElement.innerText = userInfo.fullName;
            } else {
                this.profileElement.style.display = 'none';
            }
        }
    }

    private btnNewIssues(): void {
        const that: NewCategoryIncome = this;
        (document.querySelector('.newIssueBtn') as HTMLElement).addEventListener('click', function () {
            that.creatNewCategory()
        })
    }

    private cancelButton():void {
        (document.querySelector('.cancelBtn') as HTMLElement).onclick = () => {
            location.href = '#/mainIncomes'
        }
    }

    private async creatNewCategory(): Promise<void> {
        const newTitle = (document.querySelector('.newCategoryInputData') as HTMLInputElement).value;
        const inputBlock: HTMLElement | null = document.querySelector('.newCategoryInputData')
        const emptyInput: HTMLElement | null = document.querySelector('.emptyInput-error');
        const sameCategory: HTMLElement | null = document.querySelector('.sameInput-error');

        if (sameCategory && emptyInput && inputBlock) {
            if (!newTitle.trim()) {
                sameCategory.style.display = ''
                emptyInput.style.display = 'block'
                inputBlock.style.border = '1px solid red'
                location.href = 'javascript:void(0)'
            } else if (newTitle) {
                emptyInput.style.display = ''
                inputBlock.style.border = ''
                sameCategory.style.display = 'block'
            }
        }


        try {
            const res: IncomeCreatType = await CustomHttp.request(config.host + '/categories/income', 'POST', {
                "title": newTitle
            });
            if (res) {
                if (res.error) {
                    throw new Error(res.error.toString())
                }
                console.log(res)

                location.href = '#/mainIncomes'
            }
        } catch (error) {
            console.log(error)
        }

    }


    dropDownToggle() {
        (document.getElementById('profileIssue') as HTMLElement).onclick = () => {
            (document.getElementById("myDropdown") as HTMLElement).classList.toggle("show")
        };
    }

    categoryToggle() {
        (document.getElementById('navItemToggle') as HTMLElement).onclick = () => {
            (document.getElementById("home-collapse") as HTMLElement).classList.toggle("show")
        };
    }

    // async creatNewCategory() {
    //     let xToken = localStorage.getItem(Auth.accessTokenKey);
    //     const newTitle = document.querySelector('.newCategoryInputData').value;
    //
    //     const requestHeaders = new Headers();
    //     requestHeaders.append('x-auth-token', xToken)
    //
    //     const formData = new FormData();
    //     formData.append("title", newTitle)
    //
    //
    //     const res = await fetch(this.API_URL, {
    //         method: 'POST',
    //         headers: requestHeaders,
    //         body: formData
    //     });
    //
    //     const result = await res.json();
    //     console.log(result)
    // }
}