import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UrlManager} from "../utils/url-manager";
import {Auth} from "../services/auth";
import {QueryParamsType} from "../types/query-params.type";


export class EditCategoryIncome {
    readonly profileElement: HTMLElement | null
    readonly profileFullNameElement: HTMLElement | null
    private routeParams: QueryParamsType;
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.routeParams = UrlManager.getQueryParams();
        this.cancelButton();
        this.editIssueIncome();
        this.saveButton();
        this.toggleUser();
    }

    toggleUser() {
        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (this.profileElement && this.profileFullNameElement) {
            if (userInfo && accessToken) {
                this.profileElement.style.display = 'block';
                this.profileFullNameElement.innerText = userInfo.fullName;
            } else {
                this.profileElement.style.display = 'none';
            }
        }
    }

    cancelButton() {
        (document.querySelector('.cancelBtn') as HTMLElement).onclick = () => {
            location.href = '#/issue'
        }
    }

    saveButton() {
        const that = this;
        (document.querySelector('.editNewText') as HTMLElement).addEventListener('click', function () {
            that.putNewIssue();
        })
    }

   private async editIssueIncome(): Promise<void> {

       const resultData = await CustomHttp.request(config.host + '/categories/income/' + this.routeParams.id)
       console.log(resultData.title)

        const inputValue = (document.querySelector('.textFromIssues') as HTMLInputElement).value = `${resultData.title}`;
        if (!inputValue) {
            location.href = 'javascript:void(0)';
        }

    }

    async putNewIssue() {
        const inputValue = (document.querySelector('.textFromIssues') as HTMLInputElement).value;
        if (!inputValue) {
            location.href = 'javascript:void(0)';
        }

        try {
            const resultData = await CustomHttp.request(config.host + '/categories/income/' + this.routeParams.id, 'PUT', {
                "title": inputValue
            });
                if (resultData.error) {
                    throw new Error(resultData.error)
                }
                location.href = '#/issue'
        } catch (error) {
            console.log(error)
        }
    }



}