import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { finalize, take } from 'rxjs';
import { FaqsService } from '../faqs.service';
import { CreateFaqPayload } from '../faq_data';


@Component({
    selector: 'app-faqs-create',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxEditorModule],
    templateUrl: './faqs-create.component.html',
    styleUrl: './faqs-create.component.scss',
})
export class FaqsCreateComponent implements OnInit, OnDestroy {
    private readonly fb = inject(FormBuilder);
    private readonly faqsService = inject(FaqsService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    isSubmitting = false;
    isSubmitted = false;
    apiError: string | null = null;

    readonly faqForm = this.fb.nonNullable.group({
        question: ['', Validators.required],
        answer: ['', Validators.required],
        is_active: [true],
    });

    editor!: Editor;
    readonly toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        [{ heading: ['h1', 'h2', 'h3'] }],
        ['ordered_list', 'bullet_list'],
        ['link'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
        // ['removeFormat'],
    ];

    get controls() {
        return this.faqForm.controls;
    }

    ngOnInit(): void {
        this.editor = new Editor();
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
            .createFaq(payload)
            .pipe(
                take(1),
                finalize(() => {
                    this.isSubmitting = false;
                })
            )
            .subscribe({
                next: () => this.navigateToFaqList(),
                error: (error) => {
                    this.apiError =
                        error?.error?.message ??
                        'Unable to create the FAQ right now. Please try again.';
                },
            });
    }

    onCancel(): void {
        this.navigateToFaqList();
    }

    private navigateToFaqList(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    ngOnDestroy(): void {
        this.editor?.destroy();
    }
}

