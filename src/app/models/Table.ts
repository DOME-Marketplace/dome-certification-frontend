export interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
  exportFunction?: any;
}

export interface ExportColumn {
  title: string;
  dataKey: string;
}
