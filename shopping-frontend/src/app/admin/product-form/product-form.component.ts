import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AdminProduct, CreateProductRequest, UpdateProductRequest } from 'src/app/shared/models/product';

export type ProductFormMode = 'create' | 'edit';
export type ProductFormValue = CreateProductRequest | UpdateProductRequest;

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnChanges {
    @Input() mode: ProductFormMode = 'create';
    @Input() product: AdminProduct | null = null;

    @Output() formSubmit = new EventEmitter<ProductFormValue>();
    @Output() formCancel = new EventEmitter<void>();

    form: FormGroup = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        quantity: [0, [Validators.required, Validators.min(0)]],
        retailPrice: [0, [Validators.required, Validators.min(0)]],
        wholesalePrice: [0, [Validators.required, Validators.min(0)]]
    });

    constructor(private fb: FormBuilder) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['product'] || changes['mode']) {
            this.resetForm();
        }
    }

    get title(): string {
        return this.mode === 'edit' ? 'Edit Product' : 'Add New Product';
    }

    get submitLabel(): string {
        return this.mode === 'edit' ? 'Update Product' : 'Create Product';
    }

    submit(): void {
        if (this.form.invalid) return;
        this.formSubmit.emit(this.form.value);
    }

    cancel(): void {
        this.formCancel.emit();
    }

    private resetForm(): void {
        this.form.reset({
            name: this.product?.productName ?? '',
            description: this.product?.description ?? '',
            quantity: this.product?.quantity ?? 0,
            retailPrice: this.product?.retailPrice ?? 0,
            wholesalePrice: this.product?.wholesalePrice ?? 0
        });
    }
}
