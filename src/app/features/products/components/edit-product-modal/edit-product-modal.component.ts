import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Supplier } from '../../../../types/supplier/supplier';
import { ProductService } from '../../../../apis/products.service';
import { SupplierService } from '../../../../apis/supplier.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../../types/product/product';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    MatSelect,
    MatOption,
  ],
  templateUrl: './edit-product-modal.component.html',
  styleUrl: './edit-product-modal.component.scss'
})
export class EditProductModalComponent {
  productForm?: FormGroup;
  suppliers: Supplier[] = [];
  selectedSupplier?: Supplier;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private supplierService: SupplierService,
    public dialogRef: MatDialogRef<EditProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product }
  ) {
    this.createForm();
    this.loadSuppliers();
    this.setFormValues();
  }

  private createForm() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      supplier: [null, Validators.required]
    });
  }

  private setFormValues() {
    this.productForm!.patchValue({
      name: this.data.product.name,
      price: this.data.product.price,
      supplier: this.data.product.supplier.id
    });
  }

  private loadSuppliers() {
    this.supplierService.getSuppliers().subscribe(response => {
      this.suppliers = response.result;
    });
  }

  onSubmit() {
    if (this.productForm!.valid) {
      const product = { ...this.data.product, ...this.productForm!.value };

      product.supplier = this.suppliers.find(e => e.id == product.supplier)      

      this.productService.editProduct(this.data.product.id, product).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
