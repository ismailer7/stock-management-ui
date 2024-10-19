import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {languages} from '../../../data/langs';
import {themes} from '../../../data/themes';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
    faBrush,
    faCaretDown,
    faColonSign,
    faComputer,
    faLanguage,
    faPaintBrush,
    faPaintRoller
} from "@fortawesome/free-solid-svg-icons";
import {faArtstation, faSymfony, faThemeco} from "@fortawesome/free-brands-svg-icons";
import {NgClass, TitleCasePipe} from "@angular/common";

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslateModule, FaIconComponent, TitleCasePipe, NgClass],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit{

    languages = languages;
    selectedLanguage = languages[0];
    themes = ['mytheme', ...themes]
    selectedTheme: string;

    constructor(private translate: TranslateService, private authService: AuthService) {
        translate.setDefaultLang('en');
    }

    ngOnInit(): void {
        this.selectedTheme = localStorage.getItem('theme') ?? 'mytheme';
        if (localStorage.getItem('language')) {
            this.selectedLanguage = JSON.parse(localStorage.getItem('language') ?? '') ?? languages[0];
            this.translate.use(this.selectedLanguage.lang);
        }
        document.body.setAttribute(
            'data-theme', this.selectedTheme);
    }


    changeLang(lang: string, index: any) {
        this.translate.use(lang);
        this.selectedLanguage = languages[index];
        localStorage.setItem('language', JSON.stringify(this.selectedLanguage));
    }

    changeTheme(theme: string) {
        document.body.setAttribute(
            'data-theme', theme);
        this.selectedTheme = theme;
        localStorage.setItem('theme', theme);
    }

    logout() {
        this.authService.logout();
    }


    protected readonly faComputer = faComputer;
    protected readonly faCaretDown = faCaretDown;
    protected readonly faThemeco = faThemeco;
    protected readonly faColonSign = faColonSign;
    protected readonly faSymfony = faSymfony;
    protected readonly faArtstation = faArtstation;
    protected readonly faPaintBrush = faPaintBrush;
    protected readonly faPaintRoller = faPaintRoller;
    protected readonly faLanguage = faLanguage;
    protected readonly faBrush = faBrush;
}
