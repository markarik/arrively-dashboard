import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { finalize, take } from 'rxjs';

import { CreateFaqPayload } from '../faq_data';
import { FaqsService } from '../faqs.service';

@Component({
    selector: 'app-faqs-edit',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxEditorModule],
    templateUrl: './faqs-edit.component.html',
    styleUrl: './faqs-edit.component.scss',
})
export class FaqsEditComponent implements OnInit, OnDestroy {
    private readonly fb = inject(FormBuilder);
    private readonly faqsService = inject(FaqsService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    editor!: Editor;
    loadError: string | null = null;
    apiError: string | null = null;
    isSubmitting = false;
    isSubmitted = false;
    faqId!: number;

    readonly faqForm = this.fb.nonNullable.group({
        question: ['', Validators.required],
        answer: ['', Validators.required],
        is_active: [true],
    });

    readonly toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        [{ heading: ['h1', 'h2', 'h3'] }],
        ['ordered_list', 'bullet_list'],
        ['link'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    get controls() {
        return this.faqForm.controls;
    }

    ngOnInit(): void {
        this.editor = new Editor();
        const idParam = this.route.snapshot.paramMap.get('id');
        const parsedId = Number(idParam);

        if (!parsedId) {
            this.loadError = 'Invalid FAQ identifier.';
            return;
        }

        this.faqId = parsedId;
        const cachedFaq = this.faqsService.getEditingFaq();

        if (!cachedFaq || cachedFaq.id !== this.faqId) {
            this.loadError = 'FAQ details are not available. Please return to the list and try editing again.';
            return;
        }

        this.faqForm.setValue({
            question: cachedFaq.question ?? '',
            answer: cachedFaq.answer ?? '',
            is_active: cachedFaq.is_active ?? true,
        });
    }

    onSubmit(): void {
        this.isSubmitted = true;
        this.apiError = null;

        if (this.faqForm.invalid) {
            return;
        }

        this.isSubmitting = true;
        const payload: CreateFaqPayload = this.faqForm.getRawValue();

        this.faqsService
            .updateFaq(this.faqId, payload)
            .pipe(
                take(1),
                finalize(() => {
                    this.isSubmitting = false;
                })
            )
            .subscribe({
                next: () => this.navigateBack(),
                error: (error) => {
                    this.apiError =
                        error?.error?.message ??
                        'Unable to update the FAQ right now. Please try again.';
                },
            });
    }

    onCancel(): void {
        this.navigateBack();
    }

    private navigateBack(): void {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }

    ngOnDestroy(): void {
        this.editor?.destroy();
    }
}

