export interface ExternalProduct {
  id: string;
  href: string;
  description: string;
  isBundle: boolean;
  lastUpdate: Date;
  lifecycleStatus: string;
  name: string;
  version: string;
  category: ProductSpecification[];
  productSpecification: ProductSpecification;
  validFor: ValidFor;
}

export interface ProductSpecification {
  id: string;
  href: string;
  name: string;
  version: string;
}

export interface ValidFor {
  startDateTime: Date;
}
