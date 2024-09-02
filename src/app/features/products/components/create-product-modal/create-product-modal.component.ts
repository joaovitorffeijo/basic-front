import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelect } from "@angular/material/select";
import { ProductService } from "../../../../apis/products.service";
import { SupplierService } from "../../../../apis/supplier.service";
import { Product } from "../../../../types/product/product";
import { Supplier } from "../../../../types/supplier/supplier";

@Component({
  selector: 'app-create-product-modal',
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
  templateUrl: './create-product-modal.component.html',
  styleUrls: ['./create-product-modal.component.scss']
})
export class CreateProductModalComponent {
  productForm?: FormGroup;
  suppliers: Supplier[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private supplierService: SupplierService,
    public dialogRef: MatDialogRef<CreateProductModalComponent>
  ) {
    this.createForm();
    this.loadSuppliers();
  }

  private createForm() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      supplier: [null, Validators.required]
    });
  }

  private loadSuppliers() {
    this.supplierService.getSuppliers().subscribe(response => {
      this.suppliers = response.result;
    });
  }

  onSubmit() {
    if (this.productForm!.valid) {
      const formValue = this.productForm!.value;
      const product: Product = {
        ...formValue,
        supplier: this.suppliers.find(e => e.id === formValue.supplier)
      };
  
      this.productService.saveProduct(product).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }  

  onCancel() {
    this.dialogRef.close(false);
  }
}