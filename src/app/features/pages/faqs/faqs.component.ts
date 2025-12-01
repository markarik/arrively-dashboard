import { CommonModule, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
    FormsModule,
    ReactiveFormsModule,
  
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { finalize, Subscription, take } from 'rxjs';

import { SharedModule } from 'src/app/shared/shared.module';
import { ListPipesModule } from 'src/app/core/pipes/list-pipes.module';
import { FAQDatum, FAQModel } from './faq_data';
import { FaqsService } from './faqs.service';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

@Component({
    selector: 'app-faqs',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        SharedModule,
        ListPipesModule,
        RouterModule,
        ConfirmDialogModule,
        BadgeModule,
        DrawerModule,
        AvatarModule,
        ButtonModule,
        TableModule,
        PaginatorModule,
    ],
    templateUrl: './faqs.component.html',
    styleUrl: './faqs.component.scss',
    providers: [ConfirmationService],
})
export class FaqsComponent implements OnDestroy {
    private readonly sanitizer = inject(DomSanitizer);

    // isUploading: boolean = false;
    visible: boolean = false;
    faqSelected: FAQDatum | null = null;
    safeHtmlContent: SafeHtml | null = null;
    isLoadingMore = false;

    // private sessionStore = inject(SessionStore);

    // isCreateTeam: boolean = false;

    clubCreateTeamSubscription!: Subscription;
    error: string | null = null;
    faqs: FAQModel = {};
    accountDetails: any;

   
    deletingIds = new Set<number>();

    constructor(
        private _router: ActivatedRoute,
        private router: Router,
        private faqsService: FaqsService,
        private confirmationService: ConfirmationService,
    ) {}


    ngOnInit(): void {
    

   

        this.getvehicleTypeResolver();
    }

    ngOnDestroy() {
        if (this.clubCreateTeamSubscription) {
            this.clubCreateTeamSubscription.unsubscribe();
        }
    }

    getvehicleTypeResolver(): void {
        this.clubCreateTeamSubscription = this._router.data.subscribe(
            (data: any) => {
                if (data.faqs) {
                    this.faqs = data.faqs;

                } else {
                    this.error = 'Failed to load data';
                }
            }
        );
    }

    viewQuestion(faq: FAQDatum): void {
        this.faqSelected = faq;
        this.safeHtmlContent = faq.answer
            ? this.sanitizer.bypassSecurityTrustHtml(faq.answer)
            : null;
        this.visible = true;
    }

    goToEdit(faq: FAQDatum): void {
        if (!faq.id) {
            return;
        }

        this.faqsService.setEditingFaq(faq);
        this.router.navigate(['edit', faq.id], { relativeTo: this._router });
    }

    confirmDeleteFaq(faq: FAQDatum): void {
        if (!faq.id) {
            return;
        }

        this.confirmationService.confirm({
            header: 'Delete FAQ',
            message: `Are you sure you want to delete "${faq.question}"? This action cannot be undone.`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => this.deleteFaq(faq.id!),
        });
    }

    private deleteFaq(id: number): void {
        this.deletingIds.add(id);

        this.faqsService
            .deleteFaq(id)
            .pipe(
                take(1),
                finalize(() => {
                    this.deletingIds.delete(id);
                })
            )
            .subscribe({
                next: () => {
                    const items = this.faqs.data ?? [];
                    this.faqs = {
                        ...this.faqs,
                        data: items.filter((faq) => faq.id !== id),
                    };
                },
                error: () => {
                    this.error = 'Unable to delete FAQ. Please try again.';
                },
            });
    }

    onPageChange(event: any): void {
        const page = event.page + 1;
        const pageSize = event.rows;
        this.faqsService
            .getFaqs(page, pageSize)
            .pipe(take(1))
            .subscribe({
                next: (data) => {
                    this.faqs = data;
                },
                error: () => {
                    this.error = 'Unable to load FAQs. Please try again.';
                },
            });
    }

    loadMore(): void {
        const currentPage = this.faqs.pagination?.page ?? 1;
        const totalPages = this.faqs.pagination?.total_pages ?? 1;
        const pageSize = this.faqs.pagination?.page_size ?? 10;

        if (currentPage >= totalPages || this.isLoadingMore) {
            return;
        }

        this.isLoadingMore = true;
        const nextPage = currentPage + 1;

        this.faqsService
            .getFaqs(nextPage, pageSize)
            .pipe(
                take(1),
                finalize(() => {
                    this.isLoadingMore = false;
                })
            )
            .subscribe({
                next: (data) => {
                    const existingData = this.faqs.data ?? [];
                    const newData = data.data ?? [];
                    this.faqs = {
                        ...data,
                        data: [...existingData, ...newData],
                    };
                },
                error: () => {
                    this.error = 'Unable to load more FAQs. Please try again.';
                },
            });
    }

    get hasMorePages(): boolean {
        const currentPage = this.faqs.pagination?.page ?? 1;
        const totalPages = this.faqs.pagination?.total_pages ?? 1;
        return currentPage < totalPages;
    }
}
