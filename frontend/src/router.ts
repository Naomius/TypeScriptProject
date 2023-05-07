import {Register} from "./components/register";
import {MainIncomes} from "./components/mainIncomes";
import {Auth} from "./services/auth";
import {EditCategoryIncome} from "./components/editCategoryIncome";
import {NewCategoryIncome} from "./components/newCategoryIncome";
import {MainExpenses} from "./components/mainExpenses"
import {CustomHttp} from "./services/custom-http";
import config from "../config/config";
import {NewCategoryExpanses} from "./components/newCategoryExpanses";
import {EditCategoryExpanses} from "./components/editCategoryExpanses";
import {IncomeAndExpanses} from "./components/incomeAndExpanses";
import {CreatIncomeExpanses} from "./components/creatIncomeExpanses";
import {EditIncomeExpanses} from "./components/editIncomeExpanses";
import {MainPage} from "./components/mainPage";
import {RouteType} from "./types/route.type";
import {UserInfoType} from "./types/user-info.type";

export class Router {
    readonly contentElement: HTMLElement | null;
    readonly stylesElement: HTMLElement | null;
    readonly titleElement: HTMLElement | null;
    private profileElement: HTMLElement | null;
    private profileFullNameElement: HTMLElement | null;

    private routes: RouteType[];

    constructor() {
        this.contentElement  =  document.getElementById('content');
        this.stylesElement  =  document.getElementById('styles');
        this.titleElement  =  document.getElementById('title');
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');

        this.routes = [
            {
                route: '#/',
                title: 'Логин',
                template: 'templates/index.html',
                styles: 'styles/login.css',
                load: () => {
                    new Register('index')
                }
            },
            {
                route: '#/register',
                title: 'Регистрация',
                template: 'templates/register.html',
                styles: 'styles/register.css',
                scripts: 'src/components/index.js',
                load: () => {
                    new Register('register');
                }
            },
            {
                route: '#/mainIncomes',
                title: 'Доходы',
                template: 'templates/mainIncomes.html',
                styles: 'styles/mainIncomes.css',
                scripts: 'src/components/mainIncomes.ts',
                load: () => {
                    new MainIncomes();
                }
            },
            {
                route: '#/editCategoryIncome',
                title: 'Редактирование доходов',
                template: 'templates/editCategoryIncome.html',
                styles: 'styles/editCategoryIncome.css',
                scripts: 'src/components/editCategoryIncome.ts',
                load: () => {
                    new EditCategoryIncome();
                }
            },
            {
                route: '#/newCategoryIncome',
                title: 'Создание новых доходов',
                template: 'templates/newCategoryIncome.html',
                styles: 'styles/newCategoryIncome.css',
                scripts: 'src/components/newCategoryIncome.ts',
                load: () => {
                    new NewCategoryIncome();
                }
            },
            {
                route: '#/mainExpenses',
                title: 'Расходы',
                template: 'templates/mainExpenses.html',
                styles: 'styles/mainExpenses.css',
                scripts: 'src/components/mainExpenses.ts',
                load: () => {
                    new MainExpenses();
                }
            },
            {
                route: '#/newCategoryExpanses',
                title: 'Создание новых расходов',
                template: 'templates/newCategoryExpanses.html',
                styles: 'styles/newCategoryExpanses.css',
                scripts: 'src/components/newCategoryExpanses.ts',
                load: () => {
                    new NewCategoryExpanses();
                }
            },
            {
                route: '#/editCategoryExpanses',
                title: 'Редактирование расходов',
                template: 'templates/editCategoryExpanses.html',
                styles: 'styles/editCategoryExpanses.css',
                scripts: 'src/components/editCategoryExpanses.ts',
                load: () => {
                    new EditCategoryExpanses();
                }
            },
            {
                route: '#/incomeAndExpanses',
                title: 'Страница Доходов и Расходов',
                template: 'templates/incomeAndExpanses.html',
                styles: 'styles/incomeAndExpanses.css',
                scripts: 'src/components/incomeAndExpanses.ts',
                load: () => {
                    new IncomeAndExpanses();
                }
            },
            {
                route: '#/creatIncomeExpanses',
                title: 'Создание Доходов и Расходов',
                template: 'templates/creatIncomeExpanses.html',
                styles: 'styles/creatIncomeExpanses.css',
                scripts: 'src/components/creatIncomeExpanses.ts',
                load: () => {
                    new CreatIncomeExpanses();
                }
            },
            {
                route: '#/editIncomeExpanses',
                title: 'Редактирование Расходов и Доходов',
                template: 'templates/editIncomeExpanses.html',
                styles: 'styles/editIncomeExpanses.css',
                scripts: 'src/components/editIncomeExpanses.ts',
                load: () => {
                    new EditIncomeExpanses();
                }
            },
            {
                route: '#/mainPage',
                title: 'Главная страница',
                template: 'templates/mainPage.html',
                styles: 'styles/mainPage.css',
                scripts: 'src/components/mainPage.ts',
                load: () => {
                    new MainPage();
                }
            },
        ]
    }

    public async openRoute(): Promise<void> {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/';
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        if (!this.contentElement || !this.stylesElement || !this.titleElement) {
            if (urlRoute === '#/') {
                return
            } else {
                window.location.href = '#/';
                return
            }
        }

        this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        this.stylesElement.setAttribute('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title;



        const userInfo: UserInfoType | null = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            this.getBalance();
        } else {
            // this.profileElement.style.display = 'none';
        }


       if (urlRoute !== '#/' && urlRoute !== '#/register') {
               if (!accessToken) {
                   window.location.href = '#/';
                   return;
               }
       }


        newRoute.load()
    }

    public async getBalance(): Promise<void> {
        const res = await CustomHttp.request(config.host + '/balance');
        if (document.querySelector('.userBalance')) {
            (document.querySelector('.userBalance') as HTMLElement).innerHTML = `${res.balance}$`
        }

    }
}