import {UrlManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {QueryParamsType} from "../types/query-params.type";
import {UserInfoType} from "../types/user-info.type";

export class EditCategoryExpanses {
    profileElement: HTMLElement | null;
    profileFullNameElement: HTMLElement | null;
    routeParams: QueryParamsType;
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.routeParams = UrlManager.getQueryParams();
        this.cancelButton();
        this.saveButton();
        this.editExpense();
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

    private cancelButton(): void {
        (<HTMLElement>document.querySelector('.cancelBtn')).onclick = () => {
            location.href = '#/expensesPage'
        }
    }

    private saveButton(): void {
        const that = this;
        (<HTMLElement>document.querySelector('.editNewText')).addEventListener('click', function () {
            that.putNewExpenses();
        })
    }

    private async editExpense() {
        const resultData = await CustomHttp.request(config.host + '/categories/expense/' + this.routeParams.id)

        const inputValue = (<HTMLInputElement>document.querySelector('.textFromExpanses')).value = `${resultData.title}`;
            if (!inputValue) {
                location.href = 'javascript:void(0)';
            }
    }

    async putNewExpenses() {
        const inputValue = (<HTMLInputElement>document.querySelector('.textFromExpanses')).value;
        if (!inputValue) {
            location.href = 'javascript:void(0)';
        }

        try {
            const resultData = await CustomHttp.request(config.host + '/categories/expense/' + this.routeParams.id, 'PUT', {
                "title": inputValue
            })
            if (resultData.error) {
                throw new Error(resultData.error)
            }
            location.href = '#/mainExpenses'
        } catch (error) {

        }
    }

    private dropDownToggle(): void {
        (<HTMLElement>document.getElementById('profileIssue')).onclick = () => {
            (<HTMLElement>document.getElementById("myDropdown")).classList.toggle("show")
        };
    }

    private categoryToggle(): void {
        (<HTMLElement>document.getElementById('navItemToggle')).onclick = () => {
            (<HTMLElement>document.getElementById("home-collapse")).classList.toggle("show")
        };
    }


}