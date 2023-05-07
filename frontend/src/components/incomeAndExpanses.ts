import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {Operations} from "../services/operations";
import {UrlManager} from "../utils/url-manager";
import {UserInfoType} from "../types/user-info.type";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import numbers = _default.defaults.animations.numbers;

export class IncomeAndExpanses {
    profileElement: HTMLElement | null;
    profileFullNameElement: HTMLElement | null;
    tBodyBlock: HTMLElement | null;
    filterOperations: [];

    constructor() {
        this.profileElement = document.getElementById('profileIssue');
        this.profileFullNameElement = document.getElementById('profileFullName');
        this.tBodyBlock = document.querySelector('.tbodyBlock');
        this.creatIncomesExpenses();
        // this.incomeExpenseGet();
        this.deleteModal();
        this.toggleUser();
        this.dropDownToggle();
        this.categoryToggle();
        // this.todayFilter()
        this.activeBtns();
        this.editIncomePage()
        this.filterOperations = [];
        this.init('today');
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

    private creatIncomesExpenses():void {
      const creatIncomeBtn: HTMLElement | null= document.querySelector('.createIncomeBtn');
      const creatExpenseBtn: HTMLElement | null = document.querySelector('.createExpenseBtn');

      if (creatIncomeBtn && creatExpenseBtn) {
          creatIncomeBtn.onclick = (() => { location.href = '#/creatIncomeExpanses?type=income'})
          creatExpenseBtn.onclick = (() => { location.href = '#/creatIncomeExpanses?type=expense'})
      }

    }

//----------Filters ---------

    private async init(value?: string | number, dateFrom?: number | string, dateTo?: number | string) {
        this.filterOperations = await Operations.getOperations(value, dateFrom, dateTo);
        if (this.tBodyBlock) {
            this.tBodyBlock.innerHTML = '';
        }
        this.renderIncomeExpense(this.filterOperations);
        this.editIncomePage();
    }

    activeBtns() {
        const today: HTMLElement | null = document.getElementById('today');
        const week: HTMLElement | null = document.getElementById('week');
        const month: HTMLElement | null = document.getElementById('month');
        const year: HTMLElement | null = document.getElementById('year');
        const all: HTMLElement | null = document.getElementById('all');
        const interval: HTMLElement | null = document.getElementById('interval');
        const dateFrom: HTMLElement | null = document.getElementById('dateFrom');
        const dateTo: HTMLElement | null = document.getElementById('dateTo');
        const itemTabs: HTMLCollectionOf<Element> = document.getElementsByClassName('item-tabs');

        function check() {
            [].forEach.call(itemTabs, function (el) {
                (<HTMLElement>el).classList.remove('active')
            });
            if (interval && dateFrom && dateTo) {
                if (!interval.classList.contains('active')) {
                    dateFrom.setAttribute('disabled', 'disabled');
                    dateTo.setAttribute('disabled', 'disabled');
                }
            }

        }

        if (today) {
            today.onclick = (async () => {
                check();
                today.classList.add('active');
                await this.init('today');
            })
        }

        if (week) {
            week.onclick =(async () => {
                check();
                week.classList.add('active')
                await this.init('week');
            })
        }

        if (month) {
            month.onclick = (async () => {
                check();
                month.classList.add('active')
                await this.init('month');
            })
        }

        if (year) {
            year.onclick = (async () => {
                check();
                year.classList.add('active')
                await this.init('year');
            })
        }

        if (all) {
            all.onclick = (async () => {
                check();
                all.classList.add('active')
                await this.init('all');
            })
        }

        if (interval && dateFrom && dateTo) {
            interval.onclick = (async () => {
                check();
                interval.classList.add('active')
                await this.init('interval');

                if (interval.classList.contains('active')) {
                    dateFrom.removeAttribute('disabled');
                    dateTo.removeAttribute('disabled');
                }

                dateFrom.onchange = (() => {
                    if ((<HTMLInputElement>dateFrom).value && (<HTMLInputElement>dateTo).value) {
                        this.init('interval', (dateFrom as HTMLInputElement).value, (<HTMLInputElement>dateTo).value);
                    }
                })
                dateTo.onchange = (() => {
                    if ((<HTMLInputElement>dateFrom).value && (<HTMLInputElement>dateTo).value) {
                        this.init('interval', (<HTMLInputElement>dateFrom).value, (<HTMLInputElement>dateTo).value);
                    }
                })

            });
        }



    }


//--------------End of Filters--------------

    private renderIncomeExpense(result: any): void {
        const trElement: HTMLElement | null = document.querySelector('.tbodyBlock');
        const categoryColor: HTMLElement | null = document.querySelector('.span-row1');
        result.forEach((item: any, index: any) => {

            if (item.type === 'income') {
                item.type = 'доход';
            } else {item.type = 'расход'}

            const newBlock = `<tr class="trData" id="${item.id}">
                                  <th scope="row">${index + 1}</th>
                                  ${item.type === 'расход' ? `<td><span class="span-row1 redExpense">${item.type}</span></td>` : `<td><span class="span-row1">${item.type}</span></td>`}
                                  <td>${item.category}</td>
                                  <td>$${item.amount}</td>
                                  <td>${item.date}</td>
                                  <td>${item.comment}</td>
                                  <td>
                                    <div>
                                    <a class="buttonDel">
                                        <img src="/images/trashPng.png" alt="trash">
                                    </a>
                                    <a class="buttonEdit">
                                      <img src="/images/pencilPng.png" alt="pencil">
                                    </a>
                                    </div>
                                  </td>
                              </tr>
                              `;
            (<HTMLElement>trElement).innerHTML += newBlock
        })
        this.deleteModal()
    }

    private async deleteIssueCategory(categoryBlockId: any) {
        await CustomHttp.request(config.host + '/operations/' + categoryBlockId, 'DELETE')
    }

    deleteModal() {
        const btn: HTMLElement | null = document.querySelector('.modal-delete');
        const buttons: NodeListOf<Element> = document.querySelectorAll('.buttonDel');
        const cancelBtn: HTMLElement | null  = document.querySelector('.modalCancelDelete');
        const agreeBtn: HTMLElement | null  = document.querySelector('.agreeDelete');
        buttons.forEach(item => {
            item.addEventListener('click', event => {
                (<HTMLElement>btn).style.display = 'block'
                let eventElement: EventTarget | null = event.target;
                let categoryBlockId: number = eventElement.parentNode.parentNode.parentNode.parentNode.id;

                (<HTMLElement>agreeBtn).onclick = (() => {
                    event.target.parentNode.parentNode.parentNode.parentNode.remove()
                    (<HTMLElement>btn).style.display = "none"
                    this.deleteIssueCategory(categoryBlockId)
                })
            })
        })
        if (cancelBtn && btn) {
            cancelBtn.onclick = () => {
                btn.style.display = "none";
            }
        }
    }

    private editIncomePage(): void {
        const editBtn: NodeListOf<Element> = document.querySelectorAll('.buttonEdit');
        let issueId = '';

        editBtn.forEach(item => {
            item.addEventListener('click', event => {
                issueId = event.target.parentNode.parentNode.parentNode.parentNode.id
                if (issueId) {
                    location.href = '#/editIncomeExpanses?id=' + issueId
                }
            })
        })
    }



}