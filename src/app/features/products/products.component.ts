import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Product } from '../../types/product/product';
import { ProductService } from '../../apis/products.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DateFormatPipe } from '../../util/pipe/date-format.pipe';
import { catchError, forkJoin, Observable, tap } from 'rxjs';
import { PageResponse } from '../../types/response/page-response';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProductModalComponent } from './components/delete-product-modal/delete-product-modal.component';
import { EditProductModalComponent } from './components/edit-product-modal/edit-product-modal.component';
import { CreateProductModalComponent } from './components/create-product-modal/create-product-modal.component';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { error } from 'console';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginator,
    MatSort,
    DateFormatPipe,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormField,
    MatLabel,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'price', 'supplier', 'createdAt', 'modifiedAt', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  loading: boolean = true;

  page: number = 0;
  size: number = 5;
  totalElements: number = 0;

  supplierId?: number;
  supplierName: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getData();
  }

  getData(): void {
    forkJoin([
      this.getProducts(),
    ]).subscribe(() => {
        this.loading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getProducts(): Observable<any> {
    return this.productService.getProductsPage(this.supplierId, this.page, this.size).pipe(
      tap((response: PageResponse<Product[]>) => {
        this.dataSource.data = response.result.content;
        this.totalElements = response.result.totalElements;
      }),
      catchError((error: any) => {
        throw error;
      })
    );
  }

  openCreateModal() {
    const dialogRef = this.dialog.open(CreateProductModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
        this.showSuccessMessage('Product created');
      }
    },
    error => {
      this.showErrorMessage('Product create', error.message)
   });
  }

  openEditModal(product: Product) {
    const dialogRef = this.dialog.open(EditProductModalComponent, {
      width: '400px',
      data: { product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
        this.showSuccessMessage('Product updated');
      }
    },
    error => {
       this.showErrorMessage('Product update', error.message)
    });
  }

  openDeleteDialog(product: Product): void {
    const dialogRef = this.dialog.open(DeleteProductModalComponent, {
      width: '400px',
      height: '250px',
      data: { id: product.id, name: product.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(product.id).subscribe(() => {
          this.getData();
          this.showSuccessMessage('Product deleted');
        },
        error => {
           this.showErrorMessage('Product deletion', error.message)
        });
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }

  onPageChange(event: PageEvent): void {
    this.loading = true;

    this.page = event.pageIndex;
    this.size = event.pageSize;

    this.getData();
  }

  showSuccessMessage(operation: string): void {
    Swal.fire({
      title: 'Success',
      text: `${operation} successful!`,
      icon: 'success',
      confirmButtonText: 'Ok',
      customClass: {
        container: 'swal-custom',
        popup: 'swal-custom',
        title: 'swal-custom',
        content: 'swal-custom',
        confirmButton: 'swal-custom'
      }
    });
  }
  
  showErrorMessage(operation: string, errorMessage: string): void {
    Swal.fire({
      title: 'Error',
      text: `${operation} failed: ${errorMessage}`,
      icon: 'error',
      confirmButtonText: 'Ok',
      customClass: {
        container: 'swal-custom',
        popup: 'swal-custom',
        title: 'swal-custom',
        content: 'swal-custom',
        confirmButton: 'swal-custom'
      }
    });
  }
}
