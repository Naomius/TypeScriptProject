import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";
import config from "../../config/config";
import Chart from "chart.js/auto";
import {Operations} from "../services/operations";
import {UserInfoType} from "../types/user-info.type";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import numbers = _default.defaults.animations.numbers;
import * as stream from "stream";
import {GetOperationsType, GetOperationsTypeArray} from "../types/getOperations.type";
import {ExpanseCreatType, IncomeCreatType} from "../types/income-creat.type";


export class MainPage {
    private diagrams: HTMLElement | null;
    readonly profileElement: HTMLElement | null;
    readonly profileFullNameElement: HTMLElement | null;
    private incomeData: [];
    private expenseData: [];

    constructor() {
        this.diagrams = document.getElementById('diagrams')
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.toggleUser();
        this.showDiagram('today');
        this.incomeData = [];
        this.expenseData = [];
        this.activeFilter();
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

    private toggleUser(): void {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (this.profileElement && this.profileFullNameElement) {
            if (userInfo && accessToken) {
                this.profileElement.style.display = 'block';
                this.profileFullNameElement.innerText = userInfo.fullName;
                this.dropDownToggle();
                this.categoryToggle();
            } else {
                this.profileElement.style.display = 'none';
            }
        }
    }

    async showDiagram(value?: string | number, dateFrom?: string | number, dateTo?: string | number) {
        await this.getData(value, dateFrom, dateTo);
        await this.incomeDiagrams();
    }

    async getData(value?: string | number | undefined, dateFrom?: string | number | undefined, dateTo?: string | number | undefined) {
        const inc: any = [];
        const dec: any = [];
        const data = await Operations.getOperations(value, dateFrom, dateTo);
        console.log(data)
        const incomeData = data.filter((income) => income.type === 'income').forEach(obj => {
            const a = inc.find(income => income.category === obj.category);
            if (a) {
                let amount = a.amount + obj.amount;
                a.amount = amount
            } else {
                inc.push({
                    category: obj.category,
                    amount: obj.amount
                })
            }
        });
        const expenseData = data.filter(expanse => expanse.type === 'expense').forEach(obj => {
            const a = dec.find(expanse => expanse.category === obj.category);
            if (a) {
                let amount = a.amount + obj.amount;
                a.amount = amount
            } else {
                dec.push({
                    category: obj.category,
                    amount: obj.amount
                })
            }
        });
        this.incomeData = inc;
        this.expenseData = dec;

        (<HTMLElement>this.diagrams).innerHTML = '';
        (<HTMLElement>this.diagrams).innerHTML = `
        <canvas class="diagrams-item" id="income-diagram"></canvas>
            <div class="verticalLine"></div>
            <canvas class="diagrams-item" id="expense-diagram"></canvas>
        `
    }

    async incomeDiagrams() {
        const incomeChart: HTMLElement | null = document.getElementById('income-diagram')
        const expenseChart: HTMLElement | null = document.getElementById('expense-diagram')
        if (incomeChart && expenseChart) {
            incomeChart.parentElement!.style.height = '430px';
            (<HTMLElement>incomeChart).parentElement!.style.width = '430px';
            expenseChart.parentElement!.style.height = '430px';
            expenseChart.parentElement!.style.width = '430px';
        }

        new Chart(
            (<HTMLCanvasElement>incomeChart),
            {
                type: 'pie',
                data: {
                    labels: this.incomeData.map((row: IncomeCreatType) => row.category),
                    datasets: [
                        {
                            label: 'Доход в $',
                            data: this.incomeData.map((row: PaymentItem) => row.amount)
                        }
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Доходы',
                            color: '#290661',
                            font: {weight: 'bold', size: '28px'}
                        }
                    }
                }
            }
        );
        new Chart(
            (<HTMLCanvasElement>expenseChart),
            {
                type: 'pie',
                data: {
                    labels: this.expenseData.map((row: ExpanseCreatType) => row.category),
                    datasets: [
                        {
                            label: 'Расход в $',
                            data: this.expenseData.map((row:PaymentItem) => row.amount)
                        }
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Расходы',
                            color: '#290661',
                            font: {weight: 'bold', size: '28px'}
                        }
                    }
                }
            }
        );


    };

    private activeFilter(): void {
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
            if (!(<HTMLElement>interval).classList.contains('active')) {
                (<HTMLElement>dateFrom).setAttribute('disabled', 'disabled');
                (<HTMLElement>dateTo).setAttribute('disabled', 'disabled');
            }
        }

        (<HTMLElement>today).onclick = (async () => {
            check();
            (<HTMLElement>today).classList.add('active');
            await this.showDiagram('today');
        });
        (<HTMLElement>week).onclick = (async () => {
            check();
            (<HTMLElement>week).classList.add('active')
            await this.showDiagram('week');
        });
        (<HTMLElement>month).onclick = (async () => {
            check();
            (<HTMLElement>month).classList.add('active')
            await this.showDiagram('month');
        });
        (<HTMLElement>year).onclick = (async () => {
            check();
            (<HTMLElement>year).classList.add('active')
            await this.showDiagram('year');
        });
        (<HTMLElement>all).onclick = (async () => {
            check();
            (<HTMLElement>all).classList.add('active')
            await this.showDiagram('all');
        });
        (<HTMLElement>interval).onclick = (async () => {
            check();
            (<HTMLElement>interval).classList.add('active')

            if ((<HTMLInputElement>dateFrom).value && (<HTMLInputElement>dateTo).value) {
                await this.showDiagram('interval', (<HTMLInputElement>dateFrom).value, (<HTMLInputElement>dateTo).value);
            }
            if ((<HTMLElement>interval).classList.contains('active')) {
                (<HTMLElement>dateFrom).removeAttribute('disabled');
                (<HTMLElement>dateTo).removeAttribute('disabled');
            }


            (<HTMLElement>dateFrom).onchange = (() => {
                if ((<HTMLInputElement>dateFrom).value && (<HTMLInputElement>dateTo).value) {
                    this.showDiagram('interval', (<HTMLInputElement>dateFrom).value, (<HTMLInputElement>dateTo).value);
                }
            })
            if (dateTo) {
                dateTo.onchange = (() => {
                    if ((<HTMLInputElement>dateFrom).value && (<HTMLInputElement>dateTo).value) {
                        this.showDiagram('interval', (<HTMLInputElement>dateFrom).value, (<HTMLInputElement>dateTo).value);
                    }
                })
            }
        });
    }


}


