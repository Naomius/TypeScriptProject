import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UrlManager} from "../utils/url-manager";
import {Auth} from "../services/auth";
import {QueryParamsType} from "../types/query-params.type";
import {UserInfoType} from "../types/user-info.type";

export class EditIncomeExpanses {
    private profileElement: HTMLElement | null;
    private profileFullNameElement: HTMLElement | null;
    public routeParams: QueryParamsType;
    readonly type: HTMLElement | null;
    readonly operationId: string;
    private operation: {};
    private categoryId: number | null;
    private category: [];

    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.routeParams = UrlManager.getQueryParams();
        this.toggleUser();
        this.type = document.getElementById('type');
        this.operationId = this.routeParams.id;
        this.operation = {};
        this.categoryId = null;
        this.category = [];
        this.init();
    }

    async init() {
        this.operation = await CustomHttp.request(config.host + '/operations/' + this.routeParams.id);
        await this.valueInput(this.operation)
    }

    private async getCategory(): Promise<void> {
        if ((<HTMLInputElement>this.type).value === 'expense') {
            const categoryExp = await CustomHttp.request(config.host + '/categories/expense');
            this.category = categoryExp;
        } else if ((<HTMLInputElement>this.type).value === 'income') {
            const categoryInc = await CustomHttp.request(config.host + '/categories/income')
            this.category = categoryInc;
        }

        const category: HTMLElement | null = document.querySelector('.category');
        if (category) {
            category.innerHTML = '';
        }
        this.category.forEach(item => {
            const newBlock = `<option value="${(<HTMLElement>item).title}" id="${(<HTMLElement>item).id}">${(<HTMLElement>item).title}</option>`;
            if (category) {
                category.innerHTML += newBlock;
            }
        })
    }

   private async valueInput(data: any): Promise<void> {
        const category: HTMLElement | null = document.querySelector('.category');
        const amount: HTMLElement | null = document.querySelector('#incomeExpenseSum');
        const date: HTMLElement | null = document.querySelector('#incomeExpenseDate');
        const comment: HTMLElement | null = document.querySelector('#incomeExpenseTextarea');
        const saveBtn: HTMLElement | null = document.querySelector('.saveBtn');
        const cancelBtn: HTMLElement | null = document.querySelector('.cancelBtn');
        const operations = await CustomHttp.request(config.host + '/operations/?period=all');

       for (let el of this.type) {
           if (el.value === data.type) {
               (document.getElementById(`${el.id}`) as HTMLElement).setAttribute('selected', 'selected');
           }
       }

        await this.getCategory();

       for (let el of this.type) {
           if (el.value === data.type) {
               (document.getElementById(`${el.id}`) as HTMLElement).setAttribute('selected', 'selected');
           }
       }

       (<HTMLInputElement>category).value = data.category;
       (<HTMLInputElement>amount).value = data.amount;
       (<HTMLInputElement>date).value = data.date;
       (<HTMLInputElement>comment).value = data.comment;

       if (category) {
           this.categoryId = category[category.selectedIndex].id;
       }

       if (!(<HTMLInputElement>this.type).value) {
           (<HTMLElement>category).setAttribute('disabled', 'disabled')
       }

       (<HTMLElement>category).onchange = (() => {
           if (category) {
               this.categoryId = category[category.selectedIndex].id;
           }
       })

       if (this.type) {
           this.type.onchange = (() => {
               this.getCategory();
           })
       }

       (<HTMLElement>saveBtn).onclick = (() => {
            CustomHttp.request(config.host + '/operations/' + this.operationId, 'PUT', {
                           "type": (<HTMLInputElement>this.type).value,
                           "amount": +(<HTMLInputElement>amount).value,
                           "date": (<HTMLInputElement>date).value,
                           "comment": (<HTMLInputElement>comment).value,
                           "category_id": +(this.categoryId as number)
                       })
           location.href = '#/incomeAndExpanses'
       })
       if (cancelBtn) {
           cancelBtn.onclick = (() => {
               location.href = '#/incomeAndExpanses';
           })
       }

    }


    private toggleUser(): void {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        if ( this.profileElement && this.profileFullNameElement) {
            if (userInfo && accessToken) {
                this.profileElement.style.display = 'block';
                this.profileFullNameElement.innerText = userInfo.fullName;
                this.dropDownToggle()
                this.categoryToggle()
            } else {
                this.profileElement.style.display = 'none';
            }
        }

    }

    dropDownToggle() {
        (<HTMLElement>document.getElementById('profileIssue')).onclick = () => {
            (<HTMLElement>document.getElementById("myDropdown")).classList.toggle("show")
        };
    }

    categoryToggle() {
        (<HTMLElement>document.getElementById('navItemToggle')).onclick = () => {
            (<HTMLElement>document.getElementById("home-collapse")).classList.toggle("show")
        };
    }
}
