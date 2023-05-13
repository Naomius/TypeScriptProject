import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";
import config from "../../config/config";
import {EditCategoryIncome} from "./editCategoryIncome";
import * as events from "events";

export class MainExpenses {
    profileElement: HTMLElement | null;
    profileFullNameElement: HTMLElement | null;

    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.newCategoryExpanses();
        this.incomeExpanses();
        this.deleteModal();
        this.toggleUser();
        this.dropDownToggle();
        this.categoryToggle();
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

    dropDownToggle() {
        (document.getElementById('profileIssue') as HTMLElement).onclick = () => {
            (document.getElementById("myDropdown")as HTMLElement).classList.toggle("show")
        };
    }

    categoryToggle() {
        (document.getElementById('navItemToggle') as HTMLElement).onclick = () => {
            (document.getElementById("home-collapse") as HTMLElement).classList.toggle("show")
        };
    }

    newCategoryExpanses() {
        (document.querySelector('.newCategoryExpansesCreat') as HTMLElement).onclick = () => {
            location.href = '#/newCategoryExpanses'
        }
    }

    editIncomePage() {
        const editBtn = document.querySelectorAll('.editExpanse');
        let expanseId = '';

        editBtn.forEach(item => {
            item.addEventListener('click', event => {
                expanseId = ((event.target as HTMLElement)!.parentElement!.parentElement!.id)

                if (expanseId) {
                    location.href = '#/editCategoryExpanses?id=' + expanseId
                }
            })
        })
    }

    async incomeExpanses() {
        const resultData = await CustomHttp.request(config.host + '/categories/expense');
        console.log(resultData)
        this.renderNewExpanse(resultData)
        this.editIncomePage()
        this.deleteModal()
    }

    renderNewExpanse(resultData: any) {
        const incomeBlock = document.querySelector('.cards');
        resultData.forEach((item: any) => {
            const newBlock = `<div class="card" id="${item.id}">
                                   <div class="card-body">
                                       <h2 class="card-title mb-3">${item.title}</h2>
                                       <button type="button" class="btn btn-primary me-2 editExpanse">Редактировать</button>
                                       <button type="button" class="btn btn-danger me-5 deleteBtn">Удалить</button>
                                   </div>
                              </div>`;
            (incomeBlock as HTMLElement).innerHTML += newBlock;
        })
    }

    deleteModal() {
        const btn: HTMLElement | null = document.querySelector('.modal-delete');
        const buttons: NodeListOf<Element> = document.querySelectorAll('.deleteBtn');
        const cancelBtn: HTMLElement | null = document.querySelector('.modalCancelDelete');
        const agreeBtn: HTMLElement | null = document.querySelector('.agreeDelete');
        buttons.forEach(item => {
            item.addEventListener('click', event => {
                (btn as HTMLElement).style.display = 'block'
                let categoryBlockId = (event.target as HTMLElement)!.parentElement!.parentElement!.id;

                if (agreeBtn && btn) {
                    agreeBtn.onclick = (() =>  {
                        (event.target as HTMLElement)!.parentElement!.parentElement!.remove()
                        btn.style.display = "none"
                        this.deleteIssueCategory(categoryBlockId)
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

    async deleteIssueCategory(categoryBlockId: any) {
        await CustomHttp.request(config.host + '/categories/expense/' + categoryBlockId, 'DELETE')
    }

}