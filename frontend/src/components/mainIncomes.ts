import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";
import config from "../../config/config";
import {UserInfoType} from "../types/user-info.type";

export class MainIncomes {
    readonly profileElement: HTMLElement | null
    readonly profileFullNameElement: HTMLElement | null

    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.getBalance();
        this.incomeIssue();
        this.deleteModal();
        this.toggleUser();
        this.dropDownToggle();
        this.categoryToggle();
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

    private toggleUser():void {
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



    private editIncomePage():void {
        const editBtn: NodeListOf<Element> = document.querySelectorAll('.editIncome');
        let issueId = '';

            editBtn.forEach(item => {
                item.addEventListener('click', event => {
                   issueId = (event.target as HTMLElement)!.parentElement!.parentElement!.id

                    if (issueId) {
                        location.href = '#/editCategoryIncome?id=' + issueId
                    }
                })
            })
    }

    newCategoryIssues() {
        (document.querySelector('.newCategoryIssuesCreat') as HTMLElement).onclick = () => {
            location.href = '#/newCategoryIssues'
        }
    }

    deleteModal() {
        const btn: HTMLElement | null = document.querySelector('.modal-delete');
        const buttons: NodeListOf<Element> = document.querySelectorAll('.deleteBtn');
        const cancelBtn: HTMLElement | null = document.querySelector('.modalCancelDelete');
        const agreeBtn: HTMLElement | null = document.querySelector('.agreeDelete');
        buttons.forEach(item => {
            item.addEventListener('click', event => {
                if (btn) {
                    btn.style.display = 'block'
                }

                let categoryBlockId = (event.target as HTMLElement).parentElement!.parentElement!.id;

                if (agreeBtn && btn) {
                    agreeBtn.onclick = (() =>  {
                        (event.target as HTMLElement)!.parentElement!.parentElement!.remove()
                        btn.style.display = "none"
                        this.deleteIssueCategory(+categoryBlockId)
                    })
                }

            })
        })
        if (cancelBtn && btn) {
            cancelBtn.onclick = () => {
                btn.style.display = "none";
            }
        }

    }

    private async deleteIssueCategory(categoryBlockId: number): Promise<void> {
         await CustomHttp.request(config.host + '/categories/income/' + categoryBlockId, 'DELETE')
    }

    private async getBalance(): Promise<void> {
        const res = await CustomHttp.request(config.host + '/balance');
        (document.querySelector('.userBalance') as HTMLElement).innerHTML = `${res.balance}`
    }

    async incomeIssue() {
        const result = await CustomHttp.request(config.host + '/categories/income');

        this.renderNewIncome(result)
        this.deleteModal()
        this.editIncomePage()
    }

    private renderNewIncome(result: any) {
        const incomeBlock = document.querySelector('.cards');
        result.forEach((item: any) => {
            const newBlock = ` <div class="card" id="${item.id}">
                                   <div class="card-body">
                                       <h2 class="card-title mb-3">${item.title}</h2>
                                       <button type="button" class="btn btn-primary me-2 editIncome">Редактировать</button>
                                       <button type="button" class="btn btn-danger me-5 deleteBtn">Удалить</button>
                                   </div>
                              </div>`;
            (incomeBlock as any).innerHTML += newBlock;
        })
    }

}












