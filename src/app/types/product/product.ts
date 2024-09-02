import { Supplier } from "../supplier/supplier";

export interface Product {
  id: number;
  name: string;
  price: number;
  supplier: Supplier;
  createdAt: string;
  modifiedAt: string;
}