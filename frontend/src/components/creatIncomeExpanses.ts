import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Operations} from "../services/operations";
import {UrlManager} from "../utils/url-manager";
import {log10} from "chart.js/helpers";
import {QueryParamsType} from "../types/query-params.type";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import numbers = _default.defaults.animations.numbers;
import {UserInfoType} from "../types/user-info.type";



export class CreatIncomeExpanses {
    readonly profileElement: HTMLElement | null;
    readonly profileFullNameElement: HTMLElement | null;
    public routeParams: QueryParamsType;
    public type: HTMLElement | null;
    private operationId: string | null;
    private categoryId: string | null;
    public category: [];

    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.routeParams = UrlManager.getQueryParams();
        this.type = document.getElementById(`type`);
        this.operationId = localStorage.getItem('operationId');
        this.categoryId = null;
        this.category = [];
        this.init();
        this.toggleUser();
        this.routeParamsInput()
    }


    private routeParamsInput(): void {
        if (this.routeParams.type === 'income') {
            (<HTMLInputElement>this.type).value = 'income'
            this.getCategory()
        } else if (this.routeParams.type === 'expense') {
            (<HTMLInputElement>this.type).value = 'expense'
            this.getCategory()
        }
    }

    private async init(): Promise<void>{
        await this.creatValueInput();
    }

    private async getCategory(): Promise<void> {
        if ((<HTMLInputElement>this.type).value === 'expense') {
            const categoryExp = await CustomHttp.request(config.host + '/categories/expense');
            this.category = categoryExp;
        } else if ((<HTMLInputElement>this.type).value === 'income') {
            const categoryInc = await CustomHttp.request(config.host + '/categories/income')
            this.category = categoryInc;
        }

        const category: HTMLElement | null = document.getElementById('category');
        if (category) {
            category.innerHTML = `<option value="" disabled selected hidden>Категория...</option>`;
        }

        this.category.forEach(item => {
            const newOption = `<option value="${(<HTMLElement>item).title}" id="${(<HTMLElement>item).id}">${(<HTMLElement>item).title}</option>`
            if (category) {
                category.innerHTML += newOption
            }
        })

    }

    private async creatValueInput(): Promise<void> {
        const category: HTMLElement | null = document.getElementById('category');
        const amount: HTMLElement | null = document.getElementById('incomeExpenseSum');
        const date: HTMLElement | null = document.querySelector('#incomeExpenseDate');
        const comment: HTMLElement | null = document.querySelector('#incomeExpenseTextarea');
        const operations = await CustomHttp.request(config.host + '/operations/?period=all');
        const creatButton: HTMLElement | null = document.querySelector('.saveBtn');
        const cancelButton: HTMLElement | null = document.querySelector('.cancelBtn');
        const inputErrorCreat: HTMLElement | null = document.getElementById('input-server-error')

        if (this.type) {
        this.type.onchange = (async () => {
            (category as HTMLElement).removeAttribute('disables');
            await this.getCategory();
        })
        }

        if (category) {
            category.onchange = (() => {
                this.categoryId = (category as HTMLSelectElement)[(category as HTMLSelectElement).selectedIndex].id;
            })
        }

        (<HTMLElement>creatButton).onclick = (() => {
            if (this.categoryId) {
                if (!(<HTMLInputElement>date).value || !(<HTMLInputElement>amount).value || !(<HTMLInputElement>category).value || ! +this.categoryId || !(<HTMLInputElement>comment).value) {
                    (<HTMLElement>inputErrorCreat).style.display = 'block'
                } else {
                    const result: any =  CustomHttp.request(config.host + '/operations', 'POST', {
                        "type": (<HTMLInputElement>this.type).value,
                        "amount": (<HTMLInputElement>amount).value,
                        "date": (<HTMLInputElement>date).value,
                        "comment": (<HTMLInputElement>comment).value,
                        "category_id": +this.categoryId
                    });
                    if (result) {
                        if (inputErrorCreat) {
                            inputErrorCreat.style.display = 'none';
                        }
                            location.href = '#/incomeAndExpanses'
                    }
                }
            }


        });
        if (cancelButton) {
            cancelButton.onclick = (() => {
                location.href = '#/incomeAndExpanses'
            })
        }
    }


    private toggleUser(): void {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (this.profileElement &&  this.profileFullNameElement) {
            if (userInfo && accessToken) {
                this.profileElement.style.display = 'block';
                this.profileFullNameElement.innerText = userInfo.fullName;
                (<HTMLElement>document.getElementById('profileIssue')).onclick = () => {
                    (<HTMLElement>document.getElementById("myDropdown")).classList.toggle("show")
                }
                (<HTMLElement>document.getElementById('navItemToggle')).onclick = () => {
                    (<HTMLElement>document.getElementById("home-collapse")).classList.toggle("show")
                };
            } else {
                this.profileElement.style.display = 'none';

            }
        }

    }
}
